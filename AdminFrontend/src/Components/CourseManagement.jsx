import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2, 
  BookOpen, 
  Layers, 
  MonitorPlay, 
  X, 
  Search, 
  Star, 
  Users, 
  ArrowUpDown,
  LayoutGrid,
  List
} from "lucide-react";

const CourseManagement = () => {
  // --- State Management ---
  const [courses, setCourses] = useState([]);
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Form States
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [courseImageUrl, setCourseImageUrl] = useState("");
  const [totalLevels, setTotalLevels] = useState(0);

  const BASE_URL = "http://localhost:8000/api";

  // --- Helper: Generate Stats for UI Display ---
  const getStats = (id) => {
    const hash = id ? id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return {
      rating: (4 + (hash % 10) / 10).toFixed(1),
      students: 500 + (hash % 100) * 100
    };
  };

  // --- API Functions (Strict Backend Only) ---
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/channels`);
      setChannels(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching channels:", error);
      setChannels([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      setCategories(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchChannels();
    fetchCategories();
  }, []);

  // --- Filtering Logic ---
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const categoryName = course.categoryId?.name || "Uncategorized";
      const matchesCategory = activeCategory === "All" || categoryName === activeCategory;
      const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [courses, activeCategory, searchQuery]);

  // --- Modal Logic ---
  const openModal = (course = null) => {
    setEditingCourse(course);
    if (course) {
      setCourseName(course.name);
      setCourseDescription(course.description);
      setCourseImageUrl(course.imageUrl || "");
      setSelectedCategory(course.categoryId?._id || "");
      setSelectedChannels(course.channels?.map((ch) => ch._id) || []);
      setTotalLevels(course.totalLevels || 0);
    } else {
      setCourseName("");
      setCourseDescription("");
      setCourseImageUrl("");
      setSelectedCategory("");
      setSelectedChannels([]);
      setTotalLevels(0);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
  };

  // --- Actions (Strict Backend Only) ---
  const saveCourse = async () => {
    if (!courseName.trim() || !courseDescription.trim()) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      setActionLoading(true);
      const courseData = {
        name: courseName,
        description: courseDescription,
        imageUrl: courseImageUrl,
        categoryId: selectedCategory,
        channels: selectedChannels,
        totalLevels: Number(totalLevels),
      };

      if (editingCourse) {
        await axios.put(`${BASE_URL}/courses/${editingCourse._id}`, courseData);
      } else {
        await axios.post(`${BASE_URL}/courses`, courseData);
      }

      fetchCourses();
      closeModal();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      setActionLoading(true);
      await axios.delete(`${BASE_URL}/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-rose-200 to-slate-300 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-600/30">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">Course Management</h1>
              <p className="text-slate-600 font-medium">Create and organize learning paths for your students</p>
            </div>
          </div>
          
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold active:scale-95 shadow-lg shadow-emerald-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>Add Course</span>
          </button>
        </div>

        {/* --- Main Glassy Card --- */}
        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-6 md:p-10">
          
          {/* Controls: Search, View Toggle & Filters */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
              <div className="relative group w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-transparent rounded-2xl text-slate-800 placeholder-slate-500 font-medium focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-100/50 outline-none transition-all shadow-sm"
                />
              </div>

              {/* View Toggle */}
              <div className="flex bg-white/50 p-1.5 rounded-2xl border-2 border-transparent shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === "grid" ? "bg-white shadow-md text-orange-600" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === "list" ? "bg-white shadow-md text-orange-600" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"}`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              <button
                 onClick={() => setActiveCategory("All")}
                 className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${activeCategory === "All" ? "bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-900/20" : "bg-white/50 text-slate-600 border-transparent hover:bg-white hover:border-white/60"}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${activeCategory === cat.name ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30" : "bg-white/50 text-slate-600 border-transparent hover:bg-white hover:border-white/60"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-16 h-16 text-orange-600 animate-spin" />
              <p className="text-slate-600 font-bold text-lg animate-pulse tracking-tight">Loading Courses...</p>
            </div>
          ) : (
            <>
              {filteredCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-60">
                  <div className="w-20 h-20 bg-slate-100/50 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Search className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-slate-800 font-black text-xl">No courses found</h3>
                  <p className="text-slate-600 font-medium mt-2">Try adjusting your filters or add a new course.</p>
                </div>
              ) : (
                <>
                  {/* --- GRID VIEW --- */}
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredCourses.map((course) => {
                        const stats = (course.rating && course.students) ? course : { ...course, ...getStats(course._id) };
                        return (
                          <div key={course._id} className="group flex flex-col bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            {/* Image Header */}
                            <div className="relative h-48 overflow-hidden">
                              {course.imageUrl ? (
                                <img 
                                  src={course.imageUrl} 
                                  alt={course.name} 
                                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                  onError={(e) => {e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80"}}
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                  <BookOpen className="w-12 h-12 text-slate-400" />
                                </div>
                              )}
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                                  {course.categoryId?.name || "Uncategorized"}
                                </span>
                                {course.totalLevels > 0 && (
                                  <span className="ml-2 px-3 py-1.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                                    {course.totalLevels} Levels
                                  </span>
                                )}
                              </div>
                              {/* Overlay Actions */}
                              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button 
                                  onClick={() => openModal(course)}
                                  className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-blue-50 shadow-sm"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => deleteCourse(course._id)}
                                  className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-red-50 shadow-sm"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-6">
                              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                                {course.name}
                              </h3>
                              
                              {/* Channels Tags */}
                              <div className="flex flex-wrap gap-1 mb-4">
                                {course.channels?.length > 0 ? (
                                  course.channels.slice(0, 3).map((ch) => (
                                    <span key={ch._id} className="bg-indigo-100/50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-200/50">
                                      {ch.name}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic">No channels</span>
                                )}
                              </div>

                              {/* Stats Footer */}
                              <div className="mt-auto pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-amber-500">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="text-sm font-bold">{stats.rating}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500">
                                  <Users className="w-4 h-4" />
                                  <span className="text-xs font-bold">{(parseInt(stats.students)/1000).toFixed(1)}k</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* --- LIST VIEW --- */}
                  {viewMode === "list" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-300/50">
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                              <div className="flex items-center gap-2">Course Info <ArrowUpDown className="w-3 h-3" /></div>
                            </th>
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Category</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Performance</th>
                            <th className="px-6 py-5 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Channels</th>
                            <th className="px-6 py-5 text-right text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/40">
                          {filteredCourses.map((course) => {
                            const stats = (course.rating && course.students) ? course : { ...course, ...getStats(course._id) };
                            return (
                              <tr key={course._id} className="group hover:bg-white/40 transition-all duration-300">
                                <td className="px-6 py-6 w-96">
                                  <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 flex-shrink-0">
                                      {course.imageUrl ? (
                                        <img 
                                          src={course.imageUrl} 
                                          alt="" 
                                          className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white/60" 
                                          onError={(e) => {e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=100&q=80"}}
                                        />
                                      ) : (
                                        <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center border-2 border-white/60">
                                          <BookOpen className="w-6 h-6 text-slate-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                      <span className="text-base font-bold text-slate-800 line-clamp-1">{course.name}</span>
                                      <span className="text-xs font-medium text-slate-500 line-clamp-1 mt-0.5">{course.description}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-orange-500" />
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold text-slate-700">{course.categoryId?.name || "Uncategorized"}</span>
                                      {course.totalLevels > 0 && (
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.totalLevels} levels</span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                  <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                      <span className="text-xs font-bold">{stats.rating} Rating</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                      <Users className="w-4 h-4" />
                                      <span className="text-xs font-bold">{(parseInt(stats.students)/1000).toFixed(1)}k Students</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-6">
                                  <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                    {course.channels?.length > 0 ? (
                                      course.channels.map((ch) => (
                                        <span key={ch._id} className="bg-indigo-100/60 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-indigo-200/50 flex items-center gap-1">
                                          <MonitorPlay className="w-2.5 h-2.5" />
                                          {ch.name}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-xs text-slate-400 italic">No channels</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <button
                                      onClick={() => openModal(course)}
                                      className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm hover:shadow-md active:scale-90"
                                      title="Edit Course"
                                    >
                                      <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => deleteCourse(course._id)}
                                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm hover:shadow-md active:scale-90"
                                      title="Delete Course"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- Glassy Modal --- */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-md z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-8 md:p-12 w-full max-w-2xl border border-white/50 transform animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {editingCourse ? "Edit Course Settings" : "Register New Course"}
                </h2>
                <p className="text-slate-500 font-bold mt-1">Fill in the details below to update your catalog.</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 font-black text-2xl transition-colors bg-slate-100 p-2 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Course Name</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Master React in 30 Days"
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-slate-50/50 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-slate-50/50 font-bold text-slate-700"
                  >
                    <option value="">Choose a category...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Description</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Brief summary of the course content..."
                  rows="3"
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-slate-50/50 font-medium text-slate-700 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={courseImageUrl}
                  onChange={(e) => setCourseImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-slate-50/50 font-medium text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Roadmap Total Levels</label>
                <input
                  type="number"
                  value={totalLevels}
                  onChange={(e) => setTotalLevels(e.target.value)}
                  placeholder="e.g. 6"
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-slate-50/50 font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Active Channels</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100">
                  {channels.map((ch) => {
                     const isSelected = selectedChannels.includes(ch._id);
                     return (
                      <label key={ch._id} className={`flex items-center gap-2 group cursor-pointer p-2 rounded-xl transition-all ${isSelected ? 'bg-white shadow-sm' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedChannels([...selectedChannels, ch._id]);
                            else setSelectedChannels(selectedChannels.filter(id => id !== ch._id));
                          }}
                          className="w-5 h-5 rounded-lg border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-700'}`}>{ch.name}</span>
                      </label>
                     );
                  })}
                </div>
              </div>

              <div className="flex gap-4 pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={closeModal}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] hover:bg-slate-200 transition-all font-bold active:scale-95"
                >
                  Discard
                </button>
                <button
                  onClick={saveCourse}
                  disabled={actionLoading}
                  className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 font-bold active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
