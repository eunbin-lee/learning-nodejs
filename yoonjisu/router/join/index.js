var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

// DATABASE SETTING
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'asdf1234',
  database: 'jsman',
});

connection.connect();

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../public/join.html'));
});

module.exports = router;
