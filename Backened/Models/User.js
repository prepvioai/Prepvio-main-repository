import mongoose from "mongoose";

/* ======================================================
   VIDEO PROGRESS (NESTED UNDER COURSE)
====================================================== */
const videoProgressSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true },

    watchedSeconds: { type: Number, default: 0 },
    durationSeconds: { type: Number, default: 0 },

    completed: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/* ======================================================
   COURSE PROGRESS (COURSE + CHANNEL LEVEL)
====================================================== */
const courseProgressSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    courseThumbnail: String,        // ✅ ADD

    channelId: { type: String, required: true },
    channelName: { type: String, required: true },
    channelThumbnail: String,       // ✅ ADD

    totalSeconds: { type: Number, required: true },
    watchedSeconds: { type: Number, default: 0 },

    startedAt: { type: Date, default: Date.now },
    lastAccessed: { type: Date, default: Date.now },

    videos: [videoProgressSchema],
  },
  { _id: false }
);


/* ======================================================
   USER SCHEMA
====================================================== */
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },

    /* ======================================================
       WATCH LATER (UNCHANGED)
    ====================================================== */
    savedVideos: [
      {
        videoId: { type: String, required: true },
        title: String,
        thumbnail: String,
        channelName: String,
        channelId: String,
        courseId: String,
        savedAt: { type: Date, default: Date.now },
      },
    ],

    /* ======================================================
       LEARNING PROGRESS (SOURCE OF TRUTH)
    ====================================================== */
    courseProgress: [courseProgressSchema],

    /* ======================================================
       PROFILE
    ====================================================== */
    phone: String,
    bio: { type: String, maxLength: 300 },
    location: {
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    avatarUrl: String,

    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ PREVENT OverwriteModelError
export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
