"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botDefaultData = {
    name: 'LeanBot',
    activityType: 1,
    activity: 'mongodb?!',
    nsfwAutoPosterSettings: {
        channelId: '1031233747368038531',
        postsToFetch: 100,
        autoUpdater: true,
        postTime: '22:00',
        bannedSubs: [''],
        bannedUrls: [''],
    },
};
const config = {
    REDDIT_LIVE_URL: 'https://www.reddit.com/live/',
    REDDIT_UA_LIVETHREAD: '18hnzysb1elcs',
    REDDIT_URL: 'https://www.reddit.com/',
    REDDIT_NSWF_URL: 'user/leantrim/m/top_nsfw.json',
    DISCORD_UKRAINE_CHANNELID: '946377831204679742',
    DISCORD_NSFW_CHANNELID: '1031233747368038531',
};
exports.default = { botDefaultData, config };
