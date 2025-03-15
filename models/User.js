const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    exp: { type: Number, default: 0 },
    rewardsEarned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
    preferences: [{ type: String , enum: preferenceEnum}], // Array of tag strings
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
});

module.exports = mongoose.model("User", UserSchema);