/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: 'id',
        username: {
            type: 'varchar(30)',
            notNull: true
        },
        password: {
            type: 'varchar(100)',
            notNull: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('users', {
        ifExists: true,
        cascade: true
    })
};
