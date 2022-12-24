"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const services_1 = __importDefault(require("./services"));
const discord_js_1 = require("discord.js");
const steamAppIdList_1 = __importDefault(require("./steamAppIdList"));
let DEFAULT_IMAGE = 'https://media.discordapp.net/attachments/767507305410985996/891677530896105482/vp3.png?width=671&height=671';
const prefix = '!';
let allocations;
let servers;
const messageReceived = async (message) => {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift()?.toLowerCase();
    if (command === 'servers') {
        // anrop
        allocations = await services_1.default.getPanelRequest('nodes/1/allocations');
        const assignedAllocations = allocations.filter((allocation) => allocation.attributes.assigned);
        servers = await services_1.default.getPanelRequest('servers');
        const sortedServers = servers.sort((a, b) => {
            // If the active property is truthy, return 1; if it is falsey, return -1
            return a.attributes.container.environment.SRCDS_APPID ? 1 : -1;
        });
        for (const server of sortedServers) {
            if (server.attributes.container.environment.SERVER_VISIBLE_IN_DISCORD === '1') {
                const allocation = assignedAllocations.find((allocation) => allocation.attributes.id === server.attributes.allocation);
                if (allocation) {
                    server.attributes.allocationType = allocation;
                }
                const app = steamAppIdList_1.default.find((app) => app.eggAppId === server.attributes.container.environment.SRCDS_APPID);
                let row; // Component button
                row = buildEmbedButton(server);
                if (app) {
                    const embed = buildGameServerEmbed(server, app.imageUrl);
                    message.channel.send({ embeds: [embed], components: [row] });
                }
                else {
                }
            }
        }
    }
};
const buildEmbedButton = (server) => {
    const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setLabel('Server Panel')
        .setURL(`https://panel.voiplay.se/server/${server.attributes.identifier}`)
        .setEmoji('🔗')
        .setStyle(discord_js_1.ButtonStyle.Link));
    return row;
};
// const buildServerEmbed = (server: Servers) => {
//     const serverEmbed = new EmbedBuilder()
// 	    .setColor(0xFF0000)
//       .setImage(`https://cdn.akamai.steamstatic.com/steam/apps/108600/header.jpg`)
// 	    .setTitle(server.attributes.name)
// 	    .setURL(`https://panel.voiplay.se/server/${server.attributes.identifier}`)
//       .addFields(
//             { name: `IP`, value: `voiplay.se`, inline: false },
//             { name: `PORT`, value: `${server.attributes.allocationType.attributes.port}` },
//         )
//       .addFields({ name: `IP:`, value: `voiplay.se`, inline: true })
// 	    .setTimestamp()
// 	    .setFooter({ text: `Voiplay Server`, iconURL: DEFAULT_IMAGE });
//     return serverEmbed;
// }
const buildGameServerEmbed = (server, bannerImg) => {
    const ip = 'voiplay.se';
    const port = server.attributes.allocationType.attributes.port;
    const status = server.attributes.suspended ? 'Stopped' : 'Running';
    const isSteamGame = server.attributes.container.environment.SRCDS_APPID ? true : false;
    const serverEmbed = new builders_1.EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${server.attributes.name}`)
        .setURL(`https://panel.voiplay.se/server/${server.attributes.identifier}`)
        .setAuthor({ name: 'VOIPanel', url: 'https://panel.voiplay.se' })
        .setThumbnail(DEFAULT_IMAGE)
        .addFields({ name: 'Click below to auto join', value: services_1.default.formatSteamAutoJoinLink(ip, port, 'cpl123') }, { name: 'Password', value: `cpl123`, inline: true })
        .addFields({ name: 'IP', value: `${ip}`, inline: true })
        .addFields({ name: 'PORT', value: `${port}`, inline: true })
        .addFields({ name: 'Status', value: status, inline: true })
        .setImage(bannerImg)
        .setTimestamp()
        .setFooter({ text: 'Server hosted by Voiplay', iconURL: DEFAULT_IMAGE });
    return serverEmbed;
};
exports.default = messageReceived;
