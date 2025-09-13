exports.up = pgm => {
    pgm.createTable('users', {
        id: 'id',
        username: { type: 'varchar(100)', notNull: true, unique: true },
        password_hash: { type: 'varchar(255)', notNull: true },
        role: { type: 'varchar(20)', notNull: true, default: 'GUARD' }, // 'ADMIN', 'GUARD'
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};
exports.down = pgm => { pgm.dropTable('users'); };