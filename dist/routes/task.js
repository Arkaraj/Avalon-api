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
const Room_1 = __importDefault(require("../models/Room"));
const Task_1 = __importDefault(require("../models/Task"));
const task = express_1.Router();
task.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Task_1.default.find({ user: req.userId }).populate("room")
        .exec((err, doc) => {
        if (err) {
            res.send({ msg: "An error occured", msgError: true });
        }
        else {
            res.send({ roomTasks: doc, msgError: false });
        }
    });
}));
task.get("/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomTasks = yield Task_1.default.find({ room: req.params.roomId, user: req.userId });
    Room_1.default.findById(req.params.roomId).populate('admin').exec((err, document) => {
        if (err) {
            res.send({ msg: "An error occured", msgError: true });
        }
        else {
            const admin = document === null || document === void 0 ? void 0 : document.admin;
            res.send({ roomTasks, admin, msgError: false });
        }
    });
}));
task.put("/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findById(req.params.taskId);
        if (!task) {
            res.send({ msg: "Invalid room", msgError: true });
        }
        else {
            task.completed = !task.completed;
            yield task.save();
            res.send({ task, msgError: false });
        }
    }
    catch (err) {
        res.send({ msg: "Internal Error", msgError: true });
    }
}));
exports.default = task;
//# sourceMappingURL=task.js.map