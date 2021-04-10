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
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./models/User"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error("Not Authenticated!");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.send({ msgError: true, msg: "You are not Authenticated" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT);
        req.userId = payload.userId;
        const user = yield User_1.default.findById(payload.userId);
        req.user = user;
        next();
    }
    catch (err) {
        console.log("ERRR: " + err);
        res.send({ msgError: true, msg: "You are not Authenticated" });
    }
});
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map