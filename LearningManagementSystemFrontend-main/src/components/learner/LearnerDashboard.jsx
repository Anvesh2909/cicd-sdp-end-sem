import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const LearnerDashboard = () => {
    const API = import.meta.env.VITE_API_URL; // <-- from .env
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [error, setError] = useState('');
    const [enrollmentLoading, setEnrollmentLoading] = useState({});
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        // If token exists, set default Authorization header for axios
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                if (!token) {
                    navigate('/');
                    return;
                }

                setIsLoading(true);
                const response = await axios.get(`${API}/learner/courses`);
                setEnrolledCourses(response.data || []);
                setError('');
            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
                setError("Failed to load enrolled courses");
                // If 401/403, redirect to login
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [navigate, token, API]);

    const fetchAllCourses = async () => {
        if (allCourses.length > 0) return; // Don't fetch again if already loaded

        setCoursesLoading(true);
        try {
            const response = await axios.get(`${API}/course/getAll`);
            setAllCourses(response.data || []);
            setError('');
        } catch (error) {
            console.error("Error fetching all courses:", error);
            setError("Failed to load courses");
        } finally {
            setCoursesLoading(false);
        }
    };

    const handleEnrollment = async (courseId) => {
        setEnrollmentLoading(prev => ({ ...prev, [courseId]: true }));

        try {
            const response = await axios.post(`${API}/learner/enroll/${courseId}`, {});
            if (response.status === 200 || response.status === 201) {
                // Refresh enrolled courses
                const enrolledResponse = await axios.get(`${API}/learner/courses`);
                setEnrolledCourses(enrolledResponse.data || []);

                setError('');
                alert('Successfully enrolled in course!');
            } else {
                // handle unexpected statuses
                alert('Enrollment returned unexpected status: ' + response.status);
            }
        } catch (error) {
            console.error("Error enrolling in course:", error);
            if (error.response?.status === 400) {
                alert('You are already enrolled in this course');
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                alert('Authentication error. Please log in again.');
                localStorage.removeItem('token');
                navigate('/');
            } else {
                alert('Failed to enroll in course. Please try again.');
            }
        } finally {
            setEnrollmentLoading(prev => ({ ...prev, [courseId]: false }));
        }
    };

    const isEnrolled = (courseId) => {
        return enrolledCourses.some(course => course.id === courseId);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'explore') {
            fetchAllCourses();
        }
    };

    const renderDashboard = () => (
        <div className="row">
            {/* Welcome Card */}
            <div className="col-md-12 mb-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Welcome, {user?.username || 'Learner'}!</h5>
                        <p className="card-text">Continue your learning journey today.</p>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses */}
            <div className="col-md-8 mb-4">
                <div className="card">
                    <div className="card-header">
                        My Enrolled Courses
                    </div>
                    <div className="card-body">
                        {isLoading ? (
                            <p>Loading courses...</p>
                        ) : enrolledCourses.length > 0 ? (
                            <div className="row">
                                {enrolledCourses.map(course => (
                                    <div className="col-md-6 mb-3" key={course.id}>
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title">{course.title}</h5>
                                                <p className="card-text">{course.description?.substring(0, 100)}...</p>
                                                <div className="progress mb-3">
                                                    <div className="progress-bar" role="progressbar"
                                                         style={{ width: `${course.progress || 0}%` }}
                                                         aria-valuenow={course.progress || 0} aria-valuemin="0" aria-valuemax="100">
                                                        {course.progress || 0}%
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary btn-sm">Continue Learning</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-3">
                                <p className="mb-3">You haven't enrolled in any courses yet.</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleTabChange('explore')}
                                >
                                    Explore Courses
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress & Stats */}
            <div className="col-md-4 mb-4">
                <div className="card">
                    <div className="card-header">
                        My Learning Stats
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <h6>Courses Enrolled</h6>
                            <h3>{enrolledCourses.length}</h3>
                        </div>
                        <div className="mb-3">
                            <h6>Completed Courses</h6>
                            <h3>{enrolledCourses.filter(c => (c.progress || 0) === 100).length}</h3>
                        </div>
                        <div>
                            <h6>Overall Progress</h6>
                            <div className="progress">
                                <div className="progress-bar bg-success" role="progressbar"
                                     style={{
                                         width: `${enrolledCourses.length ?
                                             enrolledCourses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrolledCourses.length : 0}%`
                                     }}
                                     aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMyCourses = () => (
        <div>
            <h3 className="mb-4">My Enrolled Courses</h3>
            {isLoading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : enrolledCourses.length > 0 ? (
                <div className="row">
                    {enrolledCourses.map(course => (
                        <div className="col-md-4 col-lg-3 mb-4" key={course.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="position-relative">
                                    <img
                                        src={course.courseImage ? `../images/${course.courseImage}` : 'https://via.placeholder.com/300x200?text=Course+Image'}
                                        className="card-img-top"
                                        alt={course.title}
                                        style={{height: '200px', objectFit: 'cover'}}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Course+Image';
                                        }}
                                    />
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <span className="badge bg-primary">{course.credits} Credits</span>
                                    </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text text-muted">
                                        {course.author?.fullName ? `By ${course.author.fullName}` : 'Course Author'}
                                    </p>
                                    <div className="progress mb-3">
                                        <div className="progress-bar" role="progressbar"
                                             style={{ width: `${course.progress || 0}%` }}
                                             aria-valuenow={course.progress || 0} aria-valuemin="0" aria-valuemax="100">
                                            {course.progress || 0}%
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <button className="btn btn-primary w-100">
                                            Continue Learning
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <div className="mb-3">
                        <i className="bi bi-book fa-3x text-muted"></i>
                    </div>
                    <h4 className="text-muted">No courses enrolled</h4>
                    <p className="text-muted">You haven't enrolled in any courses yet.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleTabChange('explore')}
                    >
                        Explore Courses
                    </button>
                </div>
            )}
        </div>
    );

    const renderExploreCourses = () => (
        <div>
            <h3 className="mb-4">Explore Courses</h3>
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            {coursesLoading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2">Loading available courses...</p>
                </div>
            ) : allCourses.length > 0 ? (
                <div className="row">
                    {allCourses.map((course) => (
                        <div className="col-md-4 col-lg-3 mb-4" key={course.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="position-relative">
                                    <img
                                        src={course.courseImage ? `../images/${course.courseImage}` : 'https://via.placeholder.com/300x200?text=Course+Image'}
                                        className="card-img-top"
                                        alt={course.title}
                                        style={{height: '200px', objectFit: 'cover'}}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Course+Image';
                                        }}
                                    />
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <span className="badge bg-primary">{course.credits} Credits</span>
                                    </div>
                                    {isEnrolled(course.id) && (
                                        <div className="position-absolute top-0 start-0 m-2">
                                            <span className="badge bg-success">Enrolled</span>
                                        </div>
                                    )}
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text text-muted flex-grow-1">
                                        {course.author?.fullName ? `By ${course.author.fullName}` : 'Course Author'}
                                    </p>
                                    <div className="mt-auto">
                                        {isEnrolled(course.id) ? (
                                            <button className="btn btn-success w-100" disabled>
                                                Already Enrolled
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() => handleEnrollment(course.id)}
                                                disabled={enrollmentLoading[course.id]}
                                            >
                                                {enrollmentLoading[course.id] ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                        Enrolling...
                                                    </>
                                                ) : (
                                                    'Enroll Now'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <div className="mb-3">
                        <i className="bi bi-search fa-3x text-muted"></i>
                    </div>
                    <h4 className="text-muted">No courses available</h4>
                    <p className="text-muted">There are currently no courses available for enrollment.</p>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'my-courses':
                return renderMyCourses();
            case 'explore':
                return renderExploreCourses();
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar Navigation */}
                <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                    <div className="position-sticky pt-3">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <button
                                    className={`nav-link w-100 text-start border-0 bg-transparent ${activeTab === 'dashboard' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('dashboard')}
                                >
                                    <i className="bi bi-house-door me-2"></i>
                                    Dashboard
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link w-100 text-start border-0 bg-transparent ${activeTab === 'my-courses' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('my-courses')}
                                >
                                    <i className="bi bi-book me-2"></i>
                                    My Courses
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link w-100 text-start border-0 bg-transparent ${activeTab === 'explore' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('explore')}
                                >
                                    <i className="bi bi-search me-2"></i>
                                    Explore Courses
                                </button>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/learner/profile">
                                    <i className="bi bi-person me-2"></i>
                                    Profile
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">Learner Dashboard</h1>
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <div className="btn-group me-2">
                                <button type="button" className="btn btn-sm btn-outline-secondary">
                                    Settings
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            delete axios.defaults.headers.common['Authorization'];
                                            navigate('/');
                                        }}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic content section */}
                    <div className="dashboard-content">
                        <Outlet />
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LearnerDashboard;
