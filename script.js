// Site Configuration
const SITE_NAME = "SnuggleFlix";

// TMDB API Configuration
// Get your FREE API Read Access Token from: https://www.themoviedb.org/settings/api
// Use the LONG token (Bearer token), not the short API key!
// ⚠️ IMPORTANT: Add your TMDB API token here!
// Get it from: https://www.themoviedb.org/settings/api
// Use the LONG "API Read Access Token" (Bearer token)
const TMDB_API_READ_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjViMmJhYjlhOGI2ZGE4YThhODYzMjhkMGQ0MDgyMCIsIm5iZiI6MTc1OTU4MzI2Ny44MzcsInN1YiI6IjY4ZTExYzIzMDE1MTM0ZDQ1NjYxNzAyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XEhh_S74qPv2JLOFhXJXhfhtIUQJtGZ1oFnxiUvIPkg";

// For quick setup: Uncomment the line below and paste your token
// const TMDB_API_READ_ACCESS_TOKEN = "eyJhbG...your-token-here";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

// API request headers
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_READ_ACCESS_TOKEN}`,
  },
};

// Genre mapping
const genreMap = {};

// Fetch genre list
async function fetchGenres() {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list`,
      API_OPTIONS,
    );
    const data = await response.json();
    data.genres.forEach((genre) => {
      genreMap[genre.id] = genre.name;
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}

// Fetch movies by category
async function fetchMovies(endpoint, params = "") {
  try {
    const url = params
      ? `${TMDB_BASE_URL}${endpoint}?${params.replace(/^&/, "")}`
      : `${TMDB_BASE_URL}${endpoint}`;
    const response = await fetch(url, API_OPTIONS);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

// Fetch TV show details including seasons
async function fetchTVShowDetails(tvId) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?append_to_response=credits`,
      API_OPTIONS,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}

// Fetch season details with episodes
async function fetchSeasonDetails(tvId, seasonNumber) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}`,
      API_OPTIONS,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching season details:", error);
    return null;
  }
}

// Get genre names from IDs
function getGenreNames(genreIds) {
  return genreIds.map((id) => genreMap[id] || "Unknown").slice(0, 3);
}

// Format runtime
function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

// Generate random gradient for cards without posters
function getRandomGradient() {
  const colors = [
    ["#b4befe", "#cba6f7"], // lavender to mauve
    ["#89b4fa", "#74c7ec"], // blue to sapphire
    ["#f5c2e7", "#eba0ac"], // pink to maroon
    ["#94e2d5", "#89dceb"], // teal to sky
    ["#a6e3a1", "#f9e2af"], // green to yellow
    ["#fab387", "#f38ba8"], // peach to red
  ];
  const gradient = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`;
}

// Create content card
function createContentCard(movie, index, isTop10 = false) {
  const card = document.createElement("div");
  card.className = "content-card";

  // Use poster image if available, otherwise use gradient
  if (movie.poster_path || movie.backdrop_path) {
    const imagePath = movie.poster_path || movie.backdrop_path;
    card.style.backgroundImage = `url(${TMDB_IMAGE_BASE_URL}${imagePath})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
  } else {
    card.style.background = getRandomGradient();
  }

  if (isTop10) {
    const rankNumber = document.createElement("div");
    rankNumber.className = "rank-number";
    rankNumber.textContent = index + 1;
    card.appendChild(rankNumber);
  }

  const overlay = document.createElement("div");
  overlay.className = "card-overlay";

  const title = movie.title || movie.name;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date
      ? new Date(movie.first_air_date).getFullYear()
      : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const genres = movie.genre_ids ? getGenreNames(movie.genre_ids) : [];

  overlay.innerHTML = `
        <div class="card-title">${title}</div>
        <div class="card-info">
            <span>${year}</span>
            <span>⭐ ${rating}</span>
        </div>
        <div class="card-genres">${genres.join(" • ")}</div>
    `;

  card.appendChild(overlay);

  // Add click event to open modal
  card.addEventListener("click", () => openModal(movie));

  return card;
}

