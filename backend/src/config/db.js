const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Optional: Add SSL configuration for production environments
    // ssl: {
    //   rejectUnauthorized: false
    // }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};