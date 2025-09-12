exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('employees', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
        employee_id_str: { type: 'varchar(50)', notNull: true, unique: true },
        department_id: {
            type: 'integer',
            notNull: true,
            references: '"departments"', // This sets up the foreign key relationship
            onDelete: 'SET NULL', // If a department is deleted, set this field to null
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('employees');
};