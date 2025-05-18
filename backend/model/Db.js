const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
};

async function connectToDatabase() {
    if (pool) return pool;

    try {
        
        pool = new Pool(config);
        // Testa a conexão
        await pool.query('SELECT NOW()');
        return pool;
    } catch (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err);
        console.error('Database configuration:', {
            user: config.user,
            host: config.host,
            port: config.port,
            database: config.database
        });
        throw new Error('Erro ao conectar ao PostgreSQL');
    }
}

function getDatabase() {
    if (!pool) {
        throw new Error('Banco de dados não conectado!');
    }
    return pool;
}

module.exports = { connectToDatabase, getDatabase };
