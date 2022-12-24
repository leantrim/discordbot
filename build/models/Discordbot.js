"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = exports.validateDiscordBot = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const botSchema = new mongoose_1.default.Schema({
    name: { type: String },
    activityType: { type: Number },
    activity: { type: String },
    nsfwAutoPosterSettings: {
        channelId: { type: String },
        postsToFetch: { type: Number },
        autoUpdater: { type: Boolean },
        lastUpdated: { type: Date },
        postList: { type: [String] },
        bannedSubs: { type: [String] },
        bannedUrls: { type: [String] },
        postTime: { type: String },
    },
});
const Bot = mongoose_1.default.model('Bot', botSchema);
exports.Bot = Bot;
const validateDiscordBot = (bot) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(6),
        activityType: joi_1.default.number(),
        activity: joi_1.default.string(),
        nsfwAutoPosterSettings: {
            postsToFetch: joi_1.default.number(),
            channelId: joi_1.default.string(),
            autoUpdater: joi_1.default.boolean(),
            lastUpdated: joi_1.default.date(),
            postTime: joi_1.default.string(),
            bannedSubs: joi_1.default.array(),
            bannedUrls: joi_1.default.array(),
            postList: joi_1.default.array(),
        },
    });
    return schema.validate(bot);
};
exports.validateDiscordBot = validateDiscordBot;
