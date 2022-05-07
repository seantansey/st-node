const express = require('express')
const router = express.Router()

const indexResponse = (req, res, next) => {
    res.send('st-web')
}

router.get('/', indexResponse)

module.exports = {
    indexRouter: router
}