const express = require('express');
const models = require('./models');

const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');

//카카오
const cors = require("cors");
const origin = "http://localhost:5500";
const qs = require("qs");
const axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://kauth.kakao.com/'],
  credentials: true
}));


app.get('/hi', (req, res) => {
  console.log(req.headers);
    const data = {
        message: `success ${req.headers.username}!`
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
                    id: foundData.id,
                    username: foundData.username,
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
                  return res.status(404).send(error);
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

// app.get("/kakao", async(req, res) => {

//  console.log(req.query.code);

//  const config = {
//   client_id: "6475f239d447f466561f37e9e5549289",
//   grant_type: "authorization_code",
//   redirect_uri: "http://localhost:4002/users/kakao/finish",
//   code: req.query.code,
//   };

//   const data = querystring.stringify(config);

//   const kakaoTokenRequest = await axios.post("https://kauth.kakao.com/oauth/token", data, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//   });

//   console.log(kakaoTokenRequest.data.access_token);
// })

const client_id = "b8b39c15be3887fed1e10d34636e2447";
const redirect_uri = "http://localhost:8000/kakao";
const token_uri = "https://kauth.kakao.com/oauth/token";
const api_host = "https://kapi.kakao.com";
const client_secret = "";

app.get("/authorize", function (req, res) {
  let {scope} = req.query;
  let scopeParam = "";
  if (scope) {
      scopeParam = "&scope=" + scope;
  }
  console.log(scopeParam);
  res
      .status(302)
      .redirect(
          `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code${scopeParam}`
      );

  // axios.post(`https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code${scopeParam}`)
  // .then((res) =>{
  //   return res
  // })
});

async function call(method, uri, param, header) {
  try {
      rtn = await axios({
          method: method,
          url: uri,
          headers: header,
          data: param,
      });
  } catch (err) {
      rtn = err.response;
  }
  return rtn.data;
}

app.get("/kakao", async function (req, res) {
  const param = qs.stringify({
      grant_type: "authorization_code",
      client_id: client_id,
      redirect_uri: redirect_uri,
      // client_secret: client_secret,
      code: req.query.code,
  });
  const header = {"content-type": "application/x-www-form-urlencoded"};
  var rtn = await call("POST", token_uri, param, header);
  console.log(rtn.access_token);
  // req.session.key = rtn.access_token;                                                                                                                      
  // res.status(302).redirect(`${origin}/demo.html`);
  // res.cookie("accessToken", rtn.access_token);
  res.json({"token" : rtn.access_token});
});


module.exports = app;