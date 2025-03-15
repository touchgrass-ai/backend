const mongoose = require("mongoose");
const { rewardTypeEnum } = require("../enum/rewardTypeEnum");
const { typeEnum } = require("../enum/typeEnum");

const TaskSchema = new mongoose.Schema({
    type: {type: String, enum: typeEnum, required: true},
    detail: { type: String },
    rewardType: { type: String, enum: rewardTypeEnum, required: true},
    completionCriteria: { type: String },
    taskCompleted: { type: Boolean, required: true}
});

module.exports = mongoose.model("Task", TaskSchema);