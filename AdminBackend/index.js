import "./env.js";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
// import dotenv from 'dotenv';
import servicesRouter from './Server/routes/services.route.js';
import coursesRouter from './Server/routes/courses.route.js';
import channelsRouter from './Server/routes/channels.route.js';
import playlistsRouter from './Server/routes/playlists.route.js';
import quizzesRouter from './Server/routes/quizzes.route.js';
import videosRouter from './Server/routes/videos.route.js'; // ✅ Import videos route
import categoryRoutes from "./Server/routes/categories.route.js";
import dashboardRouter from "./Server/routes/dashboard.route.js";
import AptitudeRouter from './Server/routes/aptitude.route.js'
import projectsRouter from './Server/routes/projects.route.js'; // ✅ Import projects route
import submissionsRouter from './Server/routes/submissions.route.js'; // ✅ Import submissions route



const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Database Connection
console.log('AdminBackend connecting to:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/services', servicesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/channels', channelsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/videos', videosRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/aptitude", AptitudeRouter);
app.use('/api/projects', projectsRouter); // ✅ Register projects route
app.use('/api/project-submissions', submissionsRouter); // ✅ Register submissions route

app.get("/", (req, res) => {
  res.json({ status: "Prepvio Admin Backend Running Successfully" });
});

export default app;