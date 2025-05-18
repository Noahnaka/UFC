const ClienteModel = require('./ClienteModel');
const { getDatabase } = require('../Db');
const bcrypt = require('bcrypt');

class ClienteDAO extends ClienteModel {

    static hashPassword = (password) => {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    };

    static comparePassword = (plainPassword, hashedPassword) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    };

    static getAll = async () => {
        const pool = getDatabase();
        try {
            const result = await pool.query('SELECT * FROM unibet.tbl_cliente');
            return result.rows;
        } catch (err) {
            throw new Error('Erro ao buscar cliente');
        }
    };

    static getById = async (id_cliente) => {
        const pool = getDatabase();

        if (!id_cliente) {
            throw new Error('O campo id_cliente é obrigatório');
        }
    
        try {
            const query = `SELECT * FROM unibet.tbl_cliente WHERE id_cliente = $1`;
            const result = await pool.query(query, [id_cliente]);
            return result.rows[0]; 
        } catch (err) {
            throw new Error('Erro ao buscar cliente: ' + err.message);
        }
    };

    create = async () => {
        const pool = getDatabase();
        const hashedPassword = await ClienteDAO.hashPassword(this._senha_cliente);

        const query = `
        INSERT INTO unibet.tbl_cliente (nome_cliente, email_cliente, senha_cliente, celular_cliente)
        VALUES ($1, $2, $3, $4) 
        ;
        `;
        try {
            const result = await pool.query(query, [
                this._nome_cliente,
                this._email_cliente.toLowerCase().trim(),
                hashedPassword,
                this._celular_cliente,
            ]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao criar cliente: ' + err);
        }
    };

    delete = async () => {
        const pool = getDatabase();
        const query = `
            DELETE FROM unibet.tbl_cliente 
            WHERE id_cliente = $1
            RETURNING id_cliente
        `;

        try {
            const result = await pool.query(query, [this._id_cliente]);
            return result.rowCount > 0;
        } catch (err) {
            throw new Error('Erro ao deletar conta cliente');
        }
    };
     
    atualizarStatus = async () => {
        const pool = getDatabase();

        const query = `
            UPDATE unibet.tbl_cliente
            SET status_cliente = NOT status_cliente
            WHERE id_cliente = $1
            RETURNING id_cliente
        `;
    
        try {
            const result = await pool.query(query, [this._id_cliente]);
            return result.rowCount > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar status');
        }
    };

    /*

    update = async () => {
        const pool = getDatabase();
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (this._name) {
            updates.push(`name = $${paramCount}`);
            values.push(this._name);
            paramCount++;
        }
        if (this._email) {
            updates.push(`email = $${paramCount}`);
            values.push(this._email);
            paramCount++;
        }
        if (this._password) {
            updates.push(`password = $${paramCount}`);
            values.push(await ContaClienteDAO.hashPassword(this._password));
            paramCount++;
        }

        if (updates.length === 0) return false;

        values.push(this._id);
        const query = `
            UPDATE admin 
            SET ${updates.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id
        `;

        try {
            const result = await pool.query(query, values);
            return result.rowCount > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar administrador');
        }
    };
 
    patch = async () => {
        const pool = getDatabase();
        const query = `
            UPDATE admin 
            SET image = $1
            WHERE id = $2
            RETURNING id
        `;

        try {
            const result = await pool.query(query, [this._image, this._id]);
            return result.rowCount > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar a foto do administrador');
        }
    };

    delete = async () => {
        const pool = getDatabase();
        const query = `
            DELETE FROM admin 
            WHERE id = $1
            RETURNING id
        `;

        try {
            const result = await pool.query(query, [this._id]);
            return result.rowCount > 0;
        } catch (err) {
            throw new Error('Erro ao deletar administrador');
        }
    };

    static getAll = async () => {
        const pool = getDatabase();
        try {
            const result = await pool.query('SELECT * FROM admin');
            return result.rows;
        } catch (err) {
            throw new Error('Erro ao buscar administradores');
        }
    };

    static getById = async (id) => {
        if (!id) throw new Error('O campo "id" é obrigatório');
        const pool = getDatabase();
        try {
            const result = await pool.query('SELECT * FROM admin WHERE id = $1', [id]);
            return result.rows[0];
        } catch (err) {
            throw new Error('Erro ao buscar administrador');
        }
    };

    */

    login = async () => {
        const pool = getDatabase();
        const query = 'SELECT * FROM unibet.tbl_cliente WHERE email_cliente = $1';
        
        try {
            const result = await pool.query(query, [this._email_cliente]);
            const cliente = result.rows[0];
            
            if (!cliente) throw new Error('Credenciais inválidas');

            const passwordMatch = await ClienteDAO.comparePassword(this._senha_cliente, cliente.senha_cliente);
            if (!passwordMatch) throw new Error('Credenciais inválidas');

            this._id_cliente = cliente.id_cliente;
            this._nome_cliente = cliente.nome_cliente;
            this._email_cliente = cliente.email_cliente;
            this._celular_cliente = cliente.celular_cliente;
            
            return true;
        } catch (err) {
            throw new Error('Erro ao realizar login: ' + err);
        }
    };

    static isEmailTaken = async (email_cliente) => {
        const pool = getDatabase();
        try {
            const result = await pool.query(
                'SELECT id_cliente FROM unibet.tbl_cliente WHERE email_cliente = $1', 
                [email_cliente.toLowerCase().trim()]
            );
            return result.rows.length > 0;
        } catch (err) {
            throw new Error('Erro ao verificar e-mail duplicado');
        }
    };
}

module.exports = ClienteDAO;