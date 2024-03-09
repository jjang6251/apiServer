const express = require('express');
const models = require('./models');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/hi', (req, res) => {
    const data = {
        message: 'Success!!'
    }
    res.json(data);
});

app.post('/createuser', (req, res) => {
    try {
        models.User.create({
            name: req.body.name,
            age: req.body.age
        })
        .then(user => {
            // 유저 생성이 성공하면 success 메시지를 응답으로 보냄
            res.json({ message: "success" });
        })
        .catch(error => {
            // 유저 생성 중 오류가 발생하면 fail 메시지를 응답으로 보냄
            console.error(error);
            res.json({ message: "fail1" });
        });
    } catch (error) {
        // try 블록에서 오류 발생 시 catch 블록으로 이동하여 fail 메시지를 응답으로 보냄
        console.error(error);
        res.json({ message: "fail2" });
    }
});

module.exports = app;