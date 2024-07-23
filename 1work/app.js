const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();


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

app.use(express.json());

// Получение всех элементов
app.get('/getAllItems', (req, res) => {
    connection.query('SELECT * FROM Items', (err, results) => {
        if (err) {
            res.json(null);
            return;
        }
        res.json(results);
    });
});

// Добавление нового элемента
app.post('/addItem', (req, res) => {
    const { name, desc } = req.query;
    if (!name || !desc) {
        res.json(null);
        return;
    }
    connection.query('INSERT INTO Items (name, `desc`) VALUES (?, ?)', [name, desc], (err, results) => {
        if (err) {
            res.json(null);
            return;
        }
        res.json({ id: results.insertId, name, desc });
    });
});

// Удаление элемента
app.post('/deleteItem', (req, res) => {
    const { id } = req.query;
    if (!id) {
        res.json(null);
        return;
    }
    connection.query('DELETE FROM Items WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.json(null);
            return;
        }
        if (results.affectedRows === 0) {
            res.json({});
            return;
        }
        res.json({ id });
    });
});

// Обновление элемента
app.post('/updateItem', (req, res) => {
    const { id, name, desc } = req.query;
    if (!id || !name || !desc) {
        res.json(null);
        return;
    }
    connection.query('UPDATE Items SET name = ?, `desc` = ? WHERE id = ?', [name, desc, id], (err, results) => {
        if (err) {
            res.json(null);
            return;
        }
        if (results.affectedRows === 0) {
            res.json({});
            return;
        }
        res.json({ id, name, desc });
    });
});

app.listen(3000, function () {
    console.log("Сервер запущен на http://localhost:3000");
});
