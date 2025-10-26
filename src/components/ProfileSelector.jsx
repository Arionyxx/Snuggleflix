import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Check } from 'lucide-react'
import { profileService, avatars } from '../services/profileService'
import './ProfileSelector.css'

function ProfileSelector({ onSelectProfile }) {
  const [profiles, setProfiles] = useState(profileService.getProfiles())
  const [showCreateProfile, setShowCreateProfile] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null)
  const [newProfileName, setNewProfileName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0])
  const [isKid, setIsKid] = useState(false)

  const handleSelectProfile = (profile) => {
    profileService.setActiveProfile(profile.id)
    onSelectProfile(profile)
  }

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      const newProfile = profileService.createProfile(newProfileName, selectedAvatar, isKid)
      setProfiles(profileService.getProfiles())
      setShowCreateProfile(false)
      setNewProfileName('')
      setSelectedAvatar(avatars[0])
      setIsKid(false)
      handleSelectProfile(newProfile)
    }
  }

  const handleDeleteProfile = (e, profileId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this profile?')) {
      profileService.deleteProfile(profileId)
      setProfiles(profileService.getProfiles())
    }
  }

  const handleEditProfile = (e, profile) => {
    e.stopPropagation()
    setEditingProfile(profile)
    setNewProfileName(profile.name)
    setSelectedAvatar(profile.avatar)
    setIsKid(profile.isKid)
    setShowCreateProfile(true)
  }

  const handleUpdateProfile = () => {
    if (editingProfile && newProfileName.trim()) {
      profileService.updateProfile(editingProfile.id, {
        name: newProfileName,
        avatar: selectedAvatar,
        isKid
      })
      setProfiles(profileService.getProfiles())
      setShowCreateProfile(false)
      setEditingProfile(null)
      setNewProfileName('')
      setSelectedAvatar(avatars[0])
      setIsKid(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const profileVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    }
  }

  if (showCreateProfile) {
    return (
      <div className="profile-selector">
        <motion.div 
          className="profile-creator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>{editingProfile ? 'Edit Profile' : 'Create Profile'}</h2>
          
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Enter name"
              maxLength={20}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Choose Avatar</label>
            <div className="avatar-grid">
              {avatars.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  className={`avatar-btn ${selectedAvatar.id === avatar.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="avatar-emoji">{avatar.emoji}</span>
                  {selectedAvatar.id === avatar.id && (
                    <div className="avatar-check">
                      <Check size={16} />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isKid}
                onChange={(e) => setIsKid(e.target.checked)}
              />
              <span>Kid Profile (age-appropriate content)</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              className="btn btn-primary"
              onClick={editingProfile ? handleUpdateProfile : handleCreateProfile}
              disabled={!newProfileName.trim()}
            >
              {editingProfile ? 'Update' : 'Create'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setShowCreateProfile(false)
                setEditingProfile(null)
                setNewProfileName('')
                setSelectedAvatar(avatars[0])
                setIsKid(false)
              }}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="profile-selector">
      <motion.div
        className="profile-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Who's watching?</h1>
      </motion.div>

      <motion.div
        className="profiles-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {profiles.map((profile) => (
          <motion.div
            key={profile.id}
            className="profile-card"
            variants={profileVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectProfile(profile)}
          >
            <div className="profile-avatar">
              <span className="profile-emoji">{profile.avatar.emoji}</span>
              {profile.isKid && <span className="kid-badge">Kid</span>}
            </div>
            <h3 className="profile-name">{profile.name}</h3>
            <div className="profile-actions">
              <button
                className="profile-action-btn"
                onClick={(e) => handleEditProfile(e, profile)}
                title="Edit profile"
              >
                <Edit2 size={16} />
              </button>
              {profiles.length > 1 && (
                <button
                  className="profile-action-btn delete"
                  onClick={(e) => handleDeleteProfile(e, profile.id)}
                  title="Delete profile"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {profiles.length < 5 && (
          <motion.div
            className="profile-card add-profile"
            variants={profileVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateProfile(true)}
          >
            <div className="profile-avatar">
              <Plus size={48} />
            </div>
            <h3 className="profile-name">Add Profile</h3>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ProfileSelector
