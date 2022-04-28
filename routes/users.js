const express = require('express')
const router = express.Router()
const db = require('../db')

// GET all users
router.get('/', (req, res, next) => {
  db.query({
    sql: 'SELECT * FROM users',
    callback: (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    }
  })
})

router.post('/', (req, res, next) => {
  db.transact({
    sql: 'INSERT INTO users (name, email) VALUES ($1, $2)',
    data: ['Donald Duck', 'thefuckingduck@duck.com']
  })

})

module.exports = router
