const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API endpoints for managing tasks
 */

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

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of the task
 *               detail:
 *                 type: string
 *                 description: The details of the task
 *               rewardType:
 *                 type: string
 *                 description: The type of reward associated with this task
 *               completionCriteria:
 *                 type: string
 *                 description: The criteria required to complete the task
 *               taskCompleted:
 *                 type: boolean
 *                 description: Whether the task has been completed or not
 *             example:
 *               type: "challenge"
 *               detail: "Win 5 ranked games"
 *               rewardType: "gold"
 *               completionCriteria: "Win 5 games in ranked mode"
 *               taskCompleted: false
 *     responses:
 *       201:
 *         description: Task created successfully
 *       500:
 *         description: Error creating task
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

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of all tasks
 */
// Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to fetch
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *       500:
 *         description: Error fetching task
 */
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

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               detail:
 *                 type: string
 *               rewardType:
 *                 type: string
 *               completionCriteria:
 *                 type: string
 *               taskCompleted:
 *                 type: boolean
 *             example:
 *               type: "quest"
 *               detail: "Win 5 games"
 *               rewardType: "silver"
 *               completionCriteria: "Win 5 ranked games"
 *               taskCompleted: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Error updating task
 */
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

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Error deleting task
 */
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