require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const compression = require('compression')

const { messagesRouter } = require('./routes/messages')
const { healthRouter } = require('./routes/health')
const { usersRouter } = require('./routes/users')
const { authenticationRouter } = require('./routes/authentication')
const { verifyToken } = require('./utils/token')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.WEB_ADDRESS
}))
app.use(compression())

app.use('/authenticate', authenticationRouter)
app.use('/health', healthRouter)
app.use('/messages', verifyToken, messagesRouter)
app.use('/users', verifyToken, usersRouter)

module.exports = app
