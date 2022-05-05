require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const { messageRouter } = require('./routes/message')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:8080'
}))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/message', messageRouter)

module.exports = app
