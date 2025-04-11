"use client";
import React, { useState } from "react";
import fakeProjects from "../constants/fakeProjects";

const CreateProjectForm = ({ onProjectCreated }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        projectLink: "",
        sourceCode: "",
        imageUrl: "",
        techStack: "",
        isFeatured: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newProject = {
            _id: Date.now().toString(), // generate a fake ID
            ...formData,
            techStack: formData.techStack.split(",").map((tech) => tech.trim()),
        };

        // Push to the fakeProjects array
        fakeProjects.push(newProject);

        // Reset form
        setFormData({
            title: "",
            description: "",
            projectLink: "",
            sourceCode: "",
            imageUrl: "",
            techStack: "",
            isFeatured: false,
        });

        // Notify parent to re-fetch projects
        onProjectCreated();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow mb-6">
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="block w-full mb-2 p-2" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="block w-full mb-2 p-2" />
            <input type="text" name="projectLink" placeholder="Project Link" value={formData.projectLink} onChange={handleChange} className="block w-full mb-2 p-2" />
            <input type="text" name="sourceCode" placeholder="GitHub Link" value={formData.sourceCode} onChange={handleChange} className="block w-full mb-2 p-2" />
            <input type="text" name="imageUrl" placeholder="Image URL (from GitHub)" value={formData.imageUrl} onChange={handleChange} className="block w-full mb-2 p-2" />
            <input type="text" name="techStack" placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={handleChange} className="block w-full mb-2 p-2" />
            <label className="block mb-2">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Mark as Featured
            </label>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add Project</button>
        </form>
    );
};

export default CreateProjectForm;
