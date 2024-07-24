const express = require("express");

const app = express();

app.get("/", function (_, response) {
    response.send("<h1>Главная страница</h1>");
});

app.use("/static", function (request, response) {
    response.json({ header: "Hello", body: "Octagon NodeJS Test" });
});

app.use("/dynamic", function (request, response) {
    const params = ['a', 'b', 'c'].map(key => parseFloat(request.query[key]));

    if (params.some(isNaN)) {
        response.json({ header: "Error" });
    } else {
        const [a, b, c] = params;
        const result = (a * b * c) / 3;
        response.json({ header: "Calculated", body: result.toString() });
    }
});

app.listen(3000);
