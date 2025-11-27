import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CoursesLearner = () => {
    const API = import.meta.env.VITE_API_URL; // <-- from .env
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [enrollmentStatus, setEnrollmentStatus] = useState({});
    const [showEnrollConfirm, setShowEnrollConfirm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        // apply token globally to axios
        if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        else delete axios.defaults.headers.common["Authorization"];
    }, [token]);

    // load all + enrolled
    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                navigate('/');
                return;
            }

            setIsLoading(true);
            try {
                const allCoursesResp = await axios.get(`${API}/course/getAllCourses`);
                const enrolledResp = await axios.get(`${API}/learner/courses`);

                setAllCourses(allCoursesResp.data || []);
                setFilteredCourses(allCoursesResp.data || []);
                setEnrolledCourses(enrolledResp.data || []);

                // build enrolled mapping
                const map = {};
                (enrolledResp.data || []).forEach(c => map[c.id] = true);
                setEnrollmentStatus(map);

            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [API, navigate, token]);

    // FIXED — Extract learnerId properly
    const getLearnerId = () => {
        const stored = localStorage.getItem("learnerId");
        if (stored) return stored;

        // fallback: try to find from enrolledCourses
        if (enrolledCourses.length > 0 && enrolledCourses[0].learnerId) {
            const id = enrolledCourses[0].learnerId;
            localStorage.setItem("learnerId", id);
            return id;
        }

        return null;
    };

    const handleEnroll = async (courseId) => {
        const learnerId = getLearnerId();

        if (!learnerId) {
            setError("Unable to determine learner ID.");
            return;
        }

        try {
            await axios.post(
                `${API}/learner/enroll/course/${learnerId}/${courseId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // update UI fast
            setEnrollmentStatus(prev => ({ ...prev, [courseId]: true }));

            const course = allCourses.find(c => c.id === courseId);
            if (course) {
                setEnrolledCourses(prev => [...prev, { ...course, progress: 0 }]);
            }

            setShowEnrollConfirm(false);
            setSelectedCourse(null);

        } catch (error) {
            console.error("Error enrolling:", error);
            setError("Failed to enroll. Try again.");
        }
    };

    const confirmEnroll = (course) => {
        setSelectedCourse(course);
        setShowEnrollConfirm(true);
    };

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border"></div>
                <p className="mt-2">Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4">

            <div className="d-flex justify-content-between align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Explore Courses</h1>

                <div className="input-group w-25">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary">
                        <i className="bi bi-search"></i>
                    </button>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* COURSE GRID */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-search fs-1 text-muted"></i>
                    <h4 className="text-muted">No courses found</h4>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                    {filteredCourses.map(course => (
                        <div className="col" key={course.id}>
                            <div className="card h-100 shadow-sm">

                                <div className="position-relative">
                                    <img
                                        src={
                                            course.courseImage
                                                ? `../images/${course.courseImage}`
                                                : "https://via.placeholder.com/300x200?text=Course+Image"
                                        }
                                        alt={course.title}
                                        className="card-img-top"
                                        style={{ height: "180px", objectFit: "cover" }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300x200?text=Course+Image";
                                        }}
                                    />

                                    <div className="position-absolute top-0 end-0 m-2">
                                        <span className="badge bg-primary">{course.credits} Credits</span>
                                    </div>
                                </div>

                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="text-muted mb-1">{course.author?.name || "Unknown Author"}</p>
                                    <p className="small text-muted mb-3">
                                        {course.description?.length > 100
                                            ? `${course.description.slice(0, 100)}...`
                                            : course.description || "No description"}
                                    </p>

                                    <div className="mt-auto">
                                        {enrollmentStatus[course.id] ? (
                                            <button
                                                className="btn btn-success w-100"
                                                onClick={() => navigate(`/learner/course/${course.id}`)}
                                            >
                                                <i className="bi bi-journal-bookmark me-1"></i>
                                                Continue Learning
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-outline-primary w-100"
                                                onClick={() => confirmEnroll(course)}
                                            >
                                                <i className="bi bi-plus-circle me-1"></i>
                                                Enroll Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CONFIRM ENROLL MODAL */}
            {showEnrollConfirm && selectedCourse && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Enrollment</h5>
                                <button className="btn-close" onClick={() => setShowEnrollConfirm(false)}></button>
                            </div>

                            <div className="modal-body">
                                <p>Enroll in <strong>{selectedCourse.title}</strong>?</p>
                                {selectedCourse.credits > 0 &&
                                    <p className="text-muted">
                                        Requires {selectedCourse.credits} credits.
                                    </p>
                                }
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEnrollConfirm(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={() => handleEnroll(selectedCourse.id)}>
                                    Confirm
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CoursesLearner;
