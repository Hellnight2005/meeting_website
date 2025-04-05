import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Radar,
    RadarChart,
    PolarRadiusAxis,
    PolarGrid,
    PolarAngleAxis,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
} from "recharts";

const Charts = () => {
    const theme = {
        background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
        card: "bg-[#1e293b]/70 text-white border border-white/10 backdrop-blur-xl shadow-2xl",
        text: "text-white",
        subtext: "text-gray-300",
        stroke: "#e5e7eb",
        chartLine: "#38bdf8",
        radarStroke: "#0ea5e9",
        radarFill: "#0ea5e9",
    };

    // 👇 Function to dynamically apply green/red class based on sign
    const getTrendClass = (value) => {
        if (value.startsWith("+")) return "text-green-400";
        if (value.startsWith("-")) return "text-red-400";
        return theme.subtext;
    };

    // 🔽 Optionally, fetch dynamic chart data from backend
    /*
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch("/api/dashboard-data");
                const data = await response.json();
                // Update your state here (e.g., setBarData(data.barData), etc.)
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);
    */

    const barData = [
        { name: "Jan", users: 400 },
        { name: "Feb", users: 800 },
        { name: "Mar", users: 600 },
        { name: "Apr", users: 1000 },
        { name: "May", users: 1200 },
        { name: "Jun", users: 1400 },
    ];

    const pieData = [
        { name: "Desktop", value: 60 },
        { name: "Mobile", value: 40 },
    ];

    const userTimeData = [
        { component: "Hero Section", time: 25 },
        { component: "Service", time: 40 },
        { component: "Sample Project", time: 15 },
        { component: "Footer", time: 5 },
    ];

    const lineData = [
        { name: "Mon", users: 400 },
        { name: "Tue", users: 300 },
        { name: "Wed", users: 500 },
        { name: "Thu", users: 200 },
        { name: "Fri", users: 278 },
        { name: "Sat", users: 189 },
        { name: "Sun", users: 239 },
    ];

    const pieColors = ["#38bdf8", "#0ea5e9"];

    return (
        <div className={`min-h-screen p-8 ${theme.background}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-xl shadow-2xl text-white">
                    <h2 className="text-lg font-semibold">Total Users</h2>
                    <p className="text-3xl font-bold mt-2">3,200</p>
                    <p className={`text-sm mt-1 ${getTrendClass("+5%")}`}>+5% from last week</p>
                </div>
                <div className={`${theme.card} p-6 rounded-xl`}>
                    <h2 className="text-lg font-semibold">Meetings</h2>
                    <p className="text-3xl font-bold mt-2">1,200</p>
                    <p className={`text-sm mt-1 ${getTrendClass("+8%")}`}>+8 today</p>
                </div>
                <div className={`${theme.card} p-6 rounded-xl`}>
                    <h2 className="text-lg font-semibold">Project</h2>
                    <p className="text-3xl font-bold mt-2">65%</p>
                    <p className={`text-sm mt-1 ${getTrendClass("Stable")}`}>Stable</p>
                </div>
                <div className={`${theme.card} p-6 rounded-xl`}>
                    <h2 className="text-lg font-semibold">Total Meetings</h2>
                    <p className="text-3xl font-bold mt-2">4,000</p>
                    <p className={`text-sm mt-1 ${getTrendClass("+12")}`}>+12 this month</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className={`${theme.card} p-6 rounded-xl`}>
                    <h3 className="text-md font-semibold text-center mb-4">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" stroke={theme.stroke} />
                            <YAxis stroke={theme.stroke} />
                            <Tooltip />
                            <Bar dataKey="users" fill={theme.chartLine} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={`${theme.card} p-6 rounded-xl`}>
                    <h3 className="text-md font-semibold text-center mb-4">Device Usage</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <p className={`text-sm text-center mt-2 ${theme.subtext}`}>Desktop vs Mobile</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${theme.card} p-6 rounded-xl`}>
                    <h3 className="text-md font-semibold text-center mb-4">User Time on Components</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={userTimeData}>
                            <PolarGrid stroke={theme.stroke} />
                            <PolarAngleAxis dataKey="component" stroke={theme.stroke} />
                            <PolarRadiusAxis angle={30} domain={[0, 50]} stroke={theme.stroke} tick={false} />
                            <Radar
                                name="Time Spent"
                                dataKey="time"
                                stroke={theme.radarStroke}
                                fill={theme.radarFill}
                                fillOpacity={0.5}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className={`${theme.card} p-6 rounded-xl`}>
                    <h3 className="text-md font-semibold text-center mb-4">Weekly Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.stroke} />
                            <XAxis dataKey="name" stroke={theme.stroke} />
                            <YAxis stroke={theme.stroke} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke={theme.chartLine} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Charts;
