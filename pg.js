const { Pool } = require('pg')

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'personal',
    password: 'password',
    port: 5432
})

module.exports = pool

