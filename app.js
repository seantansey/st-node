require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messageRouter = require('./routes/message')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:8080'
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/message', messageRouter);

module.exports = app;
