const mongoose = require("mongoose");
const { preferenceEnum } = require("../enum/preferenceEnum");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    exp: { type: Number, default: 0 },
    rewardsEarned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
    preferences: [{ type: String , enum: preferenceEnum}], // Array of tag strings
    tasks: [{
        task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
        completed: false
    }]
});

module.exports = mongoose.model("User", UserSchema);