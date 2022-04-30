const express = require('express')
const router = express.Router()
const db = require('../db')


// GET all users
router.get('/', (req, res, next) => {
  const query = {
    text: 'SELECT * FROM users',
  }

  db.query(query)
    .then(({ rows }) => {
      res.status(200).json(rows)
    })
    .catch((error) => next(error))
})


// GET user by id
router.get('/:id', (req, res, next) => {
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [req.params.id]
  }

  db.query(query)
    .then(({ rows }) => {
      res.status(200).json(rows)
    })
    .catch((error) => next(error))
})



router.post('/', (req, res, next) => {
    const { name, email } = req.body

    const query = {
      text: 'INSERT INTO users (name, email) VALUES ($1, $2)',
      values: [name, email]
    }
    db.transact(query)
      .then(() => {
        res.status(201).json({ status: 'success' })
      })
      .catch((error) => {
        next(error)
      })
})

module.exports = router