// Fetch detailed movie info
async function fetchMovieDetails(movieId, mediaType = "movie") {
  try {
    const [details, credits] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/${mediaType}/${movieId}`, API_OPTIONS).then((r) =>
        r.json(),
      ),
      fetch(
        `${TMDB_BASE_URL}/${mediaType}/${movieId}/credits`,
        API_OPTIONS,
      ).then((r) => r.json()),
    ]);

    return { ...details, credits };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Populate content rows with TMDB data
async function populateRows() {
  // Fetch genres first
  await fetchGenres();

  const categories = [
    { selector: "trending", endpoint: "/trending/all/week", params: "" },
    { selector: "top10", endpoint: "/movie/top_rated", params: "" },
    {
      selector: "scifi",
      endpoint: "/discover/movie",
      params: "with_genres=878&sort_by=popularity.desc",
    },
    {
      selector: "drama",
      endpoint: "/discover/movie",
      params: "with_genres=18&sort_by=vote_average.desc&vote_count.gte=1000",
    },
    {
      selector: "action",
      endpoint: "/discover/movie",
      params: "with_genres=28&sort_by=popularity.desc",
    },
    {
      selector: "anime",
      endpoint: "/discover/movie",
      params: "with_genres=16&with_keywords=210024&sort_by=popularity.desc",
    },
  ];

  for (const category of categories) {
    const rowItems = document.querySelector(
      `.row-items[data-category="${category.selector}"]`,
    );
    if (rowItems) {
      const movies = await fetchMovies(category.endpoint, category.params);
      const displayMovies = movies.slice(
        0,
        category.selector === "top10" ? 10 : 15,
      );

      displayMovies.forEach((movie, index) => {
        const card = createContentCard(
          movie,
          index,
          category.selector === "top10",
        );
        rowItems.appendChild(card);
      });
    }
  }

  // Setup scroll animations after content is loaded
  setupScrollAnimations();
}

// Scroll functionality for content rows
function setupScrollButtons() {
  const scrollButtons = document.querySelectorAll(".scroll-btn");

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const container = button.parentElement;
      const rowItems = container.querySelector(".row-items");
      const scrollAmount = 600;

      if (button.classList.contains("scroll-left")) {
        rowItems.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        rowItems.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    });
  });
}

// Navbar scroll effect
function setupNavbar() {
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Search functionality
function setupSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const searchContainer = document.getElementById("searchContainer");
  const closeSearch = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");
  const searchResultsSection = document.getElementById("searchResultsSection");
  const searchResults = document.getElementById("searchResults");
  const closeResults = document.getElementById("closeResults");
  const noResults = document.getElementById("noResults");
  const hero = document.getElementById("hero");
  const contentWrapper = document.querySelector(".content-wrapper");

  searchBtn.addEventListener("click", () => {
    searchContainer.classList.add("active");
    searchInput.focus();
  });

  closeSearch.addEventListener("click", () => {
    searchContainer.classList.remove("active");
    searchInput.value = "";
    hideSearchResults();
  });

  closeResults.addEventListener("click", () => {
    hideSearchResults();
    searchInput.value = "";
  });

  function hideSearchResults() {
    searchResultsSection.classList.remove("active");
    hero.style.display = "block";
    contentWrapper.style.display = "block";
  }

  function showSearchResults() {
    searchResultsSection.classList.add("active");
    hero.style.display = "none";
    contentWrapper.style.display = "none";
  }

  // Search with debounce
  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const searchTerm = e.target.value.trim();

    if (searchTerm.length < 2) {
      hideSearchResults();
      return;
    }

    searchTimeout = setTimeout(async () => {
      const results = await fetchMovies(
        "/search/multi",
        `query=${encodeURIComponent(searchTerm)}`,
      );

      displaySearchResults(results, searchTerm);
    }, 500);
  });

  function displaySearchResults(results, query) {
    // Update query text
    document.getElementById("searchQuery").textContent = query;
    document.getElementById("searchResultsCount").textContent = results.length;

    // Clear previous results
    searchResults.innerHTML = "";

    if (results.length === 0) {
      noResults.style.display = "flex";
      searchResults.style.display = "none";
      showSearchResults();
      return;
    }

    noResults.style.display = "none";
    searchResults.style.display = "grid";
    showSearchResults();

    // Display results
    results.forEach((item) => {
      const resultCard = document.createElement("div");
      resultCard.className = "search-result-card";

      const imagePath = item.poster_path || item.backdrop_path;
      const title = item.title || item.name || "Untitled";
      const mediaType = item.media_type === "tv" ? "TV Show" : "Movie";
      const year = item.release_date || item.first_air_date || "";
      const yearFormatted = year ? new Date(year).getFullYear() : "N/A";
      const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
      const overview = item.overview || "No description available.";

      // Create image HTML - use placeholder if no image
      let imageHTML;
      if (imagePath) {
        const imageUrl = `${TMDB_IMAGE_BASE_URL}${imagePath}`;
        imageHTML = `<img src="${imageUrl}" alt="${title}" loading="lazy">`;
      } else {
        imageHTML = `<div class="search-result-placeholder">
          <i class="fas fa-film"></i>
          <span>${title}</span>
        </div>`;
      }

      resultCard.innerHTML = `
        <div class="search-result-image">
          ${imageHTML}
          <div class="search-result-overlay">
            <button class="search-play-btn">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
        <div class="search-result-info">
          <h3 class="search-result-title">${title}</h3>
          <div class="search-result-meta">
            <span class="search-result-type">${mediaType}</span>
            <span class="search-result-year">${yearFormatted}</span>
            <span class="search-result-rating">
              <i class="fas fa-star"></i> ${rating}
            </span>
          </div>
          <p class="search-result-description">${overview.substring(0, 150)}${overview.length > 150 ? "..." : ""}</p>
        </div>
      `;

      // Add click handler to play
      const playBtn = resultCard.querySelector(".search-play-btn");
      playBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        playContent(item);
      });

      // Add click handler to whole card for more info
      resultCard.addEventListener("click", () => {
        openModal(item);
      });

      searchResults.appendChild(resultCard);
    });
  }
}

// Profile dropdown functionality
function setupProfileDropdown() {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target)) {
      profileDropdown.classList.remove("active");
    }
  });

  // Handle dropdown item clicks
  const dropdownItems = profileDropdown.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const text = item.querySelector("span").textContent;

      if (text === "Logout") {
        handleLogout();
      } else if (text === "Settings") {
        openSettingsModal();
      } else if (text === "My Profile") {
        openProfileModal();
      } else if (text === "My List") {
        console.log("Opening my list...");
        alert("My List page - Coming soon!");
      } else if (text === "Help Center") {
        console.log("Opening help center...");
        alert("Help Center - Coming soon!");
      }

      profileDropdown.classList.remove("active");
    });
  });
}

// Handle logout
function handleLogout() {
  const confirmed = confirm("Are you sure you want to logout?");
  if (confirmed) {
    console.log("Logging out...");
    // Add logout animation
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      alert("You have been logged out successfully!");
      // In a real app, you would redirect to login page or clear session
      document.body.style.opacity = "1";
    }, 500);
  }
}

// Settings Modal functionality
function openSettingsModal() {
  const settingsModal = document.getElementById("settingsModal");
  settingsModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSettingsModal() {
  const settingsModal = document.getElementById("settingsModal");
  settingsModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function setupSettingsModal() {
  const settingsClose = document.getElementById("settingsClose");
  const cancelSettings = document.getElementById("cancelSettings");
  const saveSettings = document.getElementById("saveSettings");
  const settingsModal = document.getElementById("settingsModal");

  settingsClose.addEventListener("click", closeSettingsModal);
  cancelSettings.addEventListener("click", closeSettingsModal);

  saveSettings.addEventListener("click", () => {
    // Get all settings values
    const autoPlayNext = document.querySelector(
      '.settings-section input[type="checkbox"]',
    ).checked;

    console.log("Saving settings...", { autoPlayNext });

    // Show success message
    const btn = saveSettings;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    btn.style.background = "var(--ctp-green)";

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = "";
      closeSettingsModal();
    }, 1500);
  });

  // Close on outside click
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      closeSettingsModal();
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && settingsModal.classList.contains("active")) {
      closeSettingsModal();
    }
  });
}

// Profile Modal functionality
function openProfileModal() {
  const profileModal = document.getElementById("profileModal");
  profileModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProfileModal() {
  const profileModal = document.getElementById("profileModal");
  profileModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function setupProfileModal() {
  const profileModalClose = document.getElementById("profileModalClose");
  const cancelProfile = document.getElementById("cancelProfile");
  const saveProfile = document.getElementById("saveProfile");
  const profileModal = document.getElementById("profileModal");
  const changeAvatarBtn = document.querySelector(".btn-change-avatar");

  profileModalClose.addEventListener("click", closeProfileModal);
  cancelProfile.addEventListener("click", closeProfileModal);

  saveProfile.addEventListener("click", () => {
    // Get all profile values
    const username = document.getElementById("profileUsername").value;
    const email = document.getElementById("profileEmail").value;
    const phone = document.getElementById("profilePhone").value;
    const bio = document.getElementById("profileBio").value;

    console.log("Saving profile...", { username, email, phone, bio });

    // Show success message
    const btn = saveProfile;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    btn.style.background = "var(--ctp-green)";

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = "";
      closeProfileModal();
    }, 1500);
  });

  // Change avatar functionality
  changeAvatarBtn.addEventListener("click", () => {
    const seeds = [
      "User",
      "Felix",
      "Max",
      "Bella",
      "Lucy",
      "Charlie",
      "Luna",
      "Daisy",
    ];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;

    document.querySelector(".profile-avatar-large").src = newAvatarUrl;
    document.querySelector(".profile img").src = newAvatarUrl;
    document.querySelector(".dropdown-header img").src = newAvatarUrl;
  });

  // Close on outside click
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) {
      closeProfileModal();
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && profileModal.classList.contains("active")) {
      closeProfileModal();
    }
  });
}

// Video Player Functions
function getStreamUrl(movie) {
  const type = movie.media_type === "tv" ? "tv" : "movie";
  const id = movie.id;
  const season = movie.season || 1;
  const episode = movie.episode || 1;

  if (type === "tv") {
    return `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
  }
  return `https://vidsrc.to/embed/movie/${id}`;
}

