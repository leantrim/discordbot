"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("./discord/bot"));
const discordbot_1 = __importDefault(require("./routes/discordbot"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use('/api/discordbot', discordbot_1.default);
const MONGODB = {
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    ip: process.env.MONGODB_IP,
    port: process.env.MONGODB_PORT,
    db: process.env.MONGODB_DB,
};
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(`mongodb://${MONGODB.user}:${MONGODB.password}@${MONGODB.ip}:${MONGODB.port}/${MONGODB.db}?authSource=${MONGODB.db}&authMechanism=DEFAULT`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to MongoDB...', err));
app.listen(8000, () => console.log('Listening on port 8000...'));
// Initate Discord bot
bot_1.default.login(process.env.DISCORD_TOKEN);
