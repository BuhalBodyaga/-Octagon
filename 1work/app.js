const express = require("express");

const app = express();
app.get("/", function (_, response) {

    response.send("<h1>Главная страница</h1>");
});
app.use("/static",function (request, response) {
    response.json({ header: "Hello", body: "Octagon NodeJS Test" });
})
app.use("/dynamic", function (request, response) {
    const a = parseFloat(request.query.a);
    const b = parseFloat(request.query.b);
    const c = parseFloat(request.query.c);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        response.json({ header: "Error" });
    } else {
        const result = (a * b * c) / 3;
        response.json({ header: "Calculated", body: result.toString() });
    }
});

app.listen(3000);