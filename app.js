require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const compression = require('compression')

const { apiKeyRouter } = require('./routes/api-keys')
const { healthRouter } = require('./routes/health')
const { messagesRouter } = require('./routes/messages')

const { authorizeAdmin } = require('./middleware/authorizeAdmin')
const { authorizeAPIKey } = require('./middleware/authorizeAPIKey')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.WEB_ADDRESS
}))
app.use(compression())


app.use('/api-key',authorizeAdmin, apiKeyRouter)
app.use('/health', healthRouter)
app.use('/messages', authorizeAPIKey, messagesRouter)

module.exports = app
