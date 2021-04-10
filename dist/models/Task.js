"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
    text: { type: String },
    completed: { type: Boolean, default: false, required: true },
    room: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room' },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
});
exports.default = mongoose_1.model('Task', TaskSchema);
//# sourceMappingURL=Task.js.map