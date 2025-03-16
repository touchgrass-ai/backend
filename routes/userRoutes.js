const express = require("express");
const User = require("../models/User");
const Reward = require("../models/Reward");
const Task = require("../models/Task");
const swaggerJSDoc = require("swagger-jsdoc");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for managing User
 */

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
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               googleId:
 *                 type: string
 *                 description: Google authentication ID of the user
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *               gender:
 *                 type: string
 *                 description: Gender of the user
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of user preferences (tags)
 *             example:
 *               googleId: "123456789"
 *               name: "John Doe"
 *               email: "john@example.com"
 *               gender: "male"
 *               preferences: ["gaming", "reading"]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error creating user
 */
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
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("rewardsEarned").populate("tasks");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Error fetching user" });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               name: "Updated Name"
 *               email: "updated@example.com"
 *               gender: "male"
 *               preferences: ["coding", "music"]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Error updating user" });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) return res.status(404).json({ error: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting user" });
    }
});

/**
 * @swagger
 * /users/{userId}/reward/{rewardId}:
 *   post:
 *     summary: Assign a reward to a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: path
 *         name: rewardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reward to assign
 *     responses:
 *       200:
 *         description: Reward assigned successfully
 *       400:
 *         description: Reward already assigned
 *       404:
 *         description: User or Reward not found
 *       500:
 *         description: Error assigning reward
 */
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

/**
 * @swagger
 * /users/{userId}/reward/{rewardId}:
 *   delete:
 *     summary: Remove a reward from a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: path
 *         name: rewardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reward to remove
 *     responses:
 *       200:
 *         description: Reward removed successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error removing reward
 */
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

/**
 * @swagger
 * /users/{userId}/task/{taskId}:
 *   post:
 *     summary: Assign a task to a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to assign
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       400:
 *         description: Task already assigned
 *       404:
 *         description: User or Task not found
 *       500:
 *         description: Error assigning task
 */
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

/**
 * @swagger
 * /users/{userId}/task/{taskId}:
 *   put:
 *     summary: Update the completion status of a task for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task assigned to the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 description: Indicates whether the task is completed
 *             example:
 *               completed: true
 *     responses:
 *       200:
 *         description: Task completion status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task updated successfully"
 *                 user:
 *                   type: object
 *                   description: Updated user data
 *       404:
 *         description: User or Task not found
 *       500:
 *         description: Error updating task status
 */
router.put("/:userId/task/:taskId", async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        const { completed } = req.body; // Get completion status from request

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const taskIndex = user.tasks.findIndex(t => t.task.toString() === taskId);
        if (taskIndex === -1) return res.status(404).json({ error: "Task not found for user" });

        user.tasks[taskIndex].completed = completed; // Update completed status
        await user.save();

        res.json({ message: "Task updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: "Error updating task status" });
    }
});

/**
 * @swagger
 * /users/{userId}/task/{taskId}:
 *   delete:
 *     summary: Remove a task from a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to remove
 *     responses:
 *       200:
 *         description: Task removed successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error removing task
 */
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