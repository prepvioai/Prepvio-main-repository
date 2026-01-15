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
    courseThumbnail: String,

    channelId: { type: String, required: true },
    channelName: { type: String, required: true },
    channelThumbnail: String,

    totalSeconds: { type: Number, required: true },
    watchedSeconds: { type: Number, default: 0 },

    startedAt: { type: Date, default: Date.now },
    lastAccessed: { type: Date, default: Date.now },

    videos: [videoProgressSchema],
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Context
    courseId: { type: String },
    channelId: { type: String },

    // Type
    type: {
      type: String,
      enum: ["course", "general"],
      required: true,
    },

    category: {
      type: String,
      enum: ["content", "bug", "ui", "general"],
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/* ======================================================
   APTITUDE TEST ATTEMPTS
====================================================== */
const aptitudeAttemptSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    correctAnswers: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    timeTakenSeconds: {
      type: Number,
      required: true,
    },

    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },

        // 🔽 SNAPSHOT (THIS IS THE KEY)
        question: {
          type: String,
          required: true,
        },

        options: [
          {
            text: {
              type: String,
              required: true,
            },
          },
        ],

        explanation: {
          type: String,
        },

        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },

        selectedIndex: {
          type: Number,
          required: true,
        },

        correctIndex: {
          type: Number,
          required: true,
        },

        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);



/* ======================================================
   USER SCHEMA (SOURCE OF TRUTH)
====================================================== */
const userSchema = new mongoose.Schema(
  {
    /* ================= AUTH ================= */
    name: {
  type: String,
  trim: true,
},

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},

googleId: {
  type: String,
},

    verificationToken: {
      type: String,
    },

    verificationTokenExpiresAt: {
      type: Date,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpiresAt: {
      type: Date,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },

    /* ================= WATCH LATER ================= */
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

    /* ================= LEARNING PROGRESS ================= */
    courseProgress: [courseProgressSchema],

    feedbacks: [feedbackSchema],
    /* ================= APTITUDE ================= */
aptitudeAttempts: [aptitudeAttemptSchema],


    /* ================= PROFILE ================= */
    phone: String,

    bio: {
      type: String,
      maxLength: 300,
    },

    location: {
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent OverwriteModelError in dev / hot reload
export const User =
  mongoose.models.User || mongoose.model("User", userSchema);