const express = require('express')
const router = express.Router()

const indexResponse = (req, res, next) => {
    res.send('API is running')
}

router.get('/', indexResponse)

module.exports = {
    indexRouter: router
}