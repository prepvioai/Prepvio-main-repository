import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit, Loader2, Rocket, Code2, Clock, Zap, Target } from "lucide-react";

const ProjectManagement = () => {
    const [projects, setProjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [selectedFilterCourse, setSelectedFilterCourse] = useState("all");
    const [formData, setFormData] = useState({
        title: "",
        difficulty: "Medium",
        estimatedTime: "",
        xp: 0,
        tech: "",
        description: "",
        thumbnail: "",
        unlocks: "",
        rating: 0,
        completionRate: 0,
        impact: "",
        milestones: "",
        color: "",
        order: 0,
        courseId: ""
    });

    const API_URL = "http://localhost:8000/api/projects";

    useEffect(() => {
        fetchProjects();
        fetchCourses();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(API_URL);
            setProjects(res.data);
        } catch (err) {
            setError("Failed to fetch projects. Please check if the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/courses");
            setCourses(res.data);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        }
    };

    const handleOpenModal = (type, item = null) => {
        setModalType(type);
        setCurrentEditItem(item);
        if (item) {
            setFormData({
                title: item.title || "",
                difficulty: item.difficulty || "Medium",
                estimatedTime: item.estimatedTime || "",
                xp: item.xp || 0,
                tech: Array.isArray(item.tech) ? item.tech.join(", ") : "",
                description: item.description || "",
                thumbnail: item.thumbnail || "",
                unlocks: Array.isArray(item.unlocks) ? item.unlocks.join(", ") : "",
                rating: item.rating || 0,
                completionRate: item.completionRate || 0,
                impact: item.impact || "",
                milestones: Array.isArray(item.milestones) ? item.milestones.join("\n") : "",
                color: item.color || "",
                order: item.order || 0,
                courseId: item.courseId || ""
            });
        } else {
            setFormData({
                title: "",
                difficulty: "Medium",
                estimatedTime: "",
                xp: 0,
                tech: "",
                description: "",
                thumbnail: "",
                unlocks: "",
                rating: 0,
                completionRate: 0,
                impact: "",
                milestones: "",
                color: "",
                order: projects.length + 1,
                courseId: courses.length > 0 ? courses[0]._id : ""
            });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentEditItem(null);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        setActionLoading(true);
        setError(null);

        const itemData = {
            ...formData,
            xp: Number(formData.xp),
            rating: Number(formData.rating),
            completionRate: Number(formData.completionRate),
            order: Number(formData.order),
            tech: formData.tech.split(",").map(t => t.trim()).filter(t => t),
            unlocks: formData.unlocks.split(",").map(u => Number(u.trim())).filter(u => !isNaN(u)),
            milestones: formData.milestones.split("\n").map(m => m.trim()).filter(m => m)
        };

        try {
            if (modalType === "add") {
                await axios.post(API_URL, itemData);
            } else {
                await axios.put(`${API_URL}/${currentEditItem._id}`, itemData);
            }
            handleCloseModal();
            await fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${modalType} project`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            setActionLoading(true);
            setError(null);
            try {
                await axios.delete(`${API_URL}/${id}`);
                await fetchProjects();
            } catch (err) {
                setError("Failed to delete project");
            } finally {
                setActionLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Project Map Management</h1>
                        <p className="text-slate-600 mt-1 font-medium">Build the roadmap for user skills 🚀</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Course Filter Dropdown */}
                        <div className="flex items-center bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/50 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-3">Filter:</span>
                            <select
                                value={selectedFilterCourse}
                                onChange={(e) => setSelectedFilterCourse(e.target.value)}
                                className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                            >
                                <option value="all">All Courses</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.name}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => handleOpenModal("add")}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#D4F478] to-yellow-400 text-black rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-black active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add New Project</span>
                        </button>
                    </div>
                </div>

                {/* Error Notification */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-2xl flex items-center justify-between">
                        <span className="font-medium">{error}</span>
                        <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                    </div>
                )}

                {/* Table View */}
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-8">
                    {loading && projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="w-12 h-12 text-slate-500 animate-spin" />
                            <p className="text-slate-600 font-semibold animate-pulse">Loading project map...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-slate-300/50">
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Difficulty/XP</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Tech Stack</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50">
                                    {projects.length > 0 ? (
                                        projects
                                            .filter(p => selectedFilterCourse === "all" || p.courseId === selectedFilterCourse)
                                            .map((project) => (
                                                <tr key={project._id} className="group hover:bg-white/30 transition-all duration-200">
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full text-xs font-black">
                                                                {project.order}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold mt-1">
                                                                of {courses.find(c => c._id === project.courseId)?.totalLevels || "8"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={project.thumbnail}
                                                                alt={project.title}
                                                                className="h-12 w-12 rounded-xl object-cover shadow-sm"
                                                                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                                            />
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-800">{project.title}</div>
                                                                <div className="text-[10px] text-slate-500 font-medium">{project.estimatedTime}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white w-fit ${project.difficulty === 'Hard' ? 'bg-orange-500' :
                                                                project.difficulty === 'Expert' ? 'bg-red-500' :
                                                                    project.difficulty === 'Final Boss' ? 'bg-purple-600' : 'bg-green-500'
                                                                }`}>
                                                                {project.difficulty}
                                                            </span>
                                                            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                                                                <Zap size={10} /> {project.xp} XP
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-slate-600 max-w-xs">
                                                        <div className="flex flex-wrap gap-1">
                                                            {project.tech.map((t, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleOpenModal("edit", project)}
                                                                className="p-2.5 bg-blue-100/50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all active:scale-90"
                                                            >
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(project._id)}
                                                                className="p-2.5 bg-red-100/50 text-red-600 hover:bg-red-100 rounded-xl transition-all active:scale-90"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-20">
                                                <p className="text-slate-500 text-lg font-medium">No projects found in the map.</p>
                                                <p className="text-slate-400 text-sm mt-1">Start by adding the first challenge!</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-md z-50 p-4">
                    <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/50 transform animate-in zoom-in-95">
                        <h2 className="text-3xl font-black mb-6 text-slate-800 tracking-tight">
                            {modalType === "add" ? "Create New Project Node" : "Edit Project Details"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="admin-input" placeholder="e.g. AI SaaS Platform" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Difficulty</label>
                                            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="admin-input">
                                                <option>Easy</option>
                                                <option>Medium</option>
                                                <option>Hard</option>
                                                <option>Expert</option>
                                                <option>Final Boss</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                                Level (Total: {courses.find(c => c._id === formData.courseId)?.totalLevels || "8"})
                                            </label>
                                            <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="admin-input" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Estimated Time</label>
                                            <input type="text" name="estimatedTime" value={formData.estimatedTime} onChange={handleInputChange} className="admin-input" placeholder="e.g. 10-12 hours" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">XP Reward</label>
                                            <input type="number" name="xp" value={formData.xp} onChange={handleInputChange} className="admin-input" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tech Stack (comma separated)</label>
                                        <input type="text" name="tech" value={formData.tech} onChange={handleInputChange} className="admin-input" placeholder="React, Node.js, etc." required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Thumbnail URL</label>
                                        <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleInputChange} className="admin-input" placeholder="https://unsplash.com/..." required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Course</label>
                                        <select name="courseId" value={formData.courseId} onChange={handleInputChange} className="admin-input" required>
                                            <option value="">Select a course</option>
                                            {courses.map(course => (
                                                <option key={course._id} value={course._id}>{course.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="admin-input resize-none" placeholder="What is this project about?" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Impact</label>
                                        <input type="text" name="impact" value={formData.impact} onChange={handleInputChange} className="admin-input" placeholder="e.g. High viral potential" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Avg Rating</label>
                                            <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleInputChange} className="admin-input" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Completion Rate (%)</label>
                                            <input type="number" name="completionRate" value={formData.completionRate} onChange={handleInputChange} className="admin-input" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Unlocks Project Orders (comma separated)</label>
                                        <input type="text" name="unlocks" value={formData.unlocks} onChange={handleInputChange} className="admin-input" placeholder="e.g. 4, 5" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Milestones (one per line)</label>
                                        <textarea name="milestones" value={formData.milestones} onChange={handleInputChange} rows="4" className="admin-input resize-none" placeholder="Set up API\nBuild UI\n..." />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button type="button" onClick={handleCloseModal} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-all font-bold">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl hover:bg-slate-800 transition-all font-black flex items-center justify-center gap-2" disabled={actionLoading}>
                                    {actionLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {modalType === "add" ? "Create Project" : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style sx>{`
                .admin-input {
                    width: 100%;
                    border: 2px solid #f1f5f9;
                    border-radius: 1rem;
                    padding: 0.875rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.2s;
                    background: #f8fafc;
                }
                .admin-input:focus {
                    border-color: #3b82f6;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
            `}</style>
        </div>
    );
};

export default ProjectManagement;