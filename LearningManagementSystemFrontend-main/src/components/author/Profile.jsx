import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const API = import.meta.env.VITE_API_URL;   // <-- use .env
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [author, setAuthor] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const getAuthor = async () => {
            try {
                const res = await axios.get(`${API}/author/get`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAuthor(res.data);

            } catch (err) {
                console.error("Error fetching author:", err);

                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate('/');
                }
            }
        };

        getAuthor();
    }, [API, token, navigate]);

    if (!author) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className='container-fluid'>
            <div className='card' style={{ maxWidth: "500px", marginTop: "20px" }}>
                <div className='card-body'>

                    <div className="mb-3">
                        <label className="form-label">Name:</label>
                        <input type="text" className='form-control' value={author.fullName} disabled />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contact:</label>
                        <input type="text" className='form-control' value={author.contact} disabled />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Profile Picture</label><br />
                        <div className='rounded m-2'>
                            <img
                                src={author.profilePic ? `/images/${author.profilePic}` : "https://via.placeholder.com/120"}
                                alt="Profile"
                                height={120}
                                style={{ borderRadius: "8px" }}
                                onError={(e) => { e.target.src = "https://via.placeholder.com/120"; }}
                            />
                        </div>
                    </div>

                    <Link to="/author/edit-profile" className="btn btn-primary w-100">
                        Edit Profile
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Profile;
