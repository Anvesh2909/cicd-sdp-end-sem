import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserDetails } from '../store/actions/UserAction';
import { useDispatch } from 'react-redux';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const API = import.meta.env.VITE_API_URL; // <-- from .env

    const [msg, setMsg] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!username || !password) {
            setMsg("Username and password required");
            return;
        }

        setLoading(true);
        setMsg("");

        try {
            const encodedString = window.btoa(`${username}:${password}`);

            // Request token using Basic auth
            const tokenResp = await axios.get(`${API}/user/token`, {
                headers: {
                    Authorization: `Basic ${encodedString}`,
                },
            });

            const token = tokenResp?.data?.token;
            if (!token) {
                setMsg("Login failed: token not returned");
                setLoading(false);
                return;
            }

            // persist token
            localStorage.setItem('token', token);

            // set default Authorization header for future requests (optional)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // fetch user details
            const detailsResp = await axios.get(`${API}/user/details`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // defensive checks and role extraction
            const detailsData = detailsResp?.data;
            if (!detailsData) {
                setMsg("Login failed: invalid user details response");
                setLoading(false);
                return;
            }

            let role;
            // support multiple possible shapes
            if (detailsData.user && detailsData.user.role) {
                role = detailsData.user.role;
            } else if (detailsData.role) {
                role = detailsData.role;
            } else {
                console.error("Unexpected user details shape:", detailsData);
                setMsg("Login failed: role information missing");
                setLoading(false);
                return;
            }

            const userObj = { username, role };
            // dispatch using your existing helper
            setUserDetails(dispatch)(userObj);

            // navigate based on role
            switch (role) {
                case "LEARNER":
                    navigate("/learner");
                    break;
                case "AUTHOR":
                    navigate("/author");
                    break;
                case "EXECUTIVE":
                    navigate("/executive");
                    break;
                default:
                    setMsg("Login failed: unknown role " + role);
                    setLoading(false);
                    return;
            }

            setMsg("Login Successful");
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                // server error with payload
                const serverMsg =
                    error.response.data?.message ||
                    (typeof error.response.data === "string" ? error.response.data : null);
                setMsg("Login failed: " + (serverMsg || `status ${error.response.status}`));
            } else if (error.request) {
                setMsg("Network error: Check your connection or backend");
            } else {
                setMsg("Login failed: " + (error.message || "Unknown error"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <br /><br /><br /><br />
                </div>
            </div>

            <div className="row">
                <div className="col-md-3" />
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body">
                            {msg ? (
                                <div className={`alert ${msg.toLowerCase().includes("successful") ? "alert-success" : "alert-info"}`}>
                                    {msg}
                                </div>
                            ) : null}

                            <div className="mb-2">
                                <label>Enter Username:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-2">
                                <label>Enter Password:</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <div className="mb-3">
                                <button
                                    onClick={login}
                                    className="btn btn-primary"
                                    disabled={!username || !password || loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" /> Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="card-footer">
                            Don't have an Account?{" "}
                            <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate('/signup')}>
                Sign Up here
              </span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3" />
            </div>
        </div>
    );
};

export default Login;
