const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const quoteAPI = require('quote-indo');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// Port yang akan digunakan oleh Express
const port = process.env.PORT || 3000;

// Menentukan direktori tempat file index.html berada
const publicDir = path.join(__dirname, 'public');

app.use(express.static(publicDir));

app.listen(port, () => {
    console.log(`Express server is listening on port ${port}`);
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const queries = ['bucin', 'galau', 'kehidupan', 'random'];

// Menjalankan perintah /quote otomatis setiap hari pukul 11:52
cron.schedule('28 14 * * *', async () => {
    const channelId = '@katanyanala'; // Ganti dengan @username atau ID channel yang sesuai

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
    timezone: "Asia/Makassar" // Ganti dengan zona waktu yang sesuai
});

// Menambahkan perintah /cek untuk mengecek apakah bot aktif
bot.onText(/\/cek/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bot is active and running!');
});