import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
    const API = import.meta.env.VITE_API_URL; // <-- from .env
    const params = useParams();

    const [videos, setVideos] = useState([]);
    const [modules, setModules] = useState([]);
    const [course, setCourse] = useState([]);

    const [showModules, setShowModules] = useState(false);
    const [showVideos, setShowVideos] = useState(false);
    const [showAuthor, setShowAuthor] = useState(false);
    const [showReviews, setShowReviews] = useState(false);

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchVideosAndModules = async () => {
            try {
                const res = await axios.get(
                    `${API}/video/getAllVideos/${params.cid}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const data = res.data;
                setVideos(data);

                // Extract modules
                let extractedModules = [];
                data.forEach(v => {
                    if (!extractedModules.find(m => m.id === v.module.id)) {
                        extractedModules.push(v.module);
                    }
                });
                setModules(extractedModules);

                // Extract course details
                const courseList = extractedModules.map(m => m.course);
                setCourse(courseList);

            } catch (err) {
                console.error("Video/module fetch error:", err);
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await axios.get(
                    `${API}/review/getReviewsByCourse/${params.cid}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setReviews(res.data);
            } catch (err) {
                console.error("Reviews fetch error:", err);
            }
        };

        fetchVideosAndModules();
        fetchReviews();
    }, [API, params.cid]);

    return (
        <div className="container-fluid">

            <div className="row">
                <div className="col-lg-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Author Dashboard</a></li>
                            <li className="breadcrumb-item"><a href="#">Courses</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Course Details</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Course Info */}
            <div className="col-lg-12">
                {course.map((c, idx) => (
                    <div key={idx} className="card mt-2">
                        <h3>{c.title} (ID: {params.cid})</h3>
                        <div className="card-body">{c.credits} Credits</div>
                    </div>
                ))}
            </div>

            {/* Toggle Buttons */}
            <div className="col-lg-12 mt-4">
                <div>
                    <button className="btn btn-primary m-2" onClick={() => setShowModules(!showModules)}>
                        Modules
                    </button>

                    <button className="btn btn-info m-2" onClick={() => setShowVideos(!showVideos)}>
                        Videos
                    </button>

                    <button className="btn btn-secondary m-2" onClick={() => {
                        setShowAuthor(!showAuthor);
                        setShowReviews(false);
                    }}>
                        Author Profile
                    </button>

                    <button className="btn btn-warning m-2" onClick={() => {
                        setShowReviews(!showReviews);
                        setShowAuthor(false);
                    }}>
                        Reviews
                    </button>
                </div>

                {/* Modules */}
                {showModules && (
                    <div className="card card-body mt-3">
                        <h4>Modules</h4>
                        {modules.map((m, idx) => (
                            <div key={idx}><li>{m.moduleTitle}</li></div>
                        ))}
                    </div>
                )}

                {/* Videos */}
                {showVideos && (
                    <div className="card card-body mt-3">
                        <h4>Videos</h4>

                        {modules.map((m, idx) => (
                            <div key={idx}>
                                <h6>{m.moduleTitle}</h6>
                                {videos
                                    .filter(v => v.module.id === m.id)
                                    .map((v, vIdx) => (
                                        <li key={vIdx}>{v.videoTitle} — {v.playTime} mins</li>
                                    ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* Author Profile */}
                {showAuthor && (
                    <div className="card card-body mt-3">
                        {course.map((c, idx) => (
                            <div key={idx}>
                                <h4>{c.author.fullName}</h4>
                                <p>Contact: {c.author.contact}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Reviews */}
                {showReviews && (
                    <div className="mt-3">
                        {reviews.map((r) => (
                            <div className="card card-body mb-2" key={r.id}>
                                <div className="card-header">
                                    <strong>Review {r.id}</strong><br />
                                    Comment: {r.comments} <br />
                                    Rating: {r.rating}
                                </div>
                                <div className="card-text">
                                    By: {r.learnerCourse.learner.name}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default CourseDetails;
