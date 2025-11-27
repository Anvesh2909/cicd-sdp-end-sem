import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL; // <- from .env

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        username: "",
        password: "",
        role: "LEARNER"
    });

    // Author-specific details
    const [authorData, setAuthorData] = useState({
        fullName: "",
        contact: "",
        website: "",
        profilePic: ""
    });

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleAuthorChange = (e) => {
        const { name, value } = e.target;
        setAuthorData(prev => ({ ...prev, [name]: value }));
    };

    const signup = async (e) => {
        // if called from button onClick without event, guard
        if (e && e.preventDefault) e.preventDefault();

        // Basic validation
        if (!user.username || !user.password) {
            setMsg("Username and password are required");
            return;
        }
        if (user.role === "AUTHOR" && !authorData.fullName) {
            setMsg("Full name is required for authors");
            return;
        }

        setLoading(true);
        setMsg("");

        try {
            console.log("Creating user with data:", user);

            // create user account
            const userResponse = await axios.post(`${API}/user/signup`, user);
            console.log("User response:", userResponse.data);

            // if AUTHOR, create author profile
            if (user.role === "AUTHOR") {
                // Defensive extraction of userId from response
                const possibleId = userResponse?.data?.id ?? userResponse?.data?.userId ?? userResponse?.data;
                const authorPayload = {
                    fullName: authorData.fullName,
                    contact: authorData.contact || null,
                    website: authorData.website || null,
                    profilePic: authorData.profilePic || null,
                    userId: possibleId
                };

                console.log("Creating author with payload:", authorPayload);

                try {
                    const authorResponse = await axios.post(`${API}/author/register`, authorPayload);
                    console.log("Author created successfully:", authorResponse.data);
                } catch (authorError) {
                    console.error("Author creation error:", authorError);
                    console.error("Author error response:", authorError?.response);
                    setMsg(
                        "User created but author profile couldn't be created: " +
                        (authorError?.response?.data || authorError?.message || "Unknown error")
                    );
                    setLoading(false);
                    return; // stop here — user exists but author failed
                }
            }

            // success
            setMsg("Registration successful! Redirecting to login...");
            // small delay so user sees message
            setTimeout(() => navigate('/'), 1500);

        } catch (error) {
            console.error("Signup error:", error);
            console.error("Error response:", error?.response);
            // Prefer descriptive server message if available
            const serverMsg =
                error?.response?.data?.message ||
                (typeof error?.response?.data === "string" ? error.response.data : null);

            setMsg(serverMsg || error?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-12'>
                    <br /><br /><br /><br />
                </div>
            </div>

            <div className='row'>
                <div className='col-md-3'></div>
                <div className='col-md-6'>
                    <div className='card'>
                        <div className='card-header'>
                            <h4 className="mb-0">Sign Up</h4>
                        </div>
                        <form onSubmit={signup}>
                            <div className='card-body'>
                                {msg && (
                                    <div className={`alert ${msg.toLowerCase().includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                                        {msg}
                                    </div>
                                )}

                                <div className='mb-3'>
                                    <label className="form-label">Username *</label>
                                    <input
                                        className='form-control'
                                        type="text"
                                        name="username"
                                        value={user.username}
                                        onChange={handleUserChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label className="form-label">Password *</label>
                                    <input
                                        className='form-control'
                                        type="password"
                                        name="password"
                                        value={user.password}
                                        onChange={handleUserChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label className="form-label">Role *</label>
                                    <select
                                        className='form-control'
                                        name="role"
                                        value={user.role}
                                        onChange={handleUserChange}
                                        disabled={loading}
                                    >
                                        <option value="LEARNER">Learner</option>
                                        <option value="AUTHOR">Author</option>
                                    </select>
                                </div>

                                {/* Author specific fields */}
                                {user.role === "AUTHOR" && (
                                    <>
                                        <hr />
                                        <h6 className="text-muted mb-3">Author Profile Information</h6>

                                        <div className='mb-3'>
                                            <label className="form-label">Full Name *</label>
                                            <input
                                                className='form-control'
                                                type="text"
                                                name="fullName"
                                                value={authorData.fullName}
                                                onChange={handleAuthorChange}
                                                required={user.role === "AUTHOR"}
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <label className="form-label">Contact</label>
                                            <input
                                                className='form-control'
                                                type="text"
                                                name="contact"
                                                value={authorData.contact}
                                                onChange={handleAuthorChange}
                                                disabled={loading}
                                                placeholder="Phone number or email"
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <label className="form-label">Website</label>
                                            <input
                                                className='form-control'
                                                type="url"
                                                name="website"
                                                value={authorData.website}
                                                onChange={handleAuthorChange}
                                                disabled={loading}
                                                placeholder="https://example.com"
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <label className="form-label">Profile Picture</label>
                                            <input
                                                className='form-control'
                                                type="text"
                                                name="profilePic"
                                                value={authorData.profilePic}
                                                onChange={handleAuthorChange}
                                                disabled={loading}
                                                placeholder="Profile picture filename"
                                            />
                                            <small className="text-muted">Enter filename of image in your images folder</small>
                                        </div>
                                    </>
                                )}

                                <div className='mb-3'>
                                    <button
                                        type="submit"
                                        className='btn btn-primary w-100'
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Sign Up'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="card-footer text-center">
                            Already have an account?
                            <span
                                className="text-primary ms-1"
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => navigate('/')}
                            >
                Login here
              </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </div>
    );
};

export default Signup;
