const express = require('express')
const router = express.Router()

const healthResponse = (req, res, next) => {
    res.status(200).send('Ok');
}

router.get('/', healthResponse)

module.exports = {
    healthRouter: router
}