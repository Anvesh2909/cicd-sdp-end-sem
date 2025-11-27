import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Courses = () => {
    const API = import.meta.env.VITE_API_URL; // <-- from .env
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [debugInfo, setDebugInfo] = useState('');
    const [newCourse, setNewCourse] = useState({
        title: '',
        credits: '',
        courseImage: ''
    });

    // Redirect if not authenticated
    if (!token) navigate('/');

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        setLoading(true);
        setDebugInfo('Fetching courses...');

        try {
            const response = await fetch(`${API}/course/getCoursesByAuthor`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const text = await response.text();
                setDebugInfo(text);
                throw new Error(text || "Failed to fetch courses");
            }

            const data = await response.json();
            setCourses(data);
            setError('');
            setDebugInfo(`Loaded ${data.length} courses`);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Failed to load courses.");
            setDebugInfo(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API}/course/add`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: newCourse.title,
                    credits: parseFloat(newCourse.credits),
                    courseImage: newCourse.courseImage
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to add course");
            }

            setSuccess("Course added successfully!");
            setShowAddCourse(false);
            setNewCourse({ title: '', credits: '', courseImage: '' });
            getCourses();
        } catch (err) {
            console.error("Add course error:", err);
            setError("Failed to add course.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setShowAddCourse(false);
        setNewCourse({ title: '', credits: '', courseImage: '' });
        setError('');
        setSuccess('');
    };

    // LOADING SCREEN
    if (loading && courses.length === 0) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border"></div>
                    <p className="mt-2">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            {/* Debug */}
            {debugInfo && (
                <div className="alert alert-info alert-dismissible fade show">
                    <strong>Debug:</strong> {debugInfo}
                    <button className="btn-close" onClick={() => setDebugInfo('')}></button>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2">My Courses</h1>
                <button
                    className="btn btn-success"
                    onClick={() => setShowAddCourse(true)}
                    disabled={loading}
                >
                    <i className="fas fa-plus me-2"></i> Add New Course
                </button>
            </div>

            {/* Messages */}
            {success && (
                <div className="alert alert-success alert-dismissible fade show">
                    {success}
                    <button className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            {/* Add Course Modal */}
            {showAddCourse && (
                <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Add New Course</h5>
                                <button className="btn-close" onClick={handleCancel}></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Course Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newCourse.title}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Credits *</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            name="credits"
                                            value={newCourse.credits}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Course Image (filename)</label>
                                        <input
                                            type="text"
                                            name="courseImage"
                                            value={newCourse.courseImage}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="e.g., course1.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? "Adding..." : "Add Course"}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

            {/* Course Cards */}
            {courses.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-book-open fa-3x text-muted"></i>
                    <h4 className="text-muted">No courses found</h4>
                    <p className="text-muted">Add your first course.</p>
                </div>
            ) : (
                <div className="row">
                    {courses.map((course) => (
                        <div className="col-md-4 col-lg-3 mb-4" key={course.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="position-relative">
                                    <img
                                        src={course.courseImage ? `../images/${course.courseImage}` : 'https://via.placeholder.com/300x200?text=Course+Image'}
                                        className="card-img-top"
                                        alt={course.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Course+Image';
                                        }}
                                    />
                                    <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                                        {course.credits} Credits
                                    </span>
                                </div>

                                <div className="card-body d-flex flex-column">
                                    <h5>{course.title}</h5>
                                    <p className="text-muted flex-grow-1">
                                        {course.author?.name || "By You"}
                                    </p>

                                    <Link
                                        className="btn btn-primary w-100 mt-auto"
                                        to={`/author/course-details/${course.id}`}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Courses;
