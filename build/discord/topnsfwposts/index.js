"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
const bot_1 = __importDefault(require("discord/bot"));
const services_1 = __importDefault(require("../services"));
const builders_1 = require("@discordjs/builders");
const node_schedule_1 = __importDefault(require("node-schedule"));
const services_2 = __importDefault(require("../services"));
const DEFAULT_CHANNEL = '1031233747368038531';
let POST_CHANNEL;
const topPosts = async (bot) => {
    bot_1.default.user?.setActivity(bot.activity || 'Not defined', { type: bot.activityType });
    POST_CHANNEL = bot.nsfwAutoPosterSettings.channelId || DEFAULT_CHANNEL;
    const getHour = bot.nsfwAutoPosterSettings.postTime?.split(':')[0] || '22';
    const getMinute = bot.nsfwAutoPosterSettings.postTime?.split(':')[1] || '00';
    const rule = new node_schedule_1.default.RecurrenceRule();
    rule.tz = 'Europe/Berlin';
    rule.hour = getHour;
    rule.minute = getMinute;
    services_1.default.updateDiscordChannelDescription(bot_1.default, `Next update: ${getHour}:${getMinute}`, POST_CHANNEL);
    node_schedule_1.default.scheduleJob(rule, function () {
        warnAboutPosts(bot);
    });
};
const warnAboutPosts = (bot) => {
    services_1.default.updateDiscordChannelDescription(bot_1.default, `Last updated:  | Next update: ${bot.nsfwAutoPosterSettings.postTime}`, POST_CHANNEL);
    setTimeout(() => renderPosts(bot), 5000);
};
const renderPosts = async (bot) => {
    return await axios_1.default
        .get(`${config_1.default.config.REDDIT_URL}${config_1.default.config.REDDIT_NSWF_URL}?limit=${bot.nsfwAutoPosterSettings.postsToFetch}`)
        .then((result) => renderTopPosts(result.data.data.children, bot));
};
const renderTopPosts = (result, bot) => {
    result.map((item) => {
        const nsfwItem = item.data;
        if (isAllowedToPass(bot, nsfwItem)) {
            const createNswfItem = dbToObject(nsfwItem);
            embedAndSendMessage(createNswfItem, bot);
            bot.nsfwAutoPosterSettings.postList?.push(nsfwItem.id);
        }
    });
    const data = {
        nsfwAutoPosterSettings: {
            postList: bot.nsfwAutoPosterSettings.postList,
        },
    };
    services_2.default.updateNswfPostChannel(data, 'postList');
};
const isAllowedToPass = (bot, nsfwItem) => {
    if (!bot.nsfwAutoPosterSettings.bannedSubs?.includes(nsfwItem.subreddit) &&
        !bot.nsfwAutoPosterSettings.bannedUrls?.includes(nsfwItem.domain) &&
        !bot.nsfwAutoPosterSettings.postList?.includes(nsfwItem.subreddit)) {
        return true;
    }
    return false;
};
const embedAndSendMessage = (item, bot) => {
    if (isImage(item.url)) {
        const nsfwEmbed = buildNsfwMessage(item);
        services_1.default.sendEmbededBotMessageToChannel(bot_1.default, nsfwEmbed, POST_CHANNEL);
    }
    else {
        services_1.default.sendBotMessageToChannel(bot_1.default, item.url, POST_CHANNEL);
    }
};
const buildNsfwMessage = (item) => {
    const nsfwEmbed = new builders_1.EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(item.title)
        .setURL(item.url)
        .addFields({ name: `subreddit`, value: `${item.subreddit}`, inline: true }, { name: `Upvotes`, value: `${item.ups}`, inline: true })
        .setAuthor({
        name: item.name,
        iconURL: isImage(item.thumbnail)
            ? item.thumbnail
            : 'https://media.discordapp.net/attachments/1029381113916956702/1029398619192836176/vp3-nobg.png?width=671&height=671',
    })
        .setImage(item.url)
        .setTimestamp()
        .setFooter({
        text: `powered by Lean`,
        iconURL: 'https://media.discordapp.net/attachments/1029381113916956702/1029398619192836176/vp3-nobg.png?width=671&height=671',
    });
    return nsfwEmbed;
};
const dbToObject = (nsfwItem) => {
    const createNswfItem = {
        subreddit: nsfwItem.subreddit,
        title: nsfwItem.title,
        subreddit_name_prefixed: nsfwItem.subreddit_name_prefixed,
        ups: nsfwItem.ups,
        thumbnail: nsfwItem.thumbnail,
        url_overridden_by_dest: nsfwItem.url_overridden_by_dest,
        url: nsfwItem.url,
        name: nsfwItem.name,
        post_hint: nsfwItem.post_hint,
        domain: nsfwItem.domain,
        id: nsfwItem.id,
        permalink: nsfwItem.permalink,
    };
    return createNswfItem;
};
const isImage = (item) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg|mp4)$/.test(item);
};
exports.default = topPosts;