// import Modal from "./Modal";

// const CourseManagement = () => {
//   const [courses, setCourses] = useState([]);
//   const [channels, setChannels] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [courseName, setCourseName] = useState("");
//   const [courseDescription, setCourseDescription] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedChannels, setSelectedChannels] = useState([]);
//   const [courseImageUrl, setCourseImageUrl] = useState("");

//   // Fetch courses
//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:8000/api/courses");
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch channels (corrected)
//   // Fetch channels (corrected)
// const fetchChannels = async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/api/channels");
//     console.log("Channels response:", response.data); // Debug log
    
//     // Use response.data directly, not response.data.data
//     setChannels(Array.isArray(response.data) ? response.data : []);
//   } catch (error) {
//     console.error("Error fetching channels:", error);
//     setChannels([]); // Set empty array on error
//   }
// };

//   // Fetch categories (corrected)
// const fetchCategories = async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/api/categories");
//     console.log("Categories response:", response.data); // Debug log

//     // ✅ Use response.data.data instead of response.data
//     setCategories(Array.isArray(response.data.data) ? response.data.data : []);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     setCategories([]); // fallback
//   }
// };


//   useEffect(() => {
//     fetchCourses();
//     fetchChannels();
//     fetchCategories();
//   }, []);

//   // Open Modal
//   const openModal = (course = null) => {
//     setEditingCourse(course);
//     if (course) {
//       setCourseName(course.name);
//       setCourseDescription(course.description);
//       setCourseImageUrl(course.imageUrl || "");
//       setSelectedCategory(course.categoryId?._id || "");
//       // ✅ Add a safe check for `course.channels` before mapping
//       setSelectedChannels(course.channels?.map((ch) => ch._id) || []);
//     } else {
//       setCourseName("");
//       setCourseDescription("");
//       setCourseImageUrl("");
//       setSelectedCategory("");
//       setSelectedChannels([]);
//     }
//     setModalOpen(true);
//   };

