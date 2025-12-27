import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpen, Play, Clock, CheckCircle } from "lucide-react";

const USER_API = "http://localhost:5000/api";

export default function Learning() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH COURSE + CHANNEL PROGRESS
  ========================================================= */
  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const res = await axios.get(
          `${USER_API}/users/my-learning`,
          { withCredentials: true }
        );

        const data = (res.data.data || []).map((course) => {
          const percentage =
            course.totalSeconds > 0
              ? Math.min(
                Math.round(
                  (course.watchedSeconds / course.totalSeconds) * 100
                ),
                100
              )
              : 0;

          return {
            ...course,
            percentage,
            completed: percentage >= 90,
          };
        });

        setCourses(data);
      } catch (err) {
        console.error("Failed to load learning data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearning();
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */
  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  /* =========================================================
     ACTIONS
  ========================================================= */
  const handleResumeCourse = (course) => {
  const url = course.lastVideoId
    ? `/course/${course.channelId}/${course.courseId}?video=${course.lastVideoId}`
    : `/course/${course.channelId}/${course.courseId}`;

  navigate(url);
};


  /* =========================================================
     STATS
  ========================================================= */
  const inProgressCount = courses.filter(
    (c) => !c.completed
  ).length;

  const completedCount = courses.filter(
    (c) => c.completed
  ).length;

  /* =========================================================
     LOADING STATE
  ========================================================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading your learning…
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="flex h-screen p-6 overflow-hidden">
      <div className="flex-1 bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="p-6 border-b border-white/50 flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            My Learning
          </h2>

          <div className="flex gap-4">
            <div className="bg-indigo-100/50 px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-600">In Progress</p>
              <p className="text-lg font-bold text-indigo-600">
                {inProgressCount}
              </p>
            </div>

            <div className="bg-green-100/50 px-4 py-2 rounded-xl">
              <p className="text-xs text-gray-600">Completed</p>
              <p className="text-lg font-bold text-green-600">
                {completedCount}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <BookOpen className="w-16 h-16 opacity-30 mb-4" />
              <p className="text-lg font-medium">
                No learning activity yet
              </p>
              <p className="text-sm">
                Start learning a course to see progress here
              </p>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={`${course.courseId}-${course.channelId}`}
                className={`p-5 rounded-2xl shadow-md ${course.completed
                    ? "bg-green-100/50"
                    : "bg-indigo-100/40"
                  }`}
              >
                <div className="flex items-start justify-between gap-6">

                  {/* LEFT */}
                  {/* LEFT */}
                  <div className="flex-1 flex gap-4">

                    {course.channelThumbnail && (
                      <img
                        src={course.channelThumbnail}
                        alt={course.channelName}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    )}


                    {/* TEXT CONTENT */}
                    <div className="flex-1">
                      <div className="mb-1">
                        <h3 className="text-lg font-semibold">
                          {course.courseTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {course.channelName}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(course.watchedSeconds)} watched
                        </div>
                        <div>
                          Last accessed:{" "}
                          {new Date(course.lastAccessed).toLocaleDateString()}
                        </div>
                      </div>

                      {/* PROGRESS BAR */}
                      <div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 transition-all"
                            style={{ width: `${course.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {course.percentage}% completed
                        </p>
                      </div>
                    </div>
                  </div>


                  {/* ACTION */}
                  <div>
                    {!course.completed ? (
                      <button
                        onClick={() => handleResumeCourse(course)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
                      >
                        <Play className="w-4 h-4" />
                        Continue
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-green-700 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </span>
                    )}
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
