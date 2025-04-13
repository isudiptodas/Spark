import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    role: {type: String},
    message: {type: String}
}, {_id: false});

const filesSchema = new mongoose.Schema({
    name: {type: String},
    chat: {type: [chatSchema], default: []},
    history: {type: [chatSchema], default: []},
    initialPrompt: {type: String},
    files: {type: String},
    userId: { type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

export const Files = mongoose.models.File || mongoose.model("File", filesSchema);