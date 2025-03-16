const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv")
const router = express.Router();
require("./config/passport"); // Import Passport strategy

// Load environment variables
dotenv.config();

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
    passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/error` }),
    async (req, res) => {
        try {
            const userEmail = req.user.email;

            // Check if the user exists in the database
            const existingUser = await User.findOne({ email: userEmail });

            if (!existingUser) {
                // Redirect to registration page if the user does not exist
                return res.redirect(`${process.env.FRONTEND_URL}/register`); // Change to your actual frontend registration route
            }

            // Redirect to profile page if the user exists
            res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
        } catch (error) {
            console.error("Error checking user existence:", error);
            res.redirect(`${process.env.FRONTEND_URL}/error`); // Redirect to an error page if something goes wrong
        }
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
