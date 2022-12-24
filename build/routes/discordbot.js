"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("discord/topnsfwposts/config"));
const express_1 = __importDefault(require("express"));
const Discordbot_1 = require("../models/Discordbot");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const botSettings = await Discordbot_1.Bot.find();
    // If we dont find any botsettings
    if (!botSettings.length) {
        return createBotSettingsInDb();
    }
    return res.status(201).send(botSettings);
});
const createBotSettingsInDb = async () => {
    try {
        const { data } = await axios_1.default.post('http://localhost:8000/api/discordbot', config_1.default.botDefaultData);
        return data;
    }
    catch (error) {
        console.log(error);
    }
};
router.post("/", async (req, res) => {
    const { error } = (0, Discordbot_1.validateDiscordBot)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const existingSettings = await Discordbot_1.Bot.findOne();
    if (existingSettings)
        return res.status(400).send('DEV: There is already a settings module in DB.');
    const bot = new Discordbot_1.Bot(req.body);
    bot.save();
    return res.status(201).send(bot);
});
router.put("/nsfw/channelId", async (req, res) => {
    const { error } = (0, Discordbot_1.validateDiscordBot)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const botSettings = await Discordbot_1.Bot.findOne();
    if (!botSettings)
        return res.status(400).send('DEV: No bot Configuration has been created.');
    botSettings.nsfwAutoPosterSettings.channelId = req.body.nsfwAutoPosterSettings.channelId;
    botSettings?.save();
    return res.status(201).send(botSettings);
});
router.put("/nsfw/postTime", async (req, res) => {
    const { error } = (0, Discordbot_1.validateDiscordBot)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const botSettings = await Discordbot_1.Bot.findOne();
    if (!botSettings)
        return res.status(400).send('DEV: No bot Configuration has been created.');
    botSettings.nsfwAutoPosterSettings.postTime = req.body.nsfwAutoPosterSettings.postTime;
    botSettings.save();
    return res.status(201).send(botSettings);
});
router.put("/nsfw/postsToFetch", async (req, res) => {
    const { error } = (0, Discordbot_1.validateDiscordBot)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const botSettings = await Discordbot_1.Bot.findOne();
    if (!botSettings)
        return res.status(400).send('DEV: No bot Configuration has been created.');
    botSettings.nsfwAutoPosterSettings.postsToFetch = req.body.nsfwAutoPosterSettings.postsToFetch;
    botSettings.save();
    return res.status(201).send(botSettings);
});
router.put("/nsfw/postList", async (req, res) => {
    const { error } = (0, Discordbot_1.validateDiscordBot)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const botSettings = await Discordbot_1.Bot.findOne();
    if (!botSettings)
        return res.status(400).send('DEV: No bot Configuration has been created.');
    botSettings.nsfwAutoPosterSettings.postList = req.body.nsfwAutoPosterSettings.postList;
    botSettings.save();
    return res.status(201).send(botSettings);
});
exports.default = router;