function getAlternativeStreamUrls(movie) {
  const type = movie.media_type === "tv" ? "tv" : "movie";
  const id = movie.id;
  const season = movie.season || 1;
  const episode = movie.episode || 1;

  const sources = [
    {
      name: "VidSrc",
      icon: "fas fa-play-circle",
      url:
        type === "tv"
          ? `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
          : `https://vidsrc.to/embed/movie/${id}`,
    },
    {
      name: "VidSrc Pro",
      icon: "fas fa-star",
      url:
        type === "tv"
          ? `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`
          : `https://vidsrc.pro/embed/movie/${id}`,
    },
    {
      name: "SuperEmbed",
      icon: "fas fa-bolt",
      url: `https://multiembed.mov/?video_id=${id}&tmdb=1${type === "tv" ? `&s=${season}&e=${episode}` : ""}`,
    },
    {
      name: "2Embed",
      icon: "fas fa-film",
      url:
        type === "tv"
          ? `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`
          : `https://www.2embed.cc/embed/${id}`,
    },
    {
      name: "Embed.su",
      icon: "fas fa-video",
      url:
        type === "tv"
          ? `https://embed.su/embed/tv/${id}/${season}/${episode}`
          : `https://embed.su/embed/movie/${id}`,
    },
  ];

  return sources;
}

