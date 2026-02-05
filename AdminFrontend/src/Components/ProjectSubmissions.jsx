import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, ExternalLink, CheckCircle2, XCircle, Clock, MessageSquare, Send, Target } from "lucide-react";

const ProjectSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reviewModal, setReviewModal] = useState(false);
    const [currentSubmission, setCurrentSubmission] = useState(null);
    const [reviewData, setReviewData] = useState({
        status: "reviewed",
        feedback: ""
    });

    const API_URL = "http://localhost:8000/api/project-submissions";

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(API_URL);
            setSubmissions(res.data);
        } catch (err) {
            setError("Failed to fetch submissions. Please check if the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReview = (submission) => {
        setCurrentSubmission(submission);
        setReviewData({
            status: submission.status === "pending" ? "reviewed" : submission.status,
            feedback: submission.feedback || ""
        });
        setReviewModal(true);
    };

    const handleReviewSubmit = async (e) => {
        if (e) e.preventDefault();
        setActionLoading(true);
        try {
            await axios.put(`${API_URL}/${currentSubmission._id}`, reviewData);
            setReviewModal(false);
            fetchSubmissions();
        } catch (err) {
            setError("Failed to update review status");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Project Submissions</h1>
                    <p className="text-slate-600 mt-1 font-medium">Review and provide feedback on user project builds 🛠️</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-2xl">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Grid View */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-12 h-12 text-slate-500 animate-spin" />
                        <p className="text-slate-600 font-semibold animate-pulse">Loading submissions...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {submissions.length > 0 ? (
                            submissions.map((sub) => (
                                <div key={sub._id} className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800">{sub.projectTitle}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">User ID: {sub.userId}</p>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${sub.status === 'reviewed' ? 'bg-green-100 text-green-600' :
                                            sub.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {sub.status}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ExternalLink size={14} className="text-blue-500" />
                                                <span className="text-xs font-bold text-blue-600 uppercase">Live Demo</span>
                                            </div>
                                            <a href={sub.link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 hover:underline break-all">
                                                {sub.link}
                                            </a>
                                        </div>

                                        {sub.notes && (
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">User Notes</span>
                                                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">"{sub.notes}"</p>
                                            </div>
                                        )}

                                        {sub.feedback && (
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Your Feedback</span>
                                                <p className="text-sm text-slate-700 font-medium bg-green-50/50 p-4 rounded-2xl border border-green-100">
                                                    {sub.feedback}
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                <Clock size={12} /> {new Date(sub.submittedAt).toLocaleDateString()}
                                            </span>
                                            <button
                                                onClick={() => handleOpenReview(sub)}
                                                className="px-6 py-2 bg-black text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-2"
                                            >
                                                <MessageSquare size={14} />
                                                {sub.status === 'pending' ? 'Review Now' : 'Edit Review'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center">
                                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="text-slate-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-500">No submissions yet</h3>
                                <p className="text-slate-400 text-sm mt-1">When users submit their project builds, they will appear here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {reviewModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-md z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-xl border border-white/50 animate-in zoom-in-95">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-black text-slate-800">Project Review</h2>
                                <p className="text-slate-500 font-medium">{currentSubmission.projectTitle}</p>
                            </div>
                            <button onClick={() => setReviewModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle className="text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Decision</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setReviewData({ ...reviewData, status: "reviewed" })}
                                        className={`py-4 rounded-2xl flex items-center justify-center gap-2 font-black border-2 transition-all ${reviewData.status === 'reviewed' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                                            }`}
                                    >
                                        <CheckCircle2 size={18} /> Approve
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setReviewData({ ...reviewData, status: "rejected" })}
                                        className={`py-4 rounded-2xl flex items-center justify-center gap-2 font-black border-2 transition-all ${reviewData.status === 'rejected' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                                            }`}
                                    >
                                        <XCircle size={18} /> Reject
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Feedback to User</label>
                                <textarea
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 text-sm font-semibold outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                                    rows="6"
                                    placeholder="Write your feedback here... What was good? What could be improved?"
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                Submit Evaluation
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectSubmissions;