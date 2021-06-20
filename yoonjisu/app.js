// Express 기반 웹서버 구동
var express = require('express');
var app = express();

app.listen(3000, function () {
  console.log('start, express server on port 3000');
});
