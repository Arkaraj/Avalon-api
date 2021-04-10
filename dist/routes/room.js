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
const room = express_1.Router();
room.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!name || !description) {
        res.send({ msg: "Please Enter the Name and Description", msgError: true });
    }
    else {
        const window = {
            admin: [req.userId],
            name,
            description
        };
        const room = yield Room_1.default.create(window);
        room.save(err => {
            if (err) {
                console.log("ERROR: " + err);
                res.send({ msg: "Some Internal error occured", msgError: true });
            }
            else {
                res.send({ msgError: false, room });
            }
        });
    }
}));
room.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield Room_1.default.find({ members: req.userId });
    const admin = yield Room_1.default.find({ admin: req.userId });
    res.send({ rooms, admin });
}));
room.delete("/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield Room_1.default.findById(req.params.roomId);
        if (!room) {
            res.send({ msg: "Invalid room", msgError: true });
        }
        else {
            room.members = room.members.filter(r => r != req.userId);
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
exports.default = room;
//# sourceMappingURL=room.js.map