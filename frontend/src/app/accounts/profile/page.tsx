"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Camera, Check } from "lucide-react"
import "./styles.css"

export default function ProfilePage() {
  const [username, setUsername] = useState("user123")
  const [profileImage, setProfileImage] = useState("")
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cuisineOptions = [
    { id: "chinese", label: "Chinese" },
    { id: "italian", label: "Italian" },
    { id: "american", label: "American" },
    { id: "mexican", label: "Mexican" },
    { id: "indian", label: "Indian" },
    { id: "japanese", label: "Japanese" },
    { id: "thai", label: "Thai" },
    { id: "mediterranean", label: "Mediterranean" },
  ]

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const userData = {
          username: "user123",
          profileImage: "/next/Images/WorkBreakLogo.png",
          cuisinePreferences: ["italian", "chinese"],
        }
        setUsername(userData.username)
        setProfileImage(userData.profileImage)
        setSelectedCuisines(userData.cuisinePreferences)
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }
    loadUserData()
  }, [])

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) fileInputRef.current.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) setProfileImage(e.target.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCuisineToggle = (cuisineId: string) => {
    setSelectedCuisines((prev) => {
      const updated = prev.includes(cuisineId)
        ? prev.filter((id) => id !== cuisineId)
        : [...prev, cuisineId]
      return updated
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="profile-page">
      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-content">
              <div className="profile-header">
                <h1 className="profile-title">Your Profile</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`edit-button ${isEditing ? "edit-cancel" : "edit-active"}`}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="profile-details">
                  <div className="image-section">
                    <div className={`image-wrapper ${isEditing ? "editable" : ""}`} onClick={handleImageClick}>
                      <Image src={profileImage || "/placeholder.svg"} alt="Profile" fill className="image" />
                      {isEditing && (
                        <div className="image-overlay">
                          <Camera className="overlay-icon" size={32} />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      disabled={!isEditing}
                    />
                    {isEditing && <p className="image-tip">Click to change profile picture</p>}
                  </div>

                  <div className="info-section">
                    <div className="username-group">
                      <label htmlFor="username" className="username-label">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`username-input ${isEditing ? "editable-input" : "readonly-input"}`}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="preference-section">
                  <h2 className="preference-title">Dietary Preferences</h2>
                  <p className="preference-description">
                    Select your preferred cuisines for lunch break recommendations:
                  </p>
                  <div className="cuisine-grid">
                    {cuisineOptions.map((cuisine) => (
                      <div
                        key={cuisine.id}
                        className={`cuisine-option ${isEditing ? "clickable" : ""} ${
                          selectedCuisines.includes(cuisine.id) ? "cuisine-selected" : "cuisine-unselected"
                        }`}
                        onClick={() => isEditing && handleCuisineToggle(cuisine.id)}
                      >
                        <div
                          className={`cuisine-check ${
                            selectedCuisines.includes(cuisine.id)
                              ? "check-filled"
                              : "check-empty"
                          }`}
                        >
                          {selectedCuisines.includes(cuisine.id) && <Check size={14} />}
                        </div>
                        <span className="cuisine-label">{cuisine.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="save-section">
                    <button
                      type="submit"
                      className="save-button"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}

                {saveSuccess && (
                  <div className="save-success">
                    <Check size={18} className="success-icon" />
                    Profile updated successfully!
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
