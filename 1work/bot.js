const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Привет, октагон!`);
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Список команд:
    \n/site - отправляет в чат ссылку на сайт октагона
    \n/creator - отправляет в чат ФИО`);
});

// Обработчик команды /site
bot.onText(/\/site/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Ссылка на сайт октагона: https://students.forus.ru`);
});

// Обработчик команды /creator
bot.onText(/\/creator/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Ваше ФИО: Бухалихин Богдан Владиславович`);
});

// Обработчик текстовых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Ответ на любое сообщение, кроме команд
    if (text !== '/start' && text !== '/help' && text !== '/site' && text !== '/creator') {
        bot.sendMessage(chatId, `Вы сказали: ${text}`);
    }
});

console.log("Telegram бот запущен...");

module.exports = bot;