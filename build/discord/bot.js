"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const services_1 = __importDefault(require("./services"));
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
});
client.on('ready', async () => {
    console.log('bot is ready');
    client.user?.setActivity('Loading Settings...', { type: discord_js_1.ActivityType.Watching });
    services_1.default.loadBotSettings();
});
const prefix = "!";
client.on("messageCreate", async (message) => {
    if (message.author.bot)
        return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift()?.toLowerCase();
    const messageArray = message.content.split(" ");
    const argument = messageArray.slice(1);
    if (command === 'help') {
        const helpMessage = new discord_js_1.EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`Commands`)
            .setDescription(`Available commands for Lean Bot`)
            .setColor(0xbfc12b)
            .setThumbnail(`https://media.discordapp.net/attachments/1029381113916956702/1029398619192836176/vp3-nobg.png?width=671&height=671`)
            .addFields({ name: `Update the post time`, value: `!time HH:MM` }, { name: `Channel To Post NSFW updates`, value: `!channel (Be in the channel you want updates to)` }, { name: `Amount of Posts`, value: `!post amount` })
            .setTimestamp()
            .setFooter({ text: `powered by Lean`, iconURL: 'https://media.discordapp.net/attachments/1029381113916956702/1029398619192836176/vp3-nobg.png?width=671&height=671' });
        message.channel.send({ embeds: [helpMessage] });
    }
    if (command === 'posts') {
        const amount = parseInt(argument[0]);
        const invalidLetters = /^[0-9a-zA-Z]+$/;
        let valid = true;
        if (!invalidLetters.test(argument[0]) || !amount) {
            message.channel.send('[ERROR] Invalid format [!posts 420]');
            valid = false;
        }
        if (isNaN(amount)) {
            message.channel.send('Needs to be a number dumbo [!posts amount]');
            valid = false;
        }
        if (valid) {
            const data = {
                nsfwAutoPosterSettings: {
                    postsToFetch: amount
                }
            };
            services_1.default.updateNswfPostChannel(data, 'postsToFetch');
            message.channel.send(`post amount updated ${amount}`);
        }
    }
    if (command === 'time') {
        const time = argument[0];
        let validated = validateTimePost(time);
        if (validated) {
            message.channel.send(validated);
        }
        if (!validated) {
            const data = {
                nsfwAutoPosterSettings: {
                    postTime: time
                }
            };
            services_1.default.updateNswfPostChannel(data, 'postTime');
            message.channel.send(`Post time set to ${time}`);
        }
    }
    if (command === 'channel') {
        const name = await getChannelName(message.channelId);
        message.channel.send(`Channel updated to: ${name}`);
        const data = {
            nsfwAutoPosterSettings: {
                channelId: message.channelId
            }
        };
        services_1.default.updateNswfPostChannel(data, 'channelId');
    }
    if (command === 'activity') {
        const name = await getChannelName(message.channelId);
        message.channel.send(`Channel updated to: ${name}`);
        const data = {
            nsfwAutoPosterSettings: {
                channelId: message.channelId
            }
        };
        services_1.default.updateNswfPostChannel(data, 'channelId');
    }
});
const validateTimePost = (time) => {
    const getTime = time.split(':');
    const rawHour = getTime[0];
    const rawMinute = getTime[1];
    const hour = parseInt(getTime[0]);
    const minute = parseInt(getTime[1]);
    const invalidLetters = /^[0-9a-zA-Z]+$/;
    let message;
    if (!time || getTime.length > 2 || !time.includes(':')) {
        message = '[ERROR] Please use format HH:MM';
    }
    if (isNaN(hour) || isNaN(minute) || !invalidLetters.test(rawHour) || !invalidLetters.test(rawMinute)) {
        message = '[ERROR] Only numbers dumbo';
    }
    if (hour > 23 || hour < 0) {
        message = '[ERROR] Hour needs to be between 0 - 23';
    }
    if (minute > 60 || minute < 0) {
        message = '[ERROR] Minutes needs to be between 0 - 59';
    }
    return message;
};
const getChannelName = async (channelId) => {
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
        return console.log('no channel was found..');
    }
    return channel.name;
};
exports.default = client;
