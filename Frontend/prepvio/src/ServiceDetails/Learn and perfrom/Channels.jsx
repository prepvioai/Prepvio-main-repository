import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Columns, List } from "lucide-react";

const USER_API = "http://localhost:5000/api";

function Channels() {
  const [channels, setChannels] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLandscapeMode, setIsLandscapeMode] = useState(false);

  const { courseId } = useParams();
  const navigate = useNavigate();

  /* =========================================================
     UTILS
  ========================================================= */
  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const colorMap = [
    {
      ring: "ring-indigo-500",
      btn: "bg-indigo-600 hover:bg-indigo-700",
      text: "text-indigo-600",
      border: "border-indigo-200",
      bgLight: "bg-indigo-50 hover:bg-indigo-100",
    },
    {
      ring: "ring-pink-500",
      btn: "bg-pink-600 hover:bg-pink-700",
      text: "text-pink-600",
      border: "border-pink-200",
      bgLight: "bg-pink-50 hover:bg-pink-100",
    },
    {
      ring: "ring-green-500",
      btn: "bg-green-600 hover:bg-green-700",
      text: "text-green-600",
      border: "border-green-200",
      bgLight: "bg-green-50 hover:bg-green-100",
    },
    {
      ring: "ring-purple-500",
      btn: "bg-purple-600 hover:bg-purple-700",
      text: "text-purple-600",
      border: "border-purple-200",
      bgLight: "bg-purple-50 hover:bg-purple-100",
    },
  ];

  /* =========================================================
     FETCH COURSE DATA & CHANNELS
  ========================================================= */
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        // Fetch course information
        const courseRes = await axios.get(
          `http://localhost:8000/api/courses/${courseId}`
        );
        setCourseData(courseRes.data);

        // Fetch channels for this course
        const channelsRes = await axios.get(
          `http://localhost:8000/api/channels/course/${courseId}`
        );

        if (Array.isArray(channelsRes.data)) {
          setChannels(channelsRes.data);
        } else {
          setChannels([]);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  /* =========================================================
     ACTIONS
  ========================================================= */
  const handleBack = () => navigate(-1);
  const handleLayoutChange = (mode) => setIsLandscapeMode(mode);

 const handleStartLearning = async (channel) => {
  if (!courseData?.name) return;

  await axios.post(
    "http://localhost:5000/api/users/start-learning",
    {
      courseId: courseId,
      courseTitle: courseData.name,          // ✅ THIS IS THE COURSE NAME
      courseThumbnail: courseData.imageUrl,  // ✅ OPTIONAL BUT CORRECT
      channelId: channel._id,
      channelName: channel.name,
      channelThumbnail: channel.imageUrl,
    },
    { withCredentials: true }
  );

  navigate(`/course/${channel._id}/${courseId}`);
};


  /* =========================================================
     UI
  ========================================================= */
  return (
    <div>
      <section
        className="relative w-full h-screen bg-cover bg-center rounded-3xl"
        style={{ backgroundImage: "url('/Hero.png')" }}
      >
        <section className="container mx-auto py-16">
          {/* HEADER */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {courseData?.title || "Featured Course Channels"}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {courseData?.description || "Discover curated channels for this course."}
            </p>

            {/* Layout + Back */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLayoutChange(false)}
                  className={`p-3 rounded-full ${
                    !isLandscapeMode
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                  aria-label="Grid view"
                >
                  <Columns className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleLayoutChange(true)}
                  className={`p-3 rounded-full ${
                    isLandscapeMode
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleBack}
                className="px-6 py-2 border-2 border-gray-400 rounded-full text-sm hover:bg-gray-100 transition"
              >
                ← Back to Courses
              </button>
            </div>
          </div>

          {/* STATES */}
          {loading && (
            <div className="text-center text-gray-600 text-lg">
              Loading channels...
            </div>
          )}
          
          {error && (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg max-w-md mx-auto">
              {error}
            </div>
          )}
          
          {!loading && !error && channels.length === 0 && (
            <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg max-w-md mx-auto">
              <p className="text-lg">No channels assigned to this course yet.</p>
              <button
                onClick={handleBack}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              >
                Browse Other Courses
              </button>
            </div>
          )}

          {/* CHANNEL CARDS */}
          {!loading && !error && channels.length > 0 && (
            <div
              className={`grid gap-8 max-w-5xl mx-auto ${
                isLandscapeMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
              }`}
            >
              {channels.map((channel, index) => {
                const theme = colorMap[index % colorMap.length];

                return (
                  <div
                    key={channel._id}
                    className="flex flex-col md:flex-row items-center p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition"
                  >
                    {/* LOGO */}
                    {(channel.imageUrl || channel.avatar) && (
                      <div
                        className={`w-24 h-24 rounded-full overflow-hidden ring-4 ${theme.ring} flex-shrink-0`}
                      >
                        <img
                          src={channel.imageUrl || channel.avatar}
                          alt={channel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* INFO */}
                    <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {channel.name}
                      </h3>
                      <p className="mt-2 text-gray-700 text-sm">
                        {channel.description || "No description available"}
                      </p>

                      {/* ACTIONS */}
                      <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleStartLearning(channel)}
                          className={`px-6 py-2 rounded-full text-white font-semibold ${theme.btn} transition`}
                        >
                          Start Learning
                        </button>

                        {channel.link && (
                          <a
                            href={channel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 py-2 rounded-full font-semibold ${theme.text} ${theme.bgLight} border ${theme.border} transition text-center`}
                          >
                            Official Channel
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default Channels;