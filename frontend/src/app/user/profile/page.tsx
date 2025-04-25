"use client"

import React, {useEffect} from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, Check } from "lucide-react"
import "./styles.css"
import {BACKEND_ENDPOINT, default_image_url, useAppContext, User} from "@/app/AppContext";
import {getCookie} from "typescript-cookie";
import LogoutButton from "@/app/user/components/LogoutButton";

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

export default function ProfilePage() {
  const {user, setUser} = useAppContext()
  const [newUser, setNewUser] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errors, setErrors] = useState({"username":""});
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newImage, setNewImage] = useState<File>();

  useEffect(() => {
    setNewUser(user);
  }, [user])

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) fileInputRef.current.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) setNewUser({...newUser, image: e.target.result as string})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCuisineToggle = (cuisineId: string) => {
    setNewUser((prev) => {
      const updatedCuisines = prev.cuisines.includes(cuisineId)
        ? prev.cuisines.filter((id) => id !== cuisineId)
        : [...prev.cuisines, cuisineId]
      return {...prev, cuisines: updatedCuisines}
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSaving(true);

    const updateUserResponse = await fetch(`${BACKEND_ENDPOINT}/user/api/update_user`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken') || '',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({"username":newUser.username}),
      credentials: 'include',
    });


    const form_data = new FormData();
    if (newImage) {
      form_data.append('image', newImage);
    }

    form_data.append('cuisines', JSON.stringify(newUser.cuisines))

    const updateUserProfileResponse = await fetch(`${BACKEND_ENDPOINT}/user/api/update_profile`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      body: form_data,
      credentials: 'include',
    });

    const updateUserData = await updateUserResponse.json();
    const updateUserProfileData = await updateUserProfileResponse.json();

    if (updateUserResponse.ok && updateUserProfileResponse.ok) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      setIsEditing(false);
      setUser(newUser);
      setErrors({"username":""});
    } else {
      setErrors({...updateUserData, ...updateUserProfileData});
    }

    setIsSaving(false);
  }

  const handleEdit = () => {
    setNewUser(user);
    setIsEditing(!isEditing);
    setErrors({"username":""});
  }

  if (user.is_restaurant) {
    return (<LogoutButton/>)
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
                  onClick={handleEdit}
                  className={`edit-button ${isEditing ? "edit-cancel" : "edit-active"}`}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="profile-details">
                  <div className="image-section">
                    <div className={`image-wrapper ${isEditing ? "editable" : ""}`} onClick={handleImageClick}>
                      <Image src={newUser.image == "" ? default_image_url : newUser.image} alt="Profile" fill className="image" />
                      {isEditing && (
                        <div className="image-overlay">
                          <Camera className="overlay-icon" size={32} />
                        </div>
                      )}
                    </div>
                    <input
                      name="avatar"
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
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        value={newUser.username}
                        className={`username-input ${isEditing ? "editable-input" : "readonly-input"}`}
                        disabled={!isEditing}
                      />
                      {errors != null && errors["username"] && <p>{errors["username"]}</p>}
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
                          newUser.cuisines.includes(cuisine.id) ? "cuisine-selected" : "cuisine-unselected"
                        }`}
                        onClick={() => isEditing && handleCuisineToggle(cuisine.id)}
                      >
                        <div
                          className={`cuisine-check ${
                            newUser.cuisines.includes(cuisine.id)
                              ? "check-filled"
                              : "check-empty"
                          }`}
                        >
                          {newUser.cuisines.includes(cuisine.id) && <Check size={14} />}
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
              <LogoutButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