async function openVideoPlayer(movie) {
  const videoPlayerModal = document.getElementById("videoPlayerModal");
  const videoPlayerIframe = document.getElementById("videoPlayerIframe");
  const videoPlayerTitle = document.getElementById("videoPlayerTitle");
  const videoLoading = document.getElementById("videoLoading");
  const sourceList = document.getElementById("sourceList");
  const episodeSelector = document.getElementById("episodeSelector");

  const title = movie.title || movie.name;
  const mediaType = movie.media_type || "movie";
  const isTV = mediaType === "tv";

  // Initialize season/episode if not set
  if (isTV && !movie.season) {
    movie.season = 1;
    movie.episode = 1;
  }

  videoPlayerTitle.textContent = isTV
    ? `${title} - S${movie.season} E${movie.episode}`
    : `Now Playing: ${title}`;

  // Show/hide episode selector for TV shows
  if (isTV) {
    episodeSelector.style.display = "block";
    await setupEpisodeSelector(movie);
  } else {
    episodeSelector.style.display = "none";
  }

  // Show loading
  videoLoading.classList.remove("hidden");

  // Get all streaming sources
  const sources = getAlternativeStreamUrls(movie);
  let currentSourceIndex = 0;

  // Populate source list
  sourceList.innerHTML = "";
  sources.forEach((source, index) => {
    const sourceItem = document.createElement("div");
    sourceItem.className = `source-item ${index === 0 ? "active" : ""}`;
    sourceItem.innerHTML = `
      <i class="${source.icon}"></i>
      <span>${source.name}</span>
    `;
    sourceItem.addEventListener("click", () => {
      loadVideoSource(source.url, index);
      document.querySelectorAll(".source-item").forEach((item) => {
        item.classList.remove("active");
      });
      sourceItem.classList.add("active");
      document.getElementById("sourceDropdown").classList.remove("active");
    });
    sourceList.appendChild(sourceItem);
  });

  // Load first source
  function loadVideoSource(url, index) {
    currentSourceIndex = index;
    videoLoading.classList.remove("hidden");
    videoPlayerIframe.src = url;
  }

  loadVideoSource(sources[0].url, 0);

  // Hide loading after iframe loads
  videoPlayerIframe.onload = () => {
    setTimeout(() => {
      videoLoading.classList.add("hidden");
    }, 1000);
  };

  // Show modal
  videoPlayerModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Store current movie for source switching
  videoPlayerModal.dataset.movieData = JSON.stringify(movie);
}

