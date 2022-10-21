import axios from "axios";
import config from "../../socket/reddit/config"
import client from "discord/bot";
import discordCommands from "../services"
import { EmbedBuilder } from "@discordjs/builders";
import TopList from "./types/TopListType";
import TopListAll from "./types/TopListAllType";
import { IDiscordBot } from "types/IDiscordBot";
import schedule from 'node-schedule';
import services from "../services"

const DEFAULT_CHANNEL = "1031233747368038531";
let POST_CHANNEL: string;

const topPosts = async (bot: IDiscordBot) => {
    client.user?.setActivity(bot.activity || 'Not defined', { type: bot.activityType });

    POST_CHANNEL = bot.nsfwAutoPosterSettings.channelId || DEFAULT_CHANNEL;
    
    const getHour = bot.nsfwAutoPosterSettings.postTime?.split(':')[0] || '22';
    const getMinute = bot.nsfwAutoPosterSettings.postTime?.split(':')[1] || '00';

    const rule = new schedule.RecurrenceRule();
    rule.tz = "Europe/Berlin";
    rule.hour = getHour;
    rule.minute = getMinute;

    discordCommands.updateDiscordChannelDescription(client, `Next update: ${getHour}:${getMinute}`, POST_CHANNEL);

    schedule.scheduleJob(rule, function(){
        warnAboutPosts(bot);
    });
}

const warnAboutPosts = (bot: IDiscordBot) => {
    const date = new Date();
    discordCommands.updateDiscordChannelDescription(client, `Last updated:  | Next update: ${bot.nsfwAutoPosterSettings.postTime}`, POST_CHANNEL);
    setTimeout(() => renderPosts(bot), 5000);
}

const renderPosts = async (bot: IDiscordBot) => {
    return await axios.get<any>(`${config.REDDIT_URL}${config.REDDIT_NSWF_URL}?limit=${bot.nsfwAutoPosterSettings.postsToFetch}`).then(result => renderTopPosts(result.data.data.children, bot) );
}

const renderTopPosts = ( result: TopListAll[], bot: IDiscordBot ) => {
    result.map((item: TopListAll) => {
        const nsfwItem: TopList = item.data;
        if(isAllowedToPass(bot, nsfwItem)) {
            const createNswfItem = dbToObject(nsfwItem);
            embedAndSendMessage(createNswfItem, bot);
            bot.nsfwAutoPosterSettings.postList?.push(nsfwItem.id);
        }
    })
    const data = {
        nsfwAutoPosterSettings: {
            postList: bot.nsfwAutoPosterSettings.postList
        }
    }
    services.updateNswfPostChannel(data, 'postList');
}

const isAllowedToPass = (bot: IDiscordBot, nsfwItem: TopList) => {
    if(!bot.nsfwAutoPosterSettings.bannedSubs?.includes(nsfwItem.subreddit) 
        && !bot.nsfwAutoPosterSettings.bannedUrls?.includes(nsfwItem.domain) 
        && nsfwItem.url 
        && !bot.nsfwAutoPosterSettings.postList?.includes(nsfwItem.subreddit)){
            return true;
    }
    return false;
}

const embedAndSendMessage = (item: TopList, bot: IDiscordBot) => {
    if(isImage(item.url)){
        const nsfwEmbed = buildNsfwMessage(item);
        discordCommands.sendEmbededBotMessageToChannel(client, nsfwEmbed, POST_CHANNEL)
    } else {
        discordCommands.sendBotMessageToChannel(client, item.url, POST_CHANNEL);
    }
}

const buildNsfwMessage = (item: TopList) => {
    const nsfwEmbed = new EmbedBuilder()
	    .setColor(0xFF0000)
	    .setTitle(item.title)
	    .setURL(item.url)
        .addFields(
            { name: `subreddit`, value: `${item.subreddit}`, inline: true },
            { name: `Upvotes`, value: `${item.ups}`, inline: true },
        )
	    .setAuthor({ name: item.name, iconURL: isImage(item.thumbnail) ? item.thumbnail : 'https://media.discordapp.net/attachments/1029381113916956702/1029398619192836176/vp3-nobg.png?width=671&height=671'})
	    .setImage(item.url)
	    .setTimestamp()
	    .setFooter({ text: `powered by Lean`, iconURL: 'https://media.discordapp.net/attachments/1029381113916956702/1029398619192836176/vp3-nobg.png?width=671&height=671' });
    return nsfwEmbed;
}

const dbToObject = (nsfwItem: TopList) => {
    const createNswfItem: TopList = {
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
    } 
    return createNswfItem;
}

const isImage = (item: string) => {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg|mp4)$/.test(item);
}

export default topPosts
