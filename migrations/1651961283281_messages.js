/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('messages', {
        id: 'id',
        name: {
            type: 'varchar(100)',
            notNull: true
        },
        email: {
            type: 'varchar(100)',
            notNull: true
        },
        subject: {
            type: 'varchar(100)',
            notNull: true
        },
        message: {
            type: 'text',
            notNull: true
        },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('messages', {
        ifExists: true,
        cascade: true
    })
};
