import { WebSocket } from "ws";
import axios from "axios";
import RedditType from "./RedditLiveThreadType";
import config from "../config"

const initateRedditLiveThreadSocket = async () => {
    return await axios.get<RedditType>(`${process.env.REDDIT_LIVE_URL}${process.env.REDDIT_UA_LIVETHREAD}/about.json`).then(result => liveThread(result.data) );
}

const postLists: string[] = [];
const targetChannelId = config.DISCORD_UKRAINE_CHANNELID;




const liveThread = (result: RedditType) => {
    const socket = new WebSocket(result.data.websocket_url);

    socket.onopen = (e) => {
        console.log('Connection open!');
    };
    socket.onclose = (event) => {
        socket.close();
        initateRedditLiveThreadSocket();
    };

    socket.on('message', (message) => {
        const json = message.toString();
        const response = JSON.parse( json );

        if( response.type === 'update' ){
            const url = response.payload.data.body;
            const isUrlInList = postLists.includes( url );

            if( !isUrlInList ){
                postLists.push( url );
                // discordCommands.sendBotMessageToChannel( client, url, targetChannelId );
                // discordCommands.updateDiscordChannelDescription( client, `Last Post: ${getLatestTime()}`, targetChannelId );
            } 
        }
    })
}

const getLatestTime = () => {
    const d = new Date();
    const getLatestTime = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return getLatestTime;
}

export default initateRedditLiveThreadSocket;