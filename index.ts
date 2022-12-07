const client = require("./discord/bot");
const discordbot = require("./discord/discordbot");
const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.use(express.json());
app.use("/api/discordbot", discordbot);

mongoose
  .connect("mongodb://localhost/lean-bot")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err: any) => console.log("Could not connect to MongoDB...", err));

app.listen(8000, () => console.log("Listening on port 8000..."));


// Initate Discord bot
client.login(process.env.DISCORD_TOKEN);


