import axios from 'axios';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { IDiscordBot } from 'types/IDiscordBot';
import topPosts from './topnsfwposts';

const updateDiscordChannelDescription = async (client: Client, message: string, channelId: string) => {
  if (!client.token) return;
  const channel = (await client.channels.fetch(channelId)) as TextChannel;

  if (!channel) {
    return console.log('no channel was found..');
  }
  channel.setTopic(message);
};

const sendBotMessageToChannel = async (client: Client, message: string, channelId: string) => {
  if (!client.token) return;

  const channel = (await client.channels.fetch(channelId)) as TextChannel;
  if (!channel) {
    return console.log('no channel was found..');
  }
  channel.send(message);
};

const sendEmbededBotMessageToChannel = async (client: Client, embededMessage: EmbedBuilder, channelId: string) => {
  if (!client.token) return;
  const channel = (await client.channels.fetch(channelId)) as TextChannel;
  if (!channel) {
    return console.log('no channel was found..');
  }
  channel.send({ embeds: [embededMessage] });
};

const updateNswfPostChannel = async (data: any, route: string, client: Client) => {
  await axios.put<IDiscordBot[]>(`http://localhost:8000/api/discordbot/nsfw/${route}`, data);
  loadBotSettings(client);
};

const loadBotSettings = async (client: Client) => {
  try {
    const { data } = await axios.get<IDiscordBot[]>('http://localhost:8000/api/discordbot');
    topPosts(data[0], client);
  } catch (error) {
    console.log(error);
  }
};

const getChannelName = async (channelId: string, client: Client) => {
  const channel = (await client.channels.fetch(channelId)) as TextChannel;
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
export default exportObject;
