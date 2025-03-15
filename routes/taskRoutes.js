const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - type
 *         - rewardType
 *         - taskCompleted
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *           description: Type of the task
 *         detail:
 *           type: string
 *           description: Task details
 *         rewardType:
 *           type: string
 *           description: Reward type
 *         completionCriteria:
 *           type: string
 *           description: Criteria for task completion
 *         taskCompleted:
 *           type: boolean
 *           description: Whether the task is completed or not
 *       example:
 *         type: "challenge"
 *         detail: "Complete 10 daily challenges"
 *         rewardType: "gold"
 *         completionCriteria: "10 tasks completed"
 *         taskCompleted: false
 */

// Create a new task
router.post("/", async (req, res) => {
    try {
        const { type, detail, rewardType, completionCriteria, taskCompleted } = req.body;

        const newTask = new Task({ type, detail, rewardType, completionCriteria, taskCompleted });
        await newTask.save();

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Error creating task" });
    }
});

// Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// Get a task by ID
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Error fetching task" });
    }
});

// Update a task by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedTask) return res.status(404).json({ error: "Task not found" });

        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Error updating task" });
    }
});

// Delete a task by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) return res.status(404).json({ error: "Task not found" });

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting task" });
    }
});

module.exports = router;