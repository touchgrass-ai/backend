const express = require("express");
const passport = require("passport");

const router = express.Router();

// Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/profile"); // Redirect to frontend/profile page
    }
);

// Logout
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.redirect("/");
    });
});

// Get current user
router.get("/me", (req, res) => {
    res.json(req.user || null);
});

module.exports = router;
