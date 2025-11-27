import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../store/actions/CourseAction';
import { Chart } from 'primereact/chart';
import axios from 'axios';

const Stats = () => {
    const API = import.meta.env.VITE_API_URL; // <-- use .env
    const token = localStorage.getItem("token");

    const dispatch = useDispatch();
    const courses = useSelector(state => state.courses.courses);

    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        if (!token) return;

        // fetch all courses for author (redux)
        getAllCourses(dispatch);

        const getStats = async () => {
            try {
                const res = await axios.get(`${API}/learner/course/getEnrollments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const titles = res.data.courseTitles || [];
                const enrollments = res.data.enrollments || [];

                const data = {
                    labels: titles,
                    datasets: [
                        {
                            label: "Enrollments",
                            data: enrollments,
                            backgroundColor: [
                                "rgba(255, 159, 64, 0.2)",
                                "rgba(75, 192, 192, 0.2)",
                                "rgba(54, 162, 235, 0.2)",
                                "rgba(153, 102, 255, 0.2)"
                            ],
                            borderColor: [
                                "rgb(255, 159, 64)",
                                "rgb(75, 192, 192)",
                                "rgb(54, 162, 235)",
                                "rgb(153, 102, 255)"
                            ],
                            borderWidth: 1
                        }
                    ]
                };

                const options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                };

                setChartData(data);
                setChartOptions(options);

            } catch (err) {
                console.error("Stats fetch error:", err);

                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                }
            }
        };

        getStats();

    }, [API, dispatch, token]);

    return (
        <div className="p-4">
            <h2 className="text-center mb-4">Enrollment Stats</h2>

            <div style={{ width: "100%", maxWidth: "800px", height: "400px", margin: "0 auto" }}>
                <div className="card p-3" style={{ height: "100%" }}>

                    {chartData ? (
                        <Chart
                            type="bar"
                            data={chartData}
                            options={chartOptions}
                            style={{ height: "100%" }}
                        />
                    ) : (
                        <div className="text-center mt-4">
                            <div className="spinner-border"></div>
                            <p className="mt-2">Loading chart...</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Stats;
