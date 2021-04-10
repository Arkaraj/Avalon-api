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
exports.isAdmin = void 0;
const Room_1 = __importDefault(require("./models/Room"));
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room_1.default.findById(req.params.roomId);
    if (room === null || room === void 0 ? void 0 : room.admin.includes(req.userId)) {
        next();
    }
    else {
        res.send({ msg: "Invalid request, user not admin of this room", msgError: true });
    }
});
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map