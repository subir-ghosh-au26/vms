exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('departments', {
        id: 'id', // This creates a primary key column named 'id' of type SERIAL
        name: { type: 'varchar(255)', notNull: true, unique: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('departments');
};