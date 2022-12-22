import axios from "axios";
import botDefaultData from "discord/topnsfwposts/config";
import express from "express";
import { IDiscordBot } from "types/IDiscordBot";
import { validateDiscordBot as validate, Bot } from "../models/Discordbot";
const router = express.Router();

router.get('/', async (req, res) => {
  const botSettings = await Bot.find();

  // If we dont find any botsettings
  if(!botSettings.length){
    return createBotSettingsInDb();
  }
  return res.status(201).send(botSettings);
})

const createBotSettingsInDb = async () => {
  try {
      const { data } = await axios.post<IDiscordBot[]>('http://localhost:8000/api/discordbot', botDefaultData.botDefaultData);
      return data;
  } catch (error) {
    console.log(error);
  }
}

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const existingSettings = await Bot.findOne();
  if (existingSettings) return res.status(400).send('DEV: There is already a settings module in DB.');

  const bot = new Bot(req.body);
  bot.save();

  return res.status(201).send(bot);
});


router.put("/nsfw/channelId", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const botSettings = await Bot.findOne();
  if(!botSettings) return res.status(400).send('DEV: No bot Configuration has been created.');

  botSettings.nsfwAutoPosterSettings.channelId = req.body.nsfwAutoPosterSettings.channelId;

  botSettings?.save();
  return res.status(201).send(botSettings);
});


router.put("/nsfw/postTime", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const botSettings = await Bot.findOne();
  if(!botSettings) return res.status(400).send('DEV: No bot Configuration has been created.');

  botSettings.nsfwAutoPosterSettings.postTime = req.body.nsfwAutoPosterSettings.postTime;

  botSettings.save();
  return res.status(201).send(botSettings);
});

router.put("/nsfw/postsToFetch", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const botSettings = await Bot.findOne();
  if(!botSettings) return res.status(400).send('DEV: No bot Configuration has been created.');

  botSettings.nsfwAutoPosterSettings.postsToFetch = req.body.nsfwAutoPosterSettings.postsToFetch;

  botSettings.save();
  return res.status(201).send(botSettings);
});

router.put("/nsfw/postList", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const botSettings = await Bot.findOne();
  if(!botSettings) return res.status(400).send('DEV: No bot Configuration has been created.');

  botSettings.nsfwAutoPosterSettings.postList = req.body.nsfwAutoPosterSettings.postList;

  botSettings.save();
  return res.status(201).send(botSettings);
});

export default router;
