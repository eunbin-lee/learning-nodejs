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

<br>
<br>

## Request, Response 처리 기본

### POST 요청처리

`npm install body-parser --save` : 클라이언트 POST request data의 body로부터 파라미터를 편리하게 추출해주는 모듈

```js
// app.js
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // json 형태로 데이터가 올 때
app.use(bodyParser.urlencoded({ extended: true })); // json 외의 형태로 데이터가 올 때
```

<br>

### View engine을 활용한 응답처리

`npm install ejs --save`

> **View Engine**<br>
> 서버에서 처리한 데이터 결과값을 정적인 페이지(HTML 파일)에 보다 편리하게 출력해주기 위해 사용<br>
> 뷰 엔진에서 요구하는 형태로 템플릿 파일(문서)을 만들고, 해당 템플릿 문서에 서버에서 처리한 데이터를 전달하면 해당 데이터를 화면에 출력 가능

> **EJS**<br>
> Embedded JavaScript templating의 약어<br>
> 자바스크립트로 HTML 마크업을 생성할 수 있는 간단한 템플릿 언어

> **템플릿 엔진**<br>
> 템플릿 양식과 특정 데이터 모델에 따른 입력 자료를 합성하여 결과 문서를 출력하는 소프트웨어(또는 소프트웨어 컴포넌트)

```js
// app.js
app.set('view engine', 'ejs'); // view engine은 ejs라고 설정
```

```js
// views > email.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>email ejs template</title>
  </head>

  <body>
    <h1>Welcome !! <%= email %></h1>
    <p>정말로 반가워요 ^^</p>
  </body>
</html>
```

```js
// app.js
app.post('/email_post', function (req, res) {
  res.render('email.ejs', { email: req.body.email }); // email.ejs에 email 키값의 req.body.email 값을 넘겨 해당 값을 치환 후 클라이언트에 응답해줌
});
```

<br>

### JSON을 활용한 Ajax 처리

Ajax를 이용하여 브라우저의 새로고침 없이 서버에 데이터를 보내고 <br>
서버에서는 데이터가 유효한지 확인한 후 클라이언트에 응답값을 전송한다

```html
<!-- form.html -->
<body>
  <button class="ajaxsend">ajaxsend</button>
  <div class="result"></div>

  <script>
    document.querySelector('.ajaxsend').addEventListener('click', function () {
      var inputdata = document.forms[0].elements[0].value;
      sendAjax('http://localhost:3000/ajax_send_email', inputdata);
    });

    function sendAjax(url, data) {
      var data = { email: data };
      data = JSON.stringify(data); /* 1. 클라이언트의 form을 json 형태로 만듦 */
      var xhr = new XMLHttpRequest();

      xhr.open('POST', url); // 서버에서 app.post로 받기 때문에 POST로 전송
      xhr.setRequestHeader('Content-Type', 'application/json'); // 서버로 보낼 때 json 형태로 보내기 때문에 콘텐트 타입을 application/json으로 설정
      xhr.send(data); /* 2. send에 담아서 서버로 보냄 */

      xhr.addEventListener('load', function () {
        var result = JSON.parse(xhr.responseText);
        if (result.result !== 'ok') return;
        document.querySelector('.result').innerHTML = result.email;
      });
    }
  </script>
</body>
```

```js
// app.js
app.post('/ajax_send_email', function (req, res) {
  /* 3. ''의 url을 라우팅 후 콜백함수 실행 */ console.log(req.body.email);
  var responseData = { result: 'ok', email: req.body.email };
  res.json(responseData); /* 4. 결과값을 담아서 클라이언트로 전송 */
});
```

<br>
<br>

## Database 연동 기본

### MySQL 연동 설정

> **데이터베이스에 테이블 생성 후 데이터 저장하는 방법**<br>
>
> 1. mysql> CREATE DATABASE jsman;<br>
> 2. USE jsman;<br>
> 3. CREATE TABLE user(id INT PRIMARY KEY AUTO_INCREMENT, email VARCHAR(20) NOT NULL, name VARCHAR(30) NOT NULL, pw VARCHAR(30) NOT NULL);<br>
> 4. SHOW tables;<br>
> 5. INSERT INTO user(email, name, pw) VALUES ('crong@naver.com', 'crong', 'asdf');
> 6. SELECT \* FROM user;

<br>

`npm install mysql --save`

```js
// app.js
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'asdf1234',
  database: 'jsman',
});

connection.connect();
```

<br>

### MySQL 연동 구현

```js
// app.js
app.post('/ajax_send_email', function (req, res) {
  var email = req.body.email;
  var responseData = {};

  var query = connection.query(
    'select name from user where email="' + email + '"',
    function (err, rows) {
      if (err) throw err;
      if (rows[0]) {
        responseData.result = 'ok';
        responseData.name = rows[0].name;
      } else {
        responseData.result = 'none';
        responseData.name = '';
      }
      res.json(responseData); // 응답값을 콜백함수 안에 설정해야 비동기로 처리됨
    },
  );
});
```

<br>
<br>

## Router 개선 - 모듈화

### Routing 모듈화

```js
// router > main.js
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path'); // 상대 경로 설정

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/main.html'));
});

module.exports = router;
```

```js
// app.js
var main = require('./router/main');

app.use('/main', main); // 사용자가 '/main'으로 들어오면 main이라는 라우터로 가서 필요한 정보를 처리함
```

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

#### 참고 자료

[Express 안내서](https://expressjs.com/ko/guide/routing.html) <br>
[[Template Engine] 템플릿 엔진(Template Engine)이란](https://gmlwjd9405.github.io/2018/12/21/template-engine.html) <br>
[[스터디] EJS](https://velog.io/@mactto3487/%EC%8A%A4%ED%84%B0%EB%94%94-EJS) <br>
[[NODE 강의] View Engine / 미들웨어 란?](https://ninjaggobugi.tistory.com/10)<br>
[Express MySQL 연동 가이드](https://expressjs.com/en/guide/database-integration.html#mysql)<br>
