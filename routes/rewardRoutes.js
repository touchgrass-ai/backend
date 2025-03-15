const express = require("express");
const Reward = require("../models/Reward");

const router = express.Router();

// Create a new reward
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

// Get all rewards
router.get("/", async (req, res) => {
    try {
        const rewards = await Reward.find();
        res.json(rewards);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch rewards" });
    }
});

// Get a reward by ID
router.get("/:code", async (req, res) => {
    try {
        const reward = await Reward.findOne({ code: req.params.code });
        if (!reward) return res.status(404).json({ error: "Reward not found" });

        res.json(reward);
    } catch (err) {
        res.status(500).json({ error: "Error fetching reward" });
    }
});

// Update a reward by ID
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

// Delete a reward by ID
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
