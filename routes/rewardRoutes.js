const express = require("express");
const Reward = require("../models/Reward");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rewards
 *   description: API endpoints for managing rewards
 */

/**
 * @swagger
 * /rewards:
 *   post:
 *     summary: Create a new reward
 *     tags: [Rewards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               redeemed:
 *                 type: boolean
 *             example:
 *               code: "PLATINUM200"
 *               name: "Platinum Medal"
 *               description: "Awarded for 5000 EXP"
 *               redeemed: false
 *     responses:
 *       201:
 *         description: Reward created successfully
 *       400:
 *         description: Reward with the same code already exists
 *       500:
 *         description: Error creating reward
 */

/**
 * @swagger
 * /rewards:
 *   post:
 *     summary: Create a new reward
 *     tags: [Rewards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique identifier for the reward
 *               name:
 *                 type: string
 *                 description: Name of the reward
 *               description:
 *                 type: string
 *                 description: Detailed description of the reward
 *               redeemed:
 *                 type: boolean
 *                 description: Whether the reward has been redeemed
 *             example:
 *               code: "GOLD100"
 *               name: "Gold Badge"
 *               description: "Awarded for 1000 EXP"
 *               redeemed: false
 *     responses:
 *       201:
 *         description: Reward created successfully
 *       400:
 *         description: Reward with this code already exists
 *       500:
 *         description: Error creating reward
 */
router.post("/", async (req, res) => {
    try {
        const { code, name, description, redeemed } = req.body;

        // Check if reward with the same code already exists
        const existingReward = await Reward.findOne({ code });
        if (existingReward) {
            return res.status(400).json({ error: "Reward with this code already exists" });
        }

        const newReward = new Reward({ code, name, description, redeemed });
        await newReward.save();

        res.status(201).json(newReward);
    } catch (err) {
        res.status(500).json({ error: "Error creating reward" });
    }
});

/**
 * @swagger
 * /rewards:
 *   get:
 *     summary: Get all rewards
 *     tags: [Rewards]
 *     responses:
 *       200:
 *         description: List of all rewards
 */
router.get("/", async (req, res) => {
    try {
        const rewards = await Reward.find();
        res.json(rewards);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch rewards" });
    }
});

/**
 * @swagger
 * /rewards/{code}:
 *   get:
 *     summary: Get a reward by code
 *     tags: [Rewards]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the reward to fetch
 *     responses:
 *       200:
 *         description: Reward details
 *       404:
 *         description: Reward not found
 *       500:
 *         description: Error fetching reward
 */
router.get("/:code", async (req, res) => {
    try {
        const reward = await Reward.findOne({ code: req.params.code });
        if (!reward) return res.status(404).json({ error: "Reward not found" });

        res.json(reward);
    } catch (err) {
        res.status(500).json({ error: "Error fetching reward" });
    }
});

/**
 * @swagger
 * /rewards/{code}:
 *   put:
 *     summary: Update a reward by code
 *     tags: [Rewards]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the reward to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               redeemed:
 *                 type: boolean
 *             example:
 *               name: "Updated Gold Badge"
 *               description: "Updated description"
 *               redeemed: true
 *     responses:
 *       200:
 *         description: Reward updated successfully
 *       404:
 *         description: Reward not found
 *       500:
 *         description: Error updating reward
 */
router.put("/:code", async (req, res) => {
    try {
        const updatedReward = await Reward.findOneAndUpdate(
            { code: req.params.code },
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedReward) return res.status(404).json({ error: "Reward not found" });

        res.json(updatedReward);
    } catch (err) {
        res.status(500).json({ error: "Error updating reward" });
    }
});

/**
 * @swagger
 * /rewards/{code}:
 *   delete:
 *     summary: Delete a reward by code
 *     tags: [Rewards]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The code of the reward to delete
 *     responses:
 *       200:
 *         description: Reward deleted successfully
 *       404:
 *         description: Reward not found
 *       500:
 *         description: Error deleting reward
 */
router.delete("/:code", async (req, res) => {
    try {
        const deletedReward = await Reward.findOneAndDelete({ code: req.params.code });

        if (!deletedReward) return res.status(404).json({ error: "Reward not found" });

        res.json({ message: "Reward deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting reward" });
    }
});

module.exports = router;
