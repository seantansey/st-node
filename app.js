require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const compression = require('compression')

const { indexRouter } = require('./routes')
const { messagesRouter } = require('./routes/messages')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: [
        'https://seantansey.com',
        'https://www.seantansey.com'
    ]
}))
app.use(compression())

app.use('/', indexRouter)
app.use('/messages', messagesRouter)

module.exports = app
