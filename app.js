const express = require('express');
const models = require('./models');

const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/hi', (req, res) => {
    const data = {
        message: 'Success!!'
    }
    res.json(data);
});

app.post('/createuser', (req, res) => {
    try {
        const password = req.body.password;
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function(err, hashed_password) {
            models.Reuser.create({
                username: req.body.username,
                password: hashed_password
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
        })
    } catch (error) {
        // try 블록에서 오류 발생 시 catch 블록으로 이동하여 fail 메시지를 응답으로 보냄
        console.error(error);
        res.json({ message: "fail2" });
    }
});

app.post("/login", (req, res) => {
    const response_password = req.body.password;
  
    models.Reuser.findOne({
        where: {
          username: req.body.username
        }
      })
        .then(foundData => {
          if (foundData) {
            bcrypt.compare(response_password, foundData.password, function (err, result) {
              if (err) throw err;
              if (result) {
                console.log('login 성공');
                // req.session.user = result;
                // req.session.stdid = req.body.id;
                try {
                  const accessToken = jwt.sign({
                    id: foundData.username,
                    name: foundData.username,
                  }, "accesstoken", {
                    expiresIn: '1h',
                    issuer: "About Tech",
                  });
  
                  res.cookie("accessToken", accessToken, {
                    secure: false,
                    httpOnly: true,
                  });
                  return res.status(200).json({message: 'success'});
                } catch (error) {
                    console.log(error);
                  return res.status(201).send(error);
                }
                
              }
              else {
                console.log('로그인 실패(비밀번호 불일치)');
                return res.status(200).send('fail');
              }
            })
          }
          else {
            console.log('해당하는 id를 찾을 수 없습니다.');
            return res.status(200).send('해당하는 ID를 찾을 수 없습니다.');
          }
        })
  
  });

module.exports = app;