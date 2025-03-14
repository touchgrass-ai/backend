const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

module.exports = router;
