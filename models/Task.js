const mongoose = require("mongoose");
const { typeEnum } = require("../enum/typeEnum");

const TaskSchema = new mongoose.Schema({
    type: { type: String, enum: typeEnum, required: true },
    detail: { type: String },
    exp: { type: Number },
    completionCriteria: { type: String },
    taskCompleted: { type: Boolean, required: true }
});

module.exports = mongoose.model("Task", TaskSchema);