"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const Task_1 = __importDefault(require("../models/Task"));
const Room_1 = __importDefault(require("../models/Room"));
const isAdmin_1 = require("../isAdmin");
const admin = express_1.Router();
admin.get("/crooms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield Room_1.default.find({ admin: req.userId });
    res.send({ rooms });
}));
admin.get("/:roomId", isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Room_1.default.findById(req.params.roomId)
        .populate("members")
        .populate("admin")
        .exec((err, document) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.send({ msg: "Internal Error", msgError: true });
        }
        else {
            const members = document === null || document === void 0 ? void 0 : document.members;
            const admins = document === null || document === void 0 ? void 0 : document.admin;
            res.send({ members, admins, msgError: false });
        }
    }));
}));
admin.post("/task/:roomId/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    const setTask = {
        text,
        completed: false,
        room: req.params.roomId,
        user: req.params.userId,
    };
    const task = yield (yield Task_1.default.create(setTask)).save();
    const user = yield User_1.default.findById(req.params.userId);
    user === null || user === void 0 ? void 0 : user.tasks.push(task._id);
    user === null || user === void 0 ? void 0 : user.save();
    res.send({ task });
}));
admin.get("/:roomId/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield Task_1.default.find({
        room: req.params.roomId,
        user: req.params.userId,
    }).sort({
        _id: "desc",
    });
    res.send({ tasks });
}));
admin.delete("/task/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Task_1.default.findByIdAndDelete(req.params.taskId);
    const user = yield User_1.default.findOne({ tasks: req.params.taskId });
    if (user) {
        user.tasks = user.tasks.filter((u) => u != req.params.taskId);
        yield user.save();
        res.send({ msg: "successfully deleted the task", done: true });
    }
    else {
        res.send({ msg: "Internal Server Error", done: false });
    }
}));
admin.delete("/:roomId", isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room_1.default.findByIdAndDelete(req.params.roomId);
    res.send({ room, msgError: false });
}));
admin.post("/addAdmins/:roomId", isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { githubId } = req.body;
    try {
        const user = yield User_1.default.findOne({ githubId });
        if (user) {
            const room = yield Room_1.default.findById(req.params.roomId);
            if (room === null || room === void 0 ? void 0 : room.admin.includes(user === null || user === void 0 ? void 0 : user._id)) {
                res.send({
                    msg: "User is already the Admin of the room",
                    msgError: true,
                });
            }
            else {
                room === null || room === void 0 ? void 0 : room.admin.push(user === null || user === void 0 ? void 0 : user._id);
                room === null || room === void 0 ? void 0 : room.save((err) => {
                    if (err) {
                        res.send({ msg: "Internal Error", msgError: true });
                    }
                    else {
                        res.send({ user, room, msgError: false });
                    }
                });
            }
        }
        else {
            res.send({ msg: "Enter valid User GitHub Id", msgError: true });
        }
    }
    catch (err) {
        res.send({ msg: "Enter valid User GitHub Id", msgError: true });
    }
}));
admin.delete("/leaveAdmin/:roomId", isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield Room_1.default.findById(req.params.roomId);
        if (room === null || room === void 0 ? void 0 : room.admin) {
            room.admin = room.admin.filter((id) => id != req.userId);
            if (room.admin.length == 0) {
                res.send({
                    msg: `You are the only Admin of the Room: ${room.name}, You can't leave it!`,
                    msgError: true,
                });
            }
            else {
                room.save((err) => {
                    if (err) {
                        res.send({ msg: "Something went wrong", msgError: true });
                    }
                    else {
                        res.send({ room, msgError: false });
                    }
                });
            }
        }
        else {
            res.send({ msg: "Something went wrong", msgError: true });
        }
    }
    catch (err) {
        res.send({ msg: "Something went wrong", msgError: true });
    }
}));
admin.put("/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { desc } = req.body;
    try {
        const room = yield Room_1.default.findById(req.params.roomId);
        if (room === null || room === void 0 ? void 0 : room.description) {
            room.description = desc;
            room.save((err) => {
                if (err) {
                    res.send({ msg: "Internal Server error", msgError: true });
                }
                else {
                    res.send({ room, msgError: false });
                }
            });
        }
    }
    catch (err) {
        res.send({ msg: "Internal Server error", msgError: true });
    }
}));
admin.delete("/:roomId/:userId", isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield Room_1.default.findById(req.params.roomId);
        if (!room) {
            res.send({ msg: "Invalid room", msgError: true });
        }
        else {
            room.members = room.members.filter((r) => r != req.params.userId);
            room.save((err) => {
                if (err) {
                    res.send({ msg: "Some error occured", msgError: true });
                }
                else {
                    res.send({ room, msgError: false });
                }
            });
        }
    }
    catch (err) {
        res.send({ msg: "Invalid room", msgError: true });
    }
}));
exports.default = admin;
//# sourceMappingURL=admin.js.map