// Setup episode selector for TV shows
async function setupEpisodeSelector(movie) {
  const seasonSelect = document.getElementById("seasonSelect");
  const episodeGrid = document.getElementById("episodeGrid");

  // Fetch TV show details to get all seasons
  const tvDetails = await fetchTVShowDetails(movie.id);
  if (!tvDetails || !tvDetails.seasons) return;

  // Populate season dropdown
  seasonSelect.innerHTML = "";
  tvDetails.seasons.forEach((season) => {
    if (season.season_number === 0) return; // Skip specials
    const option = document.createElement("option");
    option.value = season.season_number;
    option.textContent = `Season ${season.season_number} (${season.episode_count} episodes)`;
    if (season.season_number === movie.season) {
      option.selected = true;
    }
    seasonSelect.appendChild(option);
  });

  // Load episodes for current season
  await loadEpisodes(movie, movie.season);

  // Handle season change
  seasonSelect.addEventListener("change", async (e) => {
    movie.season = parseInt(e.target.value);
    movie.episode = 1;
    await loadEpisodes(movie, movie.season);
  });
}

// Load episodes for a specific season
async function loadEpisodes(movie, seasonNumber) {
  const episodeGrid = document.getElementById("episodeGrid");
  episodeGrid.innerHTML =
    '<div class="loading-episodes">Loading episodes...</div>';

  const seasonDetails = await fetchSeasonDetails(movie.id, seasonNumber);
  if (!seasonDetails || !seasonDetails.episodes) {
    episodeGrid.innerHTML = '<div class="no-episodes">No episodes found</div>';
    return;
  }

  episodeGrid.innerHTML = "";
  seasonDetails.episodes.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = `episode-card ${episode.episode_number === movie.episode ? "active" : ""}`;
    episodeCard.innerHTML = `
      <div class="episode-number">${episode.episode_number}</div>
      <div class="episode-info">
        <div class="episode-title">${episode.name || `Episode ${episode.episode_number}`}</div>
        <div class="episode-runtime">${episode.runtime ? episode.runtime + "min" : ""}</div>
      </div>
    `;

    episodeCard.addEventListener("click", () => {
      movie.episode = episode.episode_number;
      // Reload video player with new episode
      openVideoPlayer(movie);
    });

    episodeGrid.appendChild(episodeCard);
  });
}

