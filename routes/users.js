const express = require('express')
const router = express.Router()
const db = require('../db')

const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
})


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
    const { name, email } = req.body

    pool.connect()
      .then((client) => {
        return client
          .query('BEGIN')
          .then(() => {
            client.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email])
            .then(() => {
              client.query('COMMIT')
              .then(() => {
                res.status(201).json({ status: 'success' })
                client.release()
              })
            })
          })
          .catch((error) => {
            return client
              .query('ROLLBACK')
              .then(() =>{
                client.release()
              })
              .catch(() => {
                client.release()
              })
          })
      })
      
     

    // pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    //   if  (error) {
    //     throw error
    //   }
    //   res.status(201).send(results)
    // })
  // db.transact({
  //   sql: 'INSERT INTO users (name, email) VALUES ($1, $2)',
  //   data: ['Donald Duck', 'thefuckingduck@duck.com']
  // })

})

module.exports = router
