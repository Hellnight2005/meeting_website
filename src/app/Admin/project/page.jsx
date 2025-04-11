"use client";
import React, { useEffect, useState } from "react";
import CreateProjectForm from "../../../components/CreateProjectForm";
import fakeProjects from "../../../constants/fakeProjects"; // adjust path based on your project structure

const ProjectAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const fetchProjects = async () => {
        // Simulate an API call
        setProjects(fakeProjects);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">All Projects</h2>
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
                {showForm ? "Close Form" : "Create Project"}
            </button>

            {showForm && <CreateProjectForm onProjectCreated={fetchProjects} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                    <div key={proj._id} className="p-4 border rounded shadow">
                        <h3 className="font-semibold text-lg">{proj.title}</h3>
                        <p>{proj.description}</p>
                        <p className="text-sm text-gray-500">
                            Featured: {proj.isFeatured ? "Yes" : "No"}
                        </p>
                        <a
                            href={proj.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            Live
                        </a>{" "}
                        |{" "}
                        <a
                            href={proj.sourceCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            GitHub
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectAdmin;
