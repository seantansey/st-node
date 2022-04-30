const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
})

module.exports = {
    query: ({ sql, params, callback }) => {
        return pool.query(sql, params, callback)
    },
    transact: ({ sql, data }) => {
        pool.connect((err, client, done) => {
            const abort = (err) => {
                if (err) {
                    console.log('Error in transaction', err.stack)
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                        }
                        done() // closes client connection
                    })
                }
                return !!err
            }
            client.query('BEGIN', (err) => {
                console.log('begin')
                if (abort(err)) return
                client.query(sql, data, (err, res) => {
                    if (abort(err)) return
                    client.query('COMMIT', (err) => {
                        console.log('commit')
                        if (err) {
                            console.log('Error commiting transaction', err.stack)
                        }
                        done()
                    })
                })
            })
        })
    }
}

