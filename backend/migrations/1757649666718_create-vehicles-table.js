exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('vehicles', {
        id: 'id',
        vehicle_number: { type: 'varchar(20)', notNull: true, unique: true },
        model: { type: 'varchar(100)', notNull: true },
        type: { type: 'varchar(20)', notNull: true }, // e.g., 'CAR', 'BIKE', 'DEPT_CAR'
        status: { type: 'varchar(20)', notNull: true, default: 'ACTIVE' }, // e.g., 'ACTIVE', 'INACTIVE'
        qr_code_id: { type: 'uuid', notNull: true, unique: true, default: pgm.func('gen_random_uuid()') },
        owner_id: {
            type: 'integer',
            references: '"employees"',
            onDelete: 'SET NULL',
        },
        department_id: {
            type: 'integer',
            references: '"departments"',
            onDelete: 'SET NULL',
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('vehicles');
};