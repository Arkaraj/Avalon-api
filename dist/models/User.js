"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    githubId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tasks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Task' }]
});
exports.default = mongoose_1.model('User', UserSchema);
//# sourceMappingURL=User.js.map