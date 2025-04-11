import mongoose, { model, models, Schema } from "mongoose";

const explanationSchema = new mongoose.Schema({
    role: {type: String},
    message: {type: String}
})

const taskSchema = new mongoose.Schema({
    task: {type: String},
    taskExplanation: {type: [explanationSchema]},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    taskResponse: {type: String}
}, {timestamps: true});

export const Task = models.Task || mongoose.model('Task', taskSchema);