import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// ✅ Create project
router.post("/", async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Get all projects
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get projects by course ID
router.get("/by-course/:courseId", async (req, res) => {
    try {
        const projects = await Project.find({ courseId: req.params.courseId }).sort({ order: 1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get single project
router.get("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Update project
router.put("/:id", async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete project
router.delete("/:id", async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json({ message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;