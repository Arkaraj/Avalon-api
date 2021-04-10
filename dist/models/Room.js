"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nanoid_1 = require("nanoid");
const RoomSchema = new mongoose_1.Schema({
    admin: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    description: { type: String, required: true, default: "A awesome room 🚀" },
    code: { type: String, default: () => nanoid_1.nanoid(6) },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
});
exports.default = mongoose_1.model('Room', RoomSchema);
//# sourceMappingURL=Room.js.map