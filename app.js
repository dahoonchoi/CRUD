var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log("Connected to mongod server");
})

mongoose.connect('mongodb://localhost/MongoDB');

var Book = require('./models/book')

var port = process.env.PORT || 8080;

var router = require('./routes' ) (app, Book);

var server = app.listen(port, function(){
  console.log("Express sever has started on port" + port)
})
