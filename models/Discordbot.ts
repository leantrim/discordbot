import { IDiscordBot } from "types/IDiscordBot";
import Joi from "joi";
import mongoose, { Schema, Model } from "mongoose";

const botSchema: Schema<IDiscordBot> = new mongoose.Schema({
  name: { type: String },
  activityType: { type: Number  },
  activity: { type: String },
  nsfwAutoPosterSettings: { 
    channelId: { type: String },
    postsToFetch: { type: Number },
    autoUpdater: { type: Boolean },
    lastUpdated: { type: Date },
    postList: { type: [String] },
    bannedSubs: { type: [String] },
    bannedUrls: { type: [String] },
    postTime: { type: String },
  }
});

const Bot: Model<IDiscordBot> = mongoose.model("Bot", botSchema);

const validateDiscordBot = (bot: IDiscordBot) => {
  const schema = Joi.object({
    name: Joi.string().min(6),
    activityType: Joi.number(),
    activity: Joi.string(),
    nsfwAutoPosterSettings: {
      postsToFetch: Joi.number(),
      channelId: Joi.string(),
      autoUpdater: Joi.boolean(),
      lastUpdated:  Joi.date(),
      postTime: Joi.string(),
      bannedSubs: Joi.array(),
      bannedUrls: Joi.array(),
      postList: Joi.array(),

    }
  });
  return schema.validate(bot);
};

export { validateDiscordBot, Bot };
