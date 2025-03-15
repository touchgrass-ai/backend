const express = require("express");
const User = require("../models/User");
const Reward = require("../models/Reward");
const Task = require("../models/Task");
const swaggerJSDoc = require("swagger-jsdoc");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - googleId
 *         - name
 *         - email
 *         - gender
 *         - preferences
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         googleId:
 *           type: string
 *           description: Google authentication ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           description: User's email
 *         gender:
 *           type: string
 *           description: User's gender
 *         preferences:
 *           type: array
 *           items:
 *             type: string
 *           description: User preferences (tags)
 *         rewardsEarned:
 *           type: array
 *           items:
 *             type: string
 *           description: List of reward IDs earned by the user
 *         tasks:
 *           type: array
 *           items:
 *             type: string
 *           description: List of task IDs assigned to the user
 *       example:
 *         googleId: "123456789"
 *         name: "John Doe"
 *         email: "john@example.com"
 *         gender: "male"
 *         preferences: ["gaming", "reading"]
 *         rewardsEarned: ["60b8c82d...", "60b8c92e..."]
 *         tasks: ["60b8d32a...", "60b8d43f..."]
 */

// Create a new user
router.post("/", async (req, res) => {
    try {
        const { googleId, name, email, gender, preferences } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ googleId });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({ googleId, name, email, gender, preferences });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: "Error creating user" });
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of all users
 */
// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().populate("rewardsEarned").populate("tasks");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data
 */
// Get a user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("rewardsEarned").populate("tasks");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user" });
    }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Error updating user" });
    }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting user" });
    }
});

// Assign a reward to a user
router.post("/:userId/reward/:rewardId", async (req, res) => {
    try {
        const { userId, rewardId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const reward = await Reward.findById(rewardId);
        if (!reward) return res.status(404).json({ error: "Reward not found" });

        if (user.rewardsEarned.includes(rewardId)) {
            return res.status(400).json({ error: "Reward already assigned" });
        }

        user.rewardsEarned.push(rewardId);
        await user.save();

        res.json({ message: "Reward assigned successfully", user });
    } catch (err) {
        res.status(500).json({ error: "Error assigning reward" });
    }
});

// Remove a reward from a user
router.delete("/:userId/reward/:rewardId", async (req, res) => {
    try {
        const { userId, rewardId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.rewardsEarned = user.rewardsEarned.filter((id) => id.toString() !== rewardId);
        await user.save();

        res.json({ message: "Reward removed successfully", user });
    } catch (err) {
        res.status(500).json({ error: "Error removing reward" });
    }
});

// Assign a task to a user
router.post("/:userId/task/:taskId", async (req, res) => {
    try {
        const { userId, taskId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ error: "Task not found" });

        if (user.tasks.includes(taskId)) {
            return res.status(400).json({ error: "Task already assigned" });
        }

        user.tasks.push(taskId);
        await user.save();

        res.json({ message: "Task assigned successfully", user });
    } catch (err) {
        res.status(500).json({ error: "Error assigning task" });
    }
});

// Remove a task from a user
router.delete("/:userId/task/:taskId", async (req, res) => {
    try {
        const { userId, taskId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.tasks = user.tasks.filter((id) => id.toString() !== taskId);
        await user.save();

        res.json({ message: "Task removed successfully", user });
    } catch (err) {
        res.status(500).json({ error: "Error removing task" });
    }
});

module.exports = router;