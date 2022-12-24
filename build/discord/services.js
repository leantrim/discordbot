"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const bot_1 = __importDefault(require("./bot"));
const topnsfwposts_1 = __importDefault(require("./topnsfwposts"));
const updateDiscordChannelDescription = async (client, message, channelId) => {
    if (!client.token)
        return;
    const channel = (await client.channels.fetch(channelId));
    if (!channel) {
        return console.log('no channel was found..');
    }
    channel.setTopic(message);
};
const sendBotMessageToChannel = async (client, message, channelId) => {
    if (!client.token)
        return;
    const channel = (await client.channels.fetch(channelId));
    if (!channel) {
        return console.log('no channel was found..');
    }
    channel.send(message);
};
const sendEmbededBotMessageToChannel = async (client, embededMessage, channelId) => {
    if (!client.token)
        return;
    const channel = (await client.channels.fetch(channelId));
    if (!channel) {
        return console.log('no channel was found..');
    }
    channel.send({ embeds: [embededMessage] });
};
const updateNswfPostChannel = async (data, route) => {
    await axios_1.default.put(`http://localhost:8000/api/discordbot/nsfw/${route}`, data);
    loadBotSettings();
};
const loadBotSettings = async () => {
    try {
        const { data } = await axios_1.default.get('http://localhost:8000/api/discordbot');
        (0, topnsfwposts_1.default)(data[0]);
    }
    catch (error) {
        console.log(error);
    }
};
const getChannelName = async (channelId) => {
    const channel = (await bot_1.default.channels.fetch(channelId));
    if (!channel) {
        return console.log('no channel was found..');
    }
    return channel.name;
};
const exportObject = {
    updateDiscordChannelDescription,
    sendBotMessageToChannel,
    sendEmbededBotMessageToChannel,
    updateNswfPostChannel,
    loadBotSettings,
    getChannelName,
};
exports.default = exportObject;