function closeVideoPlayer() {
  const videoPlayerModal = document.getElementById("videoPlayerModal");
  const videoPlayerIframe = document.getElementById("videoPlayerIframe");

  videoPlayerModal.classList.remove("active");
  videoPlayerIframe.src = "";
  document.body.style.overflow = "auto";
}

function setupVideoPlayer() {
  const videoPlayerClose = document.getElementById("videoPlayerClose");
  const videoPlayerModal = document.getElementById("videoPlayerModal");
  const sourceSelector = document.getElementById("sourceSelector");
  const sourceDropdown = document.getElementById("sourceDropdown");

  videoPlayerClose.addEventListener("click", closeVideoPlayer);

  // Close on outside click
  videoPlayerModal.addEventListener("click", (e) => {
    if (e.target === videoPlayerModal) {
      closeVideoPlayer();
    }
  });

  // Source selector toggle
  sourceSelector.addEventListener("click", () => {
    sourceDropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !sourceSelector.contains(e.target) &&
      !sourceDropdown.contains(e.target)
    ) {
      sourceDropdown.classList.remove("active");
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoPlayerModal.classList.contains("active")) {
      closeVideoPlayer();
    }
  });
}

// Modal functionality
async function openModal(movie) {
  const modal = document.getElementById("contentModal");
  modal.classList.add("active");

  const movieId = movie.id;
  const mediaType = movie.media_type || "movie";

  // Show basic info immediately
  const title = movie.title || movie.name;
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date
      ? new Date(movie.first_air_date).getFullYear()
      : "N/A";
  const rating = movie.adult ? "R" : movie.vote_average > 7 ? "PG-13" : "PG";
  const match = Math.round(movie.vote_average * 10);

  modal.querySelector(".modal-title").textContent = title;
  modal.querySelector(".match-score").textContent = `${match}% Match`;
  modal.querySelector(".year").textContent = year;
  modal.querySelector(".rating").textContent = rating;
  modal.querySelector(".modal-description").textContent =
    movie.overview || "No description available.";

  // Set background
  if (movie.backdrop_path) {
    modal.querySelector(".modal-hero").style.backgroundImage =
      `url(${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path})`;
    modal.querySelector(".modal-hero").style.backgroundSize = "cover";
    modal.querySelector(".modal-hero").style.backgroundPosition = "center";
  } else {
    modal.querySelector(".modal-hero").style.background = getRandomGradient();
  }

  // Fetch and display detailed info
  const details = await fetchMovieDetails(movieId, mediaType);

  if (details) {
    // Runtime/Duration
    const runtime = details.runtime
      ? formatRuntime(details.runtime)
      : details.episode_run_time?.[0]
        ? formatRuntime(details.episode_run_time[0])
        : "N/A";
    modal.querySelector(".duration").textContent = runtime;

    // Cast
    const cast =
      details.credits?.cast
        ?.slice(0, 5)
        .map((c) => c.name)
        .join(", ") || "N/A";
    modal.querySelector(".cast").textContent = cast;

    // Genres
    const genres = details.genres?.map((g) => g.name).join(", ") || "N/A";
    modal.querySelector(".genres").textContent = genres;

    // Director
    const director =
      details.credits?.crew?.find((c) => c.job === "Director")?.name || "N/A";
    modal.querySelector(".director").textContent = director;
  }

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  // Add play button functionality in modal
  const modalPlayBtn = modal.querySelector(".modal-buttons .btn-play");
  modalPlayBtn.onclick = () => {
    closeModal();
    openVideoPlayer(movie);
  };
}

