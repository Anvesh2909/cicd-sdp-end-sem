import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EditProfile = () => {
    const API = import.meta.env.VITE_API_URL; // ← Use .env API
    const token = localStorage.getItem("token");

    const [author, setAuthor] = useState(null);
    const [profileFile, setProfileFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch author details
    useEffect(() => {
        const getAuthor = async () => {
            try {
                const res = await axios.get(`${API}/author/get`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAuthor(res.data);
            } catch (err) {
                console.error("Author fetch error:", err);
            }
        };

        getAuthor();
    }, [API, token]);

    // Upload profile pic
    const uploadProfilePic = async () => {
        if (!profileFile) {
            alert("Select a file first.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", profileFile);

            const res = await axios.post(
                `${API}/author/upload/profile-pic`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            // update the profile pic in UI
            setAuthor(prev => ({ ...prev, profilePic: res.data.fileName || res.data }));

            alert("Profile picture updated!");
        } catch (err) {
            console.error("Profile upload error:", err);
            alert("Failed to upload profile picture.");
        } finally {
            setLoading(false);
        }
    };

    if (!author) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="card" style={{ maxWidth: "500px", margin: "auto", marginTop: "20px" }}>
                <div className="card-body">

                    <h4 className="mb-4">Edit Profile</h4>

                    {/* Full Name */}
                    <div className="mb-3">
                        <label className="form-label">Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={author.fullName}
                            disabled
                        />
                    </div>

                    {/* Contact */}
                    <div className="mb-3">
                        <label className="form-label">Contact:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={author.contact}
                            disabled
                        />
                    </div>

                    {/* Profile Pic */}
                    <div className="mb-3">
                        <label className="form-label">Profile Picture:</label>
                        <br />

                        <div className="rounded m-2">
                            <img
                                src={author.profilePic ? `/images/${author.profilePic}` : "https://via.placeholder.com/120"}
                                height={120}
                                alt="Profile Pic"
                                style={{ borderRadius: "8px" }}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/120";
                                }}
                            />
                        </div>

                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setProfileFile(e.target.files[0])}
                        />
                    </div>

                    {/* Update btn */}
                    <button
                        className="btn btn-primary w-100"
                        onClick={uploadProfilePic}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Update Profile Picture"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EditProfile;
