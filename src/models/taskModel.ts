import mongoose, { model, models, Schema } from "mongoose";

const explanationSchema = new mongoose.Schema({
    role: {type: String},
    message: {type: String}
})

const taskSchema = new mongoose.Schema({
    task: {type: String},
    category: {type: String, default: "task"},
    taskExplanation:  {type: [explanationSchema]}, 
    actual: {type: String}, 
    initialPrompt: {type: String}, 
    userId: { type: Schema.Types.ObjectId, ref: 'User'},
    taskHistory: {type: [explanationSchema]}
}, {timestamps: true});

export const Task = models.Task || mongoose.model('Task', taskSchema);
