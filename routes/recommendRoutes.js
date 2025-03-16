const express = require("express");
const axios = require("axios");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const User = require("../models/User");
const Task = require("../models/Task");
const { getRandomNumber } = require("../util/randon_num");


dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Fetch weather data
const getWeather = async (location) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: location,
                appid: process.env.WEATHER_API_KEY,
                units: "metric"
            }
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching weather:", err.message);
        return null;
    }
};

// Fetch traffic data
const getTrafficConditions = async (location) => {
    try {
        const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
            params: {
                origin: location,
                destination: location,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching traffic data:", err.message);
        return null;
    }
};

// Extract location from task detail using ChatGPT
const extractLocation = async (taskDetail) => {
    try {
        const prompt = `Given the task: "${taskDetail}", identify the most likely location (if any) in Melbourne, Australia. If no location is specified, respond with "Unknown".`;
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: prompt }]
        });

        const location = response.choices[0]?.message?.content?.trim();
        return location !== "Unknown" ? location : null;
    } catch (err) {
        console.error("Error extracting location:", err.message);
        return null;
    }
};

/**
 * @swagger
 * /recommend/{userId}:
 *   get:
 *     summary: Get recommended tasks based on user preferences, weather, and traffic
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of recommended tasks with location, weather, and traffic info
 *       404:
 *         description: No tasks found matching preferences
 *       500:
 *         description: Server error
 */
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user || !user.preferences || user.preferences.length === 0) {
            return res.status(404).json({ error: "User preferences not found" });
        }

        // Fetch tasks matching user preferences
        const matchingTasks = await Task.find({ category: { $in: user.preferences } });

        if (matchingTasks.length === 0) {
            return res.status(404).json({ error: "No tasks found matching preferences" });
        }

        let finalTasks = [];
        for (const task of matchingTasks) {
            const location = await extractLocation(task.detail);

            if (location) {
                const weather = await getWeather(location);
                const traffic = await getTrafficConditions(location);

                if (weather && traffic) {
                    // Check if the weather and traffic conditions are good
                    const isWeatherGood = weather.weather[0].main !== "Rain";
                    const isTrafficGood = traffic.routes.length > 0 && traffic.routes[0].legs[0].duration.value < 1800;

                    if (isWeatherGood && isTrafficGood) {
                        finalTasks.push({
                            _id: task._id,
                            type: task.type,
                            detail: task.detail,
                            exp: getRandomNumber(),
                            completionCriteria: task.completionCriteria,
                            taskCompleted: false,
                        });

                        if (finalTasks.length >= 5) break;
                    }
                }
            }
        }

        if (finalTasks.length === 0) {
            return res.status(404).json({ error: "No suitable tasks found based on weather and traffic" });
        }

        res.json(finalTasks);
    } catch (err) {
        console.error("Error fetching recommended tasks:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
