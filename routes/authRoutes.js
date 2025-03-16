const express = require("express");
const passport = require("passport");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: OAuth authentication routes
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Authentication]
 *     description: Redirects the user to Google OAuth for authentication
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     description: Handles OAuth callback after Google authentication
 *     responses:
 *       302:
 *         description: Redirects to profile page
 */
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/profile"); // Redirect to frontend/profile page
    }
);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Logs out the current user and clears the session
 *     responses:
 *       200:
 *         description: User logged out
 */
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.redirect("/");
    });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     description: Returns details of the logged-in user
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/me", (req, res) => {
    res.json(req.user || null);
});

module.exports = router;
