/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('api_keys', {
        id: 'id',
        key: {
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
    pgm.dropTable('api_keys', {
        ifExists: true,
        cascade: true
    })
};
