const { Pool } = require('pg')

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'personal',
    password: 'password',
    port: 5432
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

