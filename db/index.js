const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
})

module.exports = {
    query: (query) => {
        return pool.query(query)
    },
    transact: (query) => {
        return pool.connect()
            .then((client) => {
                return client.query('BEGIN')
                    .then(() => {
                        return client.query(query)
                        .then(() => {
                            return client.query('COMMIT')
                            .then((result) => {
                                client.release()
                                return result
                            })
                        })
                })
                .catch((error) => {
                    return client.query('ROLLBACK')
                        .then(() => {
                            throw new Error(error)
                        })
                        .catch((error) => {
                            client.release()
                            throw new Error(error)
                        })
                    })
            })
    }     
}

