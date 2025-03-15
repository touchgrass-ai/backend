const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // Unique reward identifier
});

module.exports = mongoose.model("Reward", RewardSchema);