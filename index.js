const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const quoteAPI = require('quote-indo');
const cron = require('node-cron');

const app = express();

const port = process.env.PORT || 3000;

const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});

const botToken = '6289347145:AAH5L5MGOmmEYu8SwznLs8VyyWd-D_DR8Uc'; // Ganti dengan token bot Anda
const bot = new TelegramBot(botToken, { polling: true });

const queries = ['bucin', 'galau', 'kehidupan', 'random'];

cron.schedule('28 14 * * *', async () => {
    const channelId = '@katanyanala';

    for (let i = 0; i < 5; i++) {
        const title = '<b>Quote of today</b>\n\n';
        const footer = '\n\n~akashanala'
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const quote = await quoteAPI.Quotes(randomQuery);
        const message = title + `<i>${quote}</i>` + footer;
        bot.sendMessage(channelId, message, { parse_mode: 'HTML' });
    }
}, {
    scheduled: true,
    timezone: "Asia/Makassar"
});

bot.onText(/\/cek/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bot is active and running!');
});
