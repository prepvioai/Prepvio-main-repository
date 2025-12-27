import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, XCircle, Bookmark, Play, Clock } from "lucide-react";

axios.defaults.withCredentials = true;

const USER_API = "http://localhost:5000/api";

export default function SavedCourse() {
  const navigate = useNavigate();
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCourses = async () => {
      try {
        const res = await axios.get(`${USER_API}/users/watch-later`);
        setSavedCourses(res.data.data);
      } catch (err) {
        console.error("Failed to fetch saved courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedCourses();
  }, []);

  const handleRemove = async (videoId) => {
    try {
      await axios.delete(`${USER_API}/users/watch-later/${videoId}`);
      setSavedCourses((prev) =>
        prev.filter((v) => v.videoId !== videoId)
      );
    } catch {
      alert("Failed to remove video");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const diffDays = Math.floor(
      (Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading saved videos…
      </div>
    );
  }

  if (savedCourses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        No saved videos yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-lg bg-indigo-600 text-white">
          <Bookmark className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Watch Later</h1>
          <p className="text-sm text-gray-500">
            {savedCourses.length} saved videos
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedCourses.map((course) => (
          <div
            key={course.videoId}
            className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />

              {/* Saved date */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 text-xs text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(course.savedAt)}
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1">
                {/* <button className="p-1.5 bg-white/90 rounded-md">
                  <Heart className="w-4 h-4 text-gray-500" />
                </button> */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(course.videoId);
                  }}
                  className="p-1.5 bg-white/90 rounded-md"
                >
                  <XCircle className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-medium text-sm leading-snug line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {course.channelName}
                </p>
              </div>

              {/* Action */}
              <button
                disabled={!course.channelId}
                onClick={() =>
                  navigate(
                    `/${encodeURIComponent(course.channelName)}/${course.channelId}/${course.courseId}?video=${course.videoId}`
                  )
                }
                className={`w-full inline-flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors
                  ${
                    course.channelId
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <Play className="w-4 h-4" />
                Watch
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
