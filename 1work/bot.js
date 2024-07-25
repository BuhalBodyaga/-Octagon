const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');
require('dotenv').config();

// Получение токена из переменной окружения
const token = process.env.TELEGRAM_BOT_TOKEN;

// Создаем экземпляр бота с использованием long polling
const bot = new TelegramBot(token, { polling: true });

// Настройка подключения к базе данных
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных успешно установлено');
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Привет, октагон!`);
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, `Список команд:
    \n/site - отправляет в чат ссылку на сайт октагона
    \n/creator - отправляет в чат ФИО
    \n/randomItem - возвращает случайный предмет
    \n/deleteItem {id} - удаляет предмет по ID
    \n/getItemByID {id} - возвращает предмет по ID`)
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

// Обработчик команды /randomItem
bot.onText(/\/randomItem/, (msg) => {
    const chatId = msg.chat.id;

    connection.query('SELECT * FROM Items ORDER BY RAND() LIMIT 1', (err, results) => {
        if (err) {
            bot.sendMessage(chatId, 'Ошибка при получении случайного предмета');
            return;
        }

        if (results.length === 0) {
            bot.sendMessage(chatId, 'В базе данных нет предметов');
            return;
        }

        const item = results[0];
        bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`);
    });
});

// Обработчик команды /deleteItem
bot.onText(/\/deleteItem (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const itemId = match[1];  // ID из команды

    connection.query('DELETE FROM Items WHERE id = ?', [itemId], (err, results) => {
        if (err) {
            bot.sendMessage(chatId, 'Ошибка при удалении предмета');
            return;
        }

        if (results.affectedRows === 0) {
            bot.sendMessage(chatId, 'Ошибка: такого предмета нет');
            return;
        }

        bot.sendMessage(chatId, 'Удачно: предмет удален');
    });
});

// Обработчик команды /getItemByID
bot.onText(/\/getItemByID (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const itemId = match[1];

    connection.query('SELECT * FROM Items WHERE id = ?', [itemId], (err, results) => {
        if (err) {
            bot.sendMessage(chatId, 'Ошибка при получении предмета');
            return;
        }

        if (results.length === 0) {
            bot.sendMessage(chatId, 'Ошибка: такого предмета нет');
            return;
        }

        const item = results[0];
        bot.sendMessage(chatId, `(${item.id}) - ${item.name}: ${item.desc}`);
    });
});

// Обработчик текстовых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Ответ на любое сообщение, кроме команд
    if (!/^\/(start|help|site|creator|randomItem|deleteItem|getItemByID)/.test(text)) {
        bot.sendMessage(chatId, `Вы сказали: ${text}`);
    }
});

console.log("Telegram бот запущен...");

module.exports = bot;