function closeModal() {
  const modal = document.getElementById("contentModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function setupModal() {
  const modalClose = document.getElementById("modalClose");
  const modal = document.getElementById("contentModal");

  modalClose.addEventListener("click", closeModal);

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

// Hero section with TMDB data
async function setupHeroSection() {
  const trending = await fetchMovies("/trending/movie/week", "");

  if (trending.length > 0) {
    const heroMovie = trending[0];
    const hero = document.getElementById("hero");
    const heroTitle = document.querySelector(".hero-title");
    const heroDescription = document.querySelector(".hero-description");

    // Set hero background
    if (heroMovie.backdrop_path) {
      hero.style.backgroundImage = `url(${TMDB_BACKDROP_BASE_URL}${heroMovie.backdrop_path})`;
      hero.style.backgroundSize = "cover";
      hero.style.backgroundPosition = "center";
    }

    heroTitle.textContent = heroMovie.title || heroMovie.name;
    heroDescription.textContent = heroMovie.overview;

    // Add play button functionality for hero
    const heroPlayBtn = document.querySelector(".hero .btn-play");
    if (heroPlayBtn) {
      heroPlayBtn.onclick = () => {
        openVideoPlayer(heroMovie);
      };
    }

    // Auto-rotate hero content
    let currentIndex = 0;
    const rotateInterval = 8000;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % Math.min(trending.length, 5);
      const movie = trending[currentIndex];

      heroTitle.style.opacity = "0";
      heroDescription.style.opacity = "0";

      setTimeout(() => {
        heroTitle.textContent = movie.title || movie.name;
        heroDescription.textContent = movie.overview;

        if (movie.backdrop_path) {
          hero.style.backgroundImage = `url(${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path})`;
        }

        heroTitle.style.opacity = "1";
        heroDescription.style.opacity = "1";
      }, 500);
    }, rotateInterval);

    heroTitle.style.transition = "opacity 0.5s ease";
    heroDescription.style.transition = "opacity 0.5s ease";
  }
}

// Add smooth reveal animation for content rows
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll(".content-row").forEach((row) => {
    row.style.opacity = "0";
    row.style.transform = "translateY(30px)";
    row.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(row);
  });
}

// Check if API token is set
function checkApiKey() {
  if (TMDB_API_READ_ACCESS_TOKEN === "YOUR_API_READ_ACCESS_TOKEN_HERE") {
    console.warn("⚠️ TMDB API Read Access Token not set!");
    console.log(
      "📝 Get your free API Read Access Token from: https://www.themoviedb.org/settings/api",
    );
    console.log(
      "⚡ Use the LONG Bearer token (API Read Access Token), not the short API key!",
    );
    console.log("Then add it to line 9 in script.js");

    // Show message to user with copy-paste instructions
    const hero = document.querySelector(".hero-description");
    hero.innerHTML = `
            <strong style="color: #f38ba8;">⚠️ API Read Access Token Required!</strong><br><br>
            <strong style="color: #cba6f7;">Quick Setup:</strong><br>
            1. Get your free TMDB <strong>API Read Access Token</strong> from
            <a href="https://www.themoviedb.org/settings/api" target="_blank" style="color: #89b4fa; text-decoration: underline;">themoviedb.org/settings/api</a><br>
            2. Copy the <strong>LONG</strong> Bearer token (starts with "eyJh...")<br>
            3. Open <code style="background: var(--ctp-surface0); padding: 2px 6px; border-radius: 3px;">script.js</code> and paste it at <strong>line 9</strong><br>
            4. Save and refresh this page<br><br>
            <small style="color: #a6adc8;">⚠️ Use the long API Read Access Token, NOT the short API key!</small><br>
            <small style="color: #a6adc8;">💡 Vercel environment variables don't work for client-side JavaScript</small>
        `;
    return false;
  }
  return true;
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  setupNavbar();
  setupSearch();
  setupModal();
  setupScrollButtons();
  setupProfileDropdown();
  setupSettingsModal();
  setupProfileModal();
  setupVideoPlayer();

  if (checkApiKey()) {
    console.log(`🎬 Loading real movies from TMDB for ${SITE_NAME}...`);
    await setupHeroSection();
    await populateRows();
    console.log(
      `✨ ${SITE_NAME} initialized with TMDB API and Catppuccin theme!`,
    );
  }
});

// Add keyboard navigation
document.addEventListener("keydown", (e) => {
  const focusedCard = document.querySelector(".content-card:focus");
  if (!focusedCard) return;

  switch (e.key) {
    case "ArrowLeft":
      focusedCard.previousElementSibling?.focus();
      break;
    case "ArrowRight":
      focusedCard.nextElementSibling?.focus();
      break;
    case "Enter":
      focusedCard.click();
      break;
  }
});
