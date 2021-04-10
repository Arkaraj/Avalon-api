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
require("dotenv-save").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("./models/User"));
const passport_github_1 = require("passport-github");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const isAuth_1 = require("./isAuth");
const Room_1 = __importDefault(require("./models/Room"));
const room_1 = __importDefault(require("./routes/room"));
const task_1 = __importDefault(require("./routes/task"));
const admin_1 = __importDefault(require("./routes/admin"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.connect(`${process.env.MONGO_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, (err) => {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Successfully Connected to Database!");
        }
    });
    const app = express_1.default();
    passport_1.default.serializeUser((user, done) => {
        done(null, user.accessToken);
    });
    app.use(passport_1.default.initialize());
    app.use(cors_1.default({ origin: "*" }));
    app.use(express_1.default.json());
    app.use("/room", isAuth_1.isAuth, room_1.default);
    app.use("/task", isAuth_1.isAuth, task_1.default);
    app.use("/admin", isAuth_1.isAuth, admin_1.default);
    passport_1.default.use(new passport_github_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    }, (_, __, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield User_1.default.findOne({ githubId: profile.id });
        if (user) {
            user.name = profile.displayName ? profile.displayName : profile.username;
            yield user.save();
        }
        else {
            const name = profile.displayName ? profile.displayName : profile.username;
            User_1.default.create({ name, githubId: profile.id });
        }
        cb(null, { accessToken: jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id }, process.env.SECRET_JWT, { expiresIn: "30d" }) });
    })));
    app.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.send({ user: null });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.send({ user: null });
            return;
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT);
            req.userId = payload.userId;
            const user = yield User_1.default.findById(req.userId);
            res.send({ user });
        }
        catch (err) {
            res.send({ user: null });
            return;
        }
    }));
    app.get("/", (_req, res) => {
        res.send("Avalon Vs Code Extension");
    });
    app.get('/auth/github', passport_1.default.authenticate('github', { session: false }));
    app.post("/join", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { code } = req.body;
        const room = yield Room_1.default.findOne({ code });
        if (!room) {
            res.send({ msg: "Invalid room code", msgError: true });
        }
        else {
            if (room.members.includes(req.userId) || room.admin.includes(req.userId)) {
                res.send({ msg: "User already a member", msgError: true });
            }
            else {
                room.members.push(req.userId);
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
    }));
    app.get('/auth/github/callback', passport_1.default.authenticate('github', { session: false }), function (req, res) {
        res.redirect(`http://localhost:5001/auth/${req.user.accessToken}`);
    });
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Listening on port ${port} 🚀`);
    });
});
main();
//# sourceMappingURL=app.js.map