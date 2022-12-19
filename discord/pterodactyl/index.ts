import { EmbedBuilder } from "@discordjs/builders";
import services from "./services"
import Allocations from './types/AllocationTypes';
import Servers from "./types/ServerTypes";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import appList from "./steamAppIdList"

let DEFAULT_IMAGE = 'https://media.discordapp.net/attachments/767507305410985996/891677530896105482/vp3.png?width=671&height=671';

const prefix = "!"
let allocations: Allocations[];
let servers: Servers[];
const messageReceived = async (message: any) => {

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift()?.toLowerCase();

    if(command === 'servers'){
        console.log('CMD detected');
        // anrop
        allocations = await services.getPanelRequest('nodes/1/allocations');
        const assignedAllocations: Allocations[]  = allocations.filter(
            (allocation: Allocations) => allocation.attributes.assigned
          );
        servers = await services.getPanelRequest('servers');
        const sortedServers = servers.sort((a, b) => {
            // If the active property is truthy, return 1; if it is falsey, return -1
            return a.attributes.container.environment.SRCDS_APPID ? 1 : -1;
          });
        for (const server of sortedServers) {
          console.log(server.attributes.container.environment.SERVER_VISIBLE_IN_DISCORD);
          if(server.attributes.container.environment.SERVER_VISIBLE_IN_DISCORD === '1')
          {
                const allocation = assignedAllocations.find(
                  allocation => allocation.attributes.id === server.attributes.allocation
                );
                if(allocation) {
                  server.attributes.allocationType = allocation;
                }
              const embed = buildGameServerEmbed(server);
              let row; // Component button
              let shortenedUrl = '';
              const app = appList.find(app => app.name === server.attributes.name);
              row = buildEmbedButton(server);
              message.channel.send({ embeds: [embed], components: [row] });
          }}
    }
};

const buildEmbedButton = (server: Servers) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel('Server Panel')
            .setURL(`https://panel.voiplay.se/server/${server.attributes.identifier}`)
            .setEmoji('🔗')
            .setStyle(ButtonStyle.Link),
        );
    return row;
}

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
const buildGameServerEmbed = (server: Servers) => {
    const ip = 'voiplay.se';
    const port = server.attributes.allocationType.attributes.port;
    const status = server.attributes.suspended ? 'Stopped' : 'Running';
    const isSteamGame = server.attributes.container.environment.SRCDS_APPID ? true : false;

    const serverEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`${server.attributes.name}`)
    .setURL(`https://panel.voiplay.se/server/${server.attributes.identifier}`)
    .setAuthor({ name: 'VOIPanel', url: 'https://panel.voiplay.se' })
    .setThumbnail(DEFAULT_IMAGE)
    .addFields(
      { name: 'Click below to auto join', value: services.formatSteamAutoJoinLink(ip, port, 'cpl123')},
        { name: 'Password', value: `cpl123`, inline: true }
    )
    .addFields({ name: 'IP', value: `${ip}`, inline: true })
    .addFields({ name: 'PORT', value: `${port}`, inline: true })
    .addFields({ name: 'Status', value: status, inline: true })
    .setImage(`https://cdn.akamai.steamstatic.com/steam/apps/108600/header.jpg`)
    .setTimestamp()
    .setFooter({ text: 'Server hosted by Voiplay', iconURL: DEFAULT_IMAGE });
    return serverEmbed;
}

export default messageReceived;
