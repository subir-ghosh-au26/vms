exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('activity_log', {
        id: 'id',
        vehicle_id: {
            type: 'integer',
            notNull: true,
            references: '"vehicles"',
            onDelete: 'CASCADE', // If a vehicle is deleted, its logs are also deleted.
        },
        entry_time: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        exit_time: {
            type: 'timestamp with time zone',
            // This column is nullable. A NULL value means the car is currently inside.
        },
        entry_gate: { type: 'varchar(50)' },
        exit_gate: { type: 'varchar(50)' },
        // We can add guard IDs later when we have user authentication
        // entry_guard_id: { type: 'integer', references: '"users"' },
        // exit_guard_id: { type: 'integer', references: '"users"' },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('activity_log');
};