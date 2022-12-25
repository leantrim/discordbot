import client from './discord/bot';
import discordbot from './routes/discordbot';
import mongoose from 'mongoose';
import express from 'express';
import env from 'dotenv';

const app = express();

env.config();
app.use(express.json());
app.use('/api/discordbot', discordbot);

const MONGODB = {
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
  ip: process.env.MONGODB_IP,
  port: process.env.MONGODB_PORT,
  db: process.env.MONGODB_DB,
};
mongoose.set('strictQuery', false);
mongoose
  .connect(
    `mongodb://${MONGODB.user}:${MONGODB.password}@${MONGODB.ip}:${MONGODB.port}/${MONGODB.db}?authSource=${MONGODB.db}&authMechanism=DEFAULT`,
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err));

app.listen(8000, () => console.log('Listening on port 8000...'));

// Initate Discord bot
client.login(process.env.DISCORD_TOKEN);

console.log('Test=?!');
