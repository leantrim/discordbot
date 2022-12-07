import dotenv from 'dotenv';
import client from "./discord/bot"
import discordbot from "./routes/discordbot";
import mongoose from "mongoose";
import express from "express";
const app = express();

app.use(express.json());
app.use("/api/discordbot", discordbot);

mongoose
  .connect("mongodb://localhost/lean-bot")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

app.listen(8000, () => console.log("Listening on port 8000..."));

dotenv.config();

// Initate Discord bot
client.login(process.env.DISCORD_TOKEN);


