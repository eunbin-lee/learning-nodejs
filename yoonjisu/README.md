# Learn Node.js

`Node.js 웹개발로 알아보는 백엔드 자바스크립트의 이해 - 인프런 윤지수 강사님`

<br>
<br>

## nodeJS + Express 웹서버 설정

1. `npm init`
2. `npm install express --save`
3. `npm install nodemon -g` : 자동으로 파일의 변화를 감지하여 서버를 재실행시켜주는 모듈

<br>

### Express 기반 웹서버 구동

> `app.listen('port', 콜백함수);`

```js
// app.js
var express = require('express');
var app = express();

app.listen(3000, function () {
  console.log('start, express server on port 3000');
});
```

<br>

### URL Routing 처리

> `app.get('path', 콜백함수)`

```js
// app.js
app.get('/', function (req, res) {
  res.send('<h1>hi friend!</h1>'); // 응답값
  res.sendFile(__dirname + 'public/main.html'); // get 요청 시 해당 파일을 클라이언트가 받게 됨
});
```

<br>

### static 디렉토리 설정

> `app.use(express.static('static 디렉토리'))`

```js
// app.js
app.use(express.static('public')); // public 하위의 파일들은 static으로 바로 내려받을 수 있음
```
