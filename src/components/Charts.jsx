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
} from "recharts";

const Charts = () => {
    const theme = {
        background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
        card: "bg-[#1e293b]/70 text-white border border-white/10 backdrop-blur-xl shadow-2xl rounded-xl",
        text: "text-white",
        subtext: "text-gray-300",
        stroke: "#e5e7eb",
        chartLine: "#38bdf8",
    };

    const [userStats, setUserStats] = useState(null);
    const [meetingStats, setMeetingStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const getTrendClass = (value) => {
        if (value.startsWith("+")) return "text-green-400";
        if (value.startsWith("-")) return "text-red-400";
        return theme.subtext;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userResponse, meetingResponse] = await Promise.all([
                    fetch("/api/user/stats"),
                    fetch("/api/Meeting/stats"),
                ]);
                const userData = await userResponse.json();
                const meetingData = await meetingResponse.json();

                setUserStats(userData);
                setMeetingStats(meetingData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    const totalMeetings =
        (meetingStats?.totalMeetingsInXLSX || 0) + (meetingStats?.totalMeetingsInDB || 0);
    const pendingMeetings = meetingStats?.totalMeetingsInDB || 0;

    const barData = [
        { name: "Jan", users: userStats?.usersByMonth?.["1"] || 0 },
        { name: "Feb", users: userStats?.usersByMonth?.["2"] || 0 },
        { name: "Mar", users: userStats?.usersByMonth?.["3"] || 0 },
        { name: "Apr", users: userStats?.usersByMonth?.["4"] || 0 },
        { name: "May", users: userStats?.usersByMonth?.["5"] || 0 },
        { name: "Jun", users: userStats?.usersByMonth?.["6"] || 0 },
        { name: "Jul", users: userStats?.usersByMonth?.["7"] || 0 },
        { name: "Aug", users: userStats?.usersByMonth?.["8"] || 0 },
        { name: "Sep", users: userStats?.usersByMonth?.["9"] || 0 },
        { name: "Oct", users: userStats?.usersByMonth?.["10"] || 0 },
        { name: "Nov", users: userStats?.usersByMonth?.["11"] || 0 },
        { name: "Dec", users: userStats?.usersByMonth?.["12"] || 0 },
    ];

    const pieData = [
        { name: "Desktop", value: meetingStats?.desktopUsersCount || 0 },
        { name: "Mobile", value: meetingStats?.mobileUsersCount || 0 },
    ];

    const pieColors = ["#38bdf8", "#0ea5e9"];

    return (
        <div className={`min-h-screen p-8 ${theme.background}`}>
            {/* Cards container with slightly larger gap */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-8 rounded-xl shadow-2xl text-white">
                    <h2 className="text-lg font-semibold">Total Users</h2>
                    <p className="text-3xl font-bold mt-2">{userStats?.totalUsers || 0}</p>
                </div>
                <div className={`${theme.card} p-8`}>
                    <h2 className="text-lg font-semibold">Pending Meetings</h2>
                    <p className="text-3xl font-bold mt-2">{pendingMeetings}</p>
                </div>
                <div className={`${theme.card} p-8 bg-gradient-to-br `}>
                    <h2 className="text-lg font-semibold">Total Meetings</h2>
                    <p className="text-3xl font-bold mt-2">{totalMeetings}</p>
                    <p className={`text-sm mt-1 ${getTrendClass(`+${pendingMeetings} today`)}`}>
                        +{pendingMeetings} today
                    </p>
                </div>
            </div>

            {/* Charts container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`${theme.card} p-8`}>
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

                <div className={`${theme.card} p-8`}>
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
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={pieColors[index % pieColors.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <p className={`text-sm text-center mt-2 ${theme.subtext}`}>
                        Desktop vs Mobile
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Charts;
