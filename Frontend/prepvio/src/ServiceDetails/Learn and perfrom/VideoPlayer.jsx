import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import YouTube from "react-youtube";

/* ======================================================
   CONFIG
====================================================== */
const BASE_URL = "http://localhost:8000/api";
const USER_API = "http://localhost:5000/api";
const YOUTUBE_API_KEY = "AIzaSyBs569PnYQUNFUXon5AMersGFuKS8aS1QQ";

/* ======================================================
   REUSABLE COMPONENTS
====================================================== */

// Channel Card Component
const ChannelCard = ({ name, imageUrl }) => (
  <div className="bg-indigo-400 rounded-xl text-white p-4 mb-4 flex items-center space-x-4">
    <img
      src={imageUrl || "/fallback.jpg"}
      alt={name}
      className="w-16 h-16 rounded-sm object-cover"
    />
    <div>
      <div className="text-lg font-semibold">{name}</div>
      <div className="mt-2 underline cursor-pointer">My Notes</div>
    </div>
  </div>
);

// Playlist Item Component
const PlayListItem = ({
  video,
  index,
  duration,
  onVideoSelect,
  isPlaying,
  videoProgress,
}) => {
  const title = video?.snippet?.title || "No Title";
  const thumbnail = video?.snippet?.thumbnails?.medium?.url;
  const videoId = video?.snippet?.resourceId?.videoId;
  const progress = videoProgress[videoId] || 0;

  const totalSeconds = duration || 0;

  const isCompleted = totalSeconds > 0 && progress >= totalSeconds * 0.9;
  const showResume = progress > 5 && !isCompleted;

  const formatSeconds = (seconds) => {
    if (!seconds) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div
      onClick={() => onVideoSelect(video)}
      className={`cursor-pointer rounded-xl p-2 flex items-center space-x-4 transition relative
        ${isPlaying ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"}`}
    >
      <div className="w-[100px] h-[70px] flex-shrink-0 overflow-hidden rounded bg-black relative">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-contain"
          />
        )}

        {progress > 0 && totalSeconds > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
            <div
              className="h-full bg-indigo-500"
              style={{
                width: `${Math.min((progress / totalSeconds) * 100, 100)}%`,
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between h-[70px] w-full">
        <div className="text-sm font-semibold leading-tight line-clamp-2">
          {index + 1}. {title}
        </div>

        <div className="text-xs mt-1 flex items-center space-x-2">
          <span>Duration: {formatSeconds(totalSeconds) || "N/A"}</span>

          {isPlaying && (
            <span className="text-blue-900 font-semibold">Now Playing</span>
          )}

          {!isPlaying && isCompleted && (
            <span className="text-emerald-700 font-semibold">Completed</span>
          )}

          {!isPlaying && showResume && (
            <span className="text-amber-600 font-semibold">
              Resume at {Math.floor(progress / 60)}:
              {String(Math.floor(progress % 60)).padStart(2, "0")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Video Player Component
const PlayListPlayer = ({
  video,
  onPlayerReady,
  onStateChange,
  onWatchLater,
  isSaved,
  isSaving,
}) => {
  const videoId = video?.snippet?.resourceId?.videoId;
  const title = video?.snippet?.title;

  if (!videoId) {
    return (
      <div className="w-full lg:w-2/3 bg-white p-2 rounded-xl shadow-md text-center">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Select a video to play.
        </div>
      </div>
    );
  }

  const opts = {
    height: "475",
    width: "845",
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  return (
    <div className="w-full lg:w-2/3 bg-white p-4 rounded-xl shadow-md">
      <div className="aspect-video mb-4 overflow-hidden rounded-lg">
        <YouTube
          key={videoId}
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
        />
      </div>

      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-lg font-semibold line-clamp-2 w-full pr-2">
          {title}
        </h2>
        <button
          onClick={onWatchLater}
          disabled={isSaved || isSaving}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2
            transition-colors whitespace-nowrap
            ${
              isSaved
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
            }
          `}
        >
          {isSaved ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Saved
            </>
          ) : (
            "Watch Later"
          )}
        </button>
      </div>
    </div>
  );
};

// Sidebar Component
const PlayListSidebar = ({
  videos,
  durations,
  onVideoSelect,
  selectedVideoId,
  channelData,
  videoProgress,
}) => {
  return (
    <div className="w-full lg:w-1/3 bg-white p-2 rounded-xl shadow-md">
      <ChannelCard name={channelData?.name} imageUrl={channelData?.imageUrl} />
      <div className="text-sm font-semibold mb-1">Lesson Playlist</div>
      <div className="max-h-[400px] overflow-y-auto pr-1 space-y-4">
        {videos.map((video, index) => {
          const videoId = video?.snippet?.resourceId?.videoId;
          return (
            <PlayListItem
              key={video.id}
              index={index}
              video={video}
              duration={durations[videoId]}
              onVideoSelect={onVideoSelect}
              isPlaying={selectedVideoId === videoId}
              videoProgress={videoProgress}
            />
          );
        })}
      </div>
    </div>
  );
};

// Quiz Modal Component
const QuizModal = ({ quiz, onAnswer, onClose }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleButtonClick = (option) => {
    setSelectedAnswer(option);
    onAnswer(option);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm z-[100] animate-fadeIn">
      <div className="relative bg-gray-800 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl transform transition-transform duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-white">Quiz Question</h2>
          {selectedAnswer && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl font-bold"
            >
              ✖
            </button>
          )}
        </div>

        <span className="text-gray-500 text-sm font-semibold block mb-4">
          {quiz.questionNumber || ""}
        </span>

        <p className="mb-8 text-gray-300 text-xl font-medium leading-relaxed">
          {quiz.question}
        </p>

        <div className="flex flex-col gap-4">
          {quiz.options.map((option, i) => {
            let buttonClasses =
              "w-full py-4 rounded-xl font-bold transition-all duration-200 ease-in-out transform";
            let hoverClasses = "hover:-translate-y-1 hover:shadow-lg";

            if (selectedAnswer) {
              if (option === quiz.correctAnswer) {
                buttonClasses +=
                  " bg-green-600 text-white shadow-green-500/30";
                hoverClasses = "";
              } else if (
                option === selectedAnswer &&
                option !== quiz.correctAnswer
              ) {
                buttonClasses += " bg-red-600 text-white shadow-red-500/30";
                hoverClasses = "";
              } else {
                buttonClasses +=
                  " bg-gray-700 text-gray-400 cursor-not-allowed";
                hoverClasses = "";
              }
            } else {
              buttonClasses += " bg-gray-700 text-gray-200 " + hoverClasses;
            }

            return (
              <button
                key={i}
                className={buttonClasses}
                onClick={() => handleButtonClick(option)}
                disabled={!!selectedAnswer}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="mt-6 text-center text-lg font-bold">
            {selectedAnswer === quiz.correctAnswer ? (
              <span className="text-green-400">Correct! You've got it.</span>
            ) : (
              <span className="text-red-400">
                Incorrect! The correct answer was:
                <span className="block mt-1 font-extrabold text-white">
                  "{quiz.correctAnswer}"
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function VideoPlayer() {
  const { channelId, courseId } = useParams();
  const [searchParams] = useSearchParams();
  const targetVideoId = searchParams.get("video");

  // Playlist & Video State
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);

  // Watch Later State
  const [savedVideoIds, setSavedVideoIds] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Video Progress State
  const [videoProgress, setVideoProgress] = useState({});
  const lastSavedRef = useRef(0);
  const seekAttemptedRef = useRef(new Set());

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizQueue, setQuizQueue] = useState([]);
  const [player, setPlayer] = useState(null);
  const [shownQuizzes, setShownQuizzes] = useState(new Set());

  /* ======================================================
     HELPER FUNCTIONS
  ====================================================== */
  const formatDuration = (iso) => {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const h = parseInt(match?.[1] || 0);
    const m = parseInt(match?.[2] || 0);
    const s = parseInt(match?.[3] || 0);
    const hh = h > 0 ? `${h}:` : "";
    const mm = m < 10 && h > 0 ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;
    return `${hh}${mm}:${ss}`;
  };

  const durationToSeconds = (d) => {
    if (!d) return 0;
    const parts = d.split(":").map(Number);
    if (parts.length === 3)
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  };

  /* ======================================================
     PROGRESS TRACKING
  ====================================================== */
  const saveProgress = async (seconds) => {
    if (!selectedVideoId) return;
    try {
      await axios.post(
        `${USER_API}/users/video-progress`,
        {
          videoId: selectedVideoId,
          courseId,
          channelId,
          watchedSeconds: seconds,
          durationSeconds: durations[selectedVideoId] || 0,
        },
        { withCredentials: true }
      );

      setVideoProgress((prev) => ({
        ...prev,
        [selectedVideoId]: seconds,
      }));
    } catch (err) {
      console.error("Progress save failed", err);
    }
  };

  const handleTimeUpdate = (currentTime) => {
    if (!selectedVideoId) return;

    setVideoProgress((prev) => ({
      ...prev,
      [selectedVideoId]: currentTime,
    }));

    if (currentTime - lastSavedRef.current >= 10) {
      lastSavedRef.current = currentTime;
      saveProgress(currentTime);
    }

    if (!quizQuestions || quizQuestions.length === 0) return;

    const dueQuizzes = quizQuestions.filter((q) => {
      if (q.videoId !== selectedVideoId) return false;
      const quizTime = Math.floor(q.timestamp);
      const timeDiff = Math.abs(quizTime - currentTime);
      return timeDiff <= 1 && !shownQuizzes.has(q._id);
    });

    if (dueQuizzes.length > 0) {
      setQuizQueue((prev) => [...prev, ...dueQuizzes]);
      setShownQuizzes((prev) => {
        const newSet = new Set(prev);
        dueQuizzes.forEach((q) => newSet.add(q._id));
        return newSet;
      });
    }
  };

  /* ======================================================
     PLAYER HANDLERS
  ====================================================== */
  const handlePlayerReady = (event) => {
    const playerInstance = event.target;
    setPlayer(playerInstance);
  };

  const handleStateChange = (event) => {
    const playerInstance = event.target;

    if (event.data === 1) {
      if (playerInstance.interval) {
        clearInterval(playerInstance.interval);
      }

      playerInstance.interval = setInterval(() => {
        try {
          const currentTime = Math.floor(playerInstance.getCurrentTime());
          handleTimeUpdate(currentTime);
        } catch (err) {
          console.error("Error getting current time:", err);
        }
      }, 1000);
    } else {
      if (playerInstance.interval) {
        clearInterval(playerInstance.interval);
        playerInstance.interval = null;
      }
    }
  };

  const handleVideoSelect = (video) => {
    const newVideoId = video.snippet.resourceId.videoId;
    
    if (player?.interval) {
      clearInterval(player.interval);
      player.interval = null;
    }

    lastSavedRef.current = 0;
    seekAttemptedRef.current.delete(newVideoId);

    setSelectedVideo(video);
    setSelectedVideoId(newVideoId);

    setShownQuizzes(new Set());
    setQuizQueue([]);
    setIsQuizActive(false);
    setCurrentQuiz(null);
  };

  /* ======================================================
     WATCH LATER
  ====================================================== */
  const handleWatchLater = async () => {
    if (!selectedVideo) return;

    const videoId = selectedVideo.snippet.resourceId.videoId;
    if (savedVideoIds.has(videoId)) return;

    try {
      setIsSaving(true);
      await axios.post(
        `${USER_API}/users/watch-later`,
        {
          videoId,
          title: selectedVideo.snippet.title,
          thumbnail: selectedVideo.snippet.thumbnails.medium.url,
          channelId,
          channelName: selectedVideo.snippet.channelTitle,
          courseId,
        },
        { withCredentials: true }
      );

      setSavedVideoIds((prev) => new Set(prev).add(videoId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save video");
    } finally {
      setIsSaving(false);
    }
  };

  /* ======================================================
     QUIZ HANDLERS
  ====================================================== */
  const handleQuizSubmit = (selectedAnswer) => {
    setTimeout(() => {
      if (player) {
        try {
          player.playVideo();
        } catch (err) {
          console.error("Error playing video:", err);
        }
      }
      setQuizQueue((prev) => prev.slice(1));
      setIsQuizActive(false);
      setCurrentQuiz(null);
    }, 2000);
  };

  const handleQuizClose = () => {
    if (player) {
      try {
        player.playVideo();
      } catch (err) {
        console.error("Error playing video:", err);
      }
    }
    setQuizQueue((prev) => prev.slice(1));
    setIsQuizActive(false);
    setCurrentQuiz(null);
  };

  /* ======================================================
     EFFECTS
  ====================================================== */

  // Fetch saved videos (watch later)
  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const res = await axios.get(`${USER_API}/users/watch-later`, {
          withCredentials: true,
        });
        const ids = new Set(res.data.data.map((v) => v.videoId));
        setSavedVideoIds(ids);
      } catch (err) {
        console.error("Failed to fetch saved videos", err);
      }
    };
    fetchSavedVideos();
  }, []);

  // Fetch video progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `${USER_API}/users/video-progress/${courseId}/${channelId}`,
          { withCredentials: true }
        );

        const map = {};
        res.data.data.forEach((v) => {
          map[v.videoId] = v.watchedSeconds;
        });

        setVideoProgress(map);
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();
  }, [courseId, channelId]);

  // Fetch channel info
  useEffect(() => {
  const fetchChannelFromBackend = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/channels/course/${courseId}`
      );

      const channel = res.data.find(
        (c) => c._id === channelId
      );

      if (!channel) return;

      setChannelInfo({
        name: channel.name,
        imageUrl: channel.imageUrl,
      });
    } catch (err) {
      console.error("Failed to fetch channel", err);
    }
  };

  fetchChannelFromBackend();
}, [courseId, channelId]);


  // Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/playlists/${channelId}/${courseId}`
        );
        const data = response.data.data;
        if (data.length > 0) {
          setSelectedPlaylist(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    if (channelId && courseId) {
      fetchPlaylists();
    }
  }, [channelId, courseId]);

  // Fetch videos + durations + quizzes
  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedPlaylist) return;
      const contentLink = selectedPlaylist.link;
      const contentType = selectedPlaylist.type;

      let videoItems = [];
      try {
        if (contentType === "playlist") {
          const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${contentLink}&key=${YOUTUBE_API_KEY}&maxResults=50`;
          const playlistRes = await axios.get(playlistUrl, {
            withCredentials: false,
          });
          videoItems = playlistRes.data.items || [];
        } else if (contentType === "video") {
          const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${contentLink}&key=${YOUTUBE_API_KEY}`;
          const videoRes = await axios.get(videoUrl, {
            withCredentials: false,
          });
          const videoItem = videoRes.data.items?.[0];
          if (videoItem) {
            videoItems = [
              {
                id: videoItem.id,
                snippet: {
                  ...videoItem.snippet,
                  resourceId: { videoId: videoItem.id },
                },
                contentDetails: videoItem.contentDetails,
              },
            ];
          }
        }

        setVideos(videoItems);

        if (targetVideoId && videoItems.length > 0) {
          const targetVideo = videoItems.find(
            (v) => v.snippet.resourceId.videoId === targetVideoId
          );

          if (targetVideo) {
            setSelectedVideo(targetVideo);
            setSelectedVideoId(targetVideo.snippet.resourceId.videoId);
          } else {
            setSelectedVideo(videoItems[0]);
            setSelectedVideoId(videoItems[0].snippet.resourceId.videoId);
          }
        } else if (videoItems.length > 0) {
          setSelectedVideo(videoItems[0]);
          setSelectedVideoId(videoItems[0].snippet.resourceId.videoId);
        }

        const videoIds = videoItems
          .map((v) => v.snippet.resourceId.videoId)
          .join(",");
        if (videoIds) {
          const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
          const videosRes = await axios.get(videosUrl, {
            withCredentials: false,
          });
          const videoDetails = videosRes.data.items || [];
          const newDurations = {};
          videoDetails.forEach((video) => {
            newDurations[video.id] = durationToSeconds(
              formatDuration(video.contentDetails.duration)
            );
          });
          setDurations(newDurations);
        }

        try {
          const quizResponse = await axios.get(
            `${BASE_URL}/quizzes/by-playlist-document/${selectedPlaylist._id}`
          );

          if (quizResponse.data.success) {
            const quizData = quizResponse.data.data;
            const videoQuizzes = quizData?.videos || [];

            const allQuestions = videoQuizzes.reduce((acc, videoQuiz) => {
              if (videoQuiz.questions) {
                return acc.concat(
                  videoQuiz.questions.map((q) => ({
                    ...q,
                    videoId: videoQuiz.videoId,
                  }))
                );
              }
              return acc;
            }, []);

            setQuizQuestions(allQuestions);
          } else {
            setQuizQuestions([]);
          }
        } catch (quizError) {
          console.error("Error fetching quizzes:", quizError);
          setQuizQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    fetchContent();
  }, [selectedPlaylist, targetVideoId]);

  useEffect(() => {
    if (!player || !selectedVideoId) return;

    const savedTime = videoProgress[selectedVideoId];
    if (!savedTime || savedTime < 5) return;

    if (seekAttemptedRef.current.has(selectedVideoId)) return;

    const trySeek = () => {
      try {
        player.seekTo(savedTime, true);
        seekAttemptedRef.current.add(selectedVideoId);
      } catch {
        setTimeout(trySeek, 300);
      }
    };

    trySeek();
  }, [player, selectedVideoId, videoProgress]);

  // Cleanup intervals
  useEffect(() => {
    return () => {
      if (player?.interval) {
        clearInterval(player.interval);
      }
    };
  }, [player]);

  // Trigger quiz modal
  useEffect(() => {
    if (!isQuizActive && quizQueue.length > 0) {
      const nextQuiz = quizQueue[0];
      setCurrentQuiz(nextQuiz);
      setIsQuizActive(true);
      if (player) {
        try {
          player.pauseVideo();
        } catch (err) {
          console.error("Error pausing video:", err);
        }
      }
    }
  }, [quizQueue, isQuizActive, player]);

  useEffect(() => {
    if (!videos.length || !Object.keys(durations).length) return;

    const totalPlaylistSeconds = videos.reduce((sum, v) => {
      const id = v.snippet.resourceId.videoId;
      return sum + (durations[id] || 0);
    }, 0);

    axios.post(
      `${USER_API}/users/update-course-total`,
      {
        courseId,
        channelId,
        totalSeconds: totalPlaylistSeconds,
      },
      { withCredentials: true }
    );
  }, [videos, durations, courseId, channelId]);

  /* ======================================================
     GUARD CLAUSES
  ====================================================== */
  if (!channelId || !courseId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-600">
          Invalid video link. Please open the video again.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">
          Loading playlists...
        </p>
      </div>
    );
  }

  if (!selectedPlaylist) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">
          No playlists found for this course.
        </p>
      </div>
    );
  }

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans relative">
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
          <div>Quizzes: {quizQuestions.length}</div>
          <div>Quiz active: {isQuizActive ? "Yes" : "No"}</div>
          <div>Queue: {quizQueue.length}</div>
          <div>Progress: {videoProgress[selectedVideoId] || 0}s</div>
          <div>
            Seeked: {seekAttemptedRef.current.has(selectedVideoId) ? "Yes" : "No"}
          </div>
        </div>
      )}

      {isQuizActive && currentQuiz && (
        <QuizModal
          quiz={currentQuiz}
          onAnswer={handleQuizSubmit}
          onClose={handleQuizClose}
        />
      )}

      <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
        <PlayListPlayer
          video={selectedVideo}
          onPlayerReady={handlePlayerReady}
          onStateChange={handleStateChange}
          onWatchLater={handleWatchLater}
          isSaved={savedVideoIds.has(
            selectedVideo?.snippet?.resourceId?.videoId
          )}
          isSaving={isSaving}
        />

        <PlayListSidebar
          videos={videos}
          durations={durations}
          onVideoSelect={handleVideoSelect}
          selectedVideoId={selectedVideoId}
          channelData={
            channelInfo || {
              name: "Loading...",
              imageUrl: "/fallback.jpg",
            }
          }
          videoProgress={videoProgress}
        />
      </div>
    </div>
  );
}