//   // Save Course
//   const saveCourse = async () => {
//     try {
//       const courseData = {
//         name: courseName,
//         description: courseDescription,
//         imageUrl: courseImageUrl,
//         categoryId: selectedCategory,
//         channels: selectedChannels,
//       };

//       if (editingCourse) {
//         await axios.put(
//           `http://localhost:8000/api/courses/${editingCourse._id}`,
//           courseData
//         );
//       } else {
//         await axios.post("http://localhost:8000/api/courses", courseData);
//       }

//       fetchCourses();
//       setModalOpen(false);
//     } catch (error) {
//       console.error("Error saving course:", error);
//     }
//   };

//   // Delete Course
//   const deleteCourse = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/courses/${id}`);
//       fetchCourses();
//     } catch (error) {
//       console.error("Error deleting course:", error);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">Course Management</h2>
//         <button
//           onClick={() => openModal()}
//           className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//         >
//           <FaPlus className="mr-2" /> Add Course
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading courses...</p>
//       ) : (
//         <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 Description
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 Category
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 Channels
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {courses.map((course) => (
//               <tr key={course._id} className="border-t">
//                 <td className="px-6 py-4 text-sm text-gray-900">
//                   {course.name}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {course.description}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {course.categoryId?.name || "N/A"}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {/* ✅ The fix: Use optional chaining to safely access 'channels' */}
//                   {course.channels?.map((ch) => ch.name).join(", ") || "N/A"}
//                 </td>
//                 <td className="px-6 py-4 text-sm">
//                   <button
//                     onClick={() => openModal(course)}
//                     className="text-blue-500 hover:text-blue-700 mr-2"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => deleteCourse(course._id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {modalOpen && (
//         <Modal onClose={() => setModalOpen(false)}>
//           <h3 className="text-lg font-semibold mb-4">
//             {editingCourse ? "Edit Course" : "Add Course"}
//           </h3>
//           <input
//             type="text"
//             value={courseName}
//             onChange={(e) => setCourseName(e.target.value)}
//             placeholder="Course Name"
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <textarea
//             value={courseDescription}
//             onChange={(e) => setCourseDescription(e.target.value)}
//             placeholder="Course Description"
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <input
//             type="text"
//             value={courseImageUrl}
//             onChange={(e) => setCourseImageUrl(e.target.value)}
//             placeholder="Course Image URL"
//             className="w-full p-2 mb-2 border rounded"
//           />
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="w-full p-2 mb-2 border rounded"
//           >
//             <option value="">Select a category...</option>
//             {/* ✅ Add a safe check for the 'categories' array */}
//             {Array.isArray(categories) && categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//           <select
//             multiple
//             value={selectedChannels}
//             onChange={(e) =>
//               setSelectedChannels(
//                 [...e.target.selectedOptions].map((o) => o.value)
//               )
//             }
//             className="w-full p-2 mb-4 border rounded"
//           >
//             {/* ✅ Add a safe check for the 'channels' array */}
//             {Array.isArray(channels) && channels.map((ch) => (
//               <option key={ch._id} value={ch._id}>
//                 {ch.name}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={saveCourse}
//             className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//           >
//             Save
//           </button>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default CourseManagement;