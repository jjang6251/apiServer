<sequelize test db 생성 방법>
config/config.js에서 test 환경 변수 부분을 설정한다.


(기존 db가 생성이 안되어 있다면)sequelize db:create --env test


(기존 db에 대해 models들을 만든 후) sequelize db:migrate --env test


* jest는 기본적으로 test 환경으로 설정한 후 진행된다.


jest를 통해서가 아닌 실제 로컬환경에서 test 환경 변수를 들어가고 싶다면 models/index.js 에서
const env = process.env.NODE_ENV || 'development';
development 부분을 test로 바꾸면 된다.


- npm test를 실행하기 위해서 package.json에서 이 부분을 추가한다.
"scripts": {
    "test": "jest --detectOpenHandles --forceExit"
  }
(--detectOpenHandles --forceExit 이 부분을 추가하는 이유는 본래는 데이터베이스와의 연결을 끊어주어야 하지만
이 부분을 추가함으로 인해 강제적으로 종료하게 만든다.)
