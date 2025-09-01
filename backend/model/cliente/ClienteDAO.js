const ClienteModel = require('./ClienteModel');
const { getConexao } = require('../Db');
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
        const pool = getConexao();
        try {
            const [rows] = await pool.promise().execute('SELECT * FROM unibet.tbl_cliente');
            return rows;
        } catch (err) {
            throw new Error('Erro ao buscar cliente');
        }
    };

    static getById = async (id_cliente) => {
        const pool = getConexao();

        if (!id_cliente) {
            throw new Error('O campo id_cliente é obrigatório');
        }
    
        try {
            const query = `SELECT * FROM unibet.tbl_cliente WHERE id_cliente = ?`;
            const [rows] = await pool.promise().execute(query, [id_cliente]);
            return rows[0]; 
        } catch (err) {
            throw new Error('Erro ao buscar cliente: ' + err.message);
        } 
    };

    create = async () => {
        const pool = getConexao();
        const hashedPassword = await ClienteDAO.hashPassword(this._senha_cliente);

        const query = `
        INSERT INTO unibet.tbl_cliente (nome_cliente, email_cliente, senha_cliente, celular_cliente, nivel_acesso_cliente)
        VALUES (?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await pool.promise().execute(query, [
                this._nome_cliente,
                this._email_cliente.toLowerCase().trim(),
                hashedPassword,
                this._celular_cliente,
                'eco',
            ]);
            
            if (result.affectedRows > 0) {
                this._id_cliente = result.insertId;
                return true;
            }
            return false;
        } catch (err) {
            throw new Error('Erro ao criar cliente: ' + err);
        }
    };

    delete = async () => {
        const pool = getConexao();
        const query = `
            DELETE FROM unibet.tbl_cliente 
            WHERE id_cliente = ?
        `;

        try {
            const [result] = await pool.promise().execute(query, [this._id_cliente]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao deletar conta cliente');
        }
    };
     
    atualizarStatus = async () => {
        const pool = getConexao();

        const query = `
            UPDATE unibet.tbl_cliente
            SET status_cliente = NOT status_cliente
            WHERE id_cliente = ?
        `;
    
        try {
            const [result] = await pool.promise().execute(query, [this._id_cliente]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar status');
        }
    };

    updateAcesso = async () => {
        const pool = getConexao();
        const query = `UPDATE unibet.tbl_cliente SET nivel_acesso_cliente = ? WHERE id_cliente = ?`;
        const [result] = await pool.promise().execute(query, [this._nivel_acesso_cliente, this._id_cliente]);
        return result.affectedRows > 0;
    };

    login = async () => {
        const pool = getConexao();
        const query = 'SELECT * FROM unibet.tbl_cliente WHERE email_cliente = ?';
        
        try {
            const [rows] = await pool.promise().execute(query, [this._email_cliente.toLowerCase().trim()]);
            const cliente = rows[0];
            
            if (!cliente) throw new Error('Credenciais inválidas');

            const passwordMatch = await ClienteDAO.comparePassword(this._senha_cliente, cliente.senha_cliente);
            if (!passwordMatch) throw new Error('Credenciais inválidas');

            this._id_cliente = cliente.id_cliente;
            this._nome_cliente = cliente.nome_cliente;
            this._email_cliente = cliente.email_cliente;
            this._celular_cliente = cliente.celular_cliente;
            this._nivel_acesso_cliente = cliente.nivel_acesso_cliente;
            
            return true;
        } catch (err) {
            throw new Error('Erro ao realizar login: ' + err);
        }
    };

    static isEmailTaken = async (email_cliente) => {
        const pool = getConexao();
        try {
            const [rows] = await pool.promise().execute(
                'SELECT id_cliente FROM unibet.tbl_cliente WHERE email_cliente = ?', 
                [email_cliente.toLowerCase().trim()]
            );
            return rows.length > 0;
        } catch (err) {
            throw new Error('Erro ao verificar e-mail duplicado');
        }
    };

    getPontos = async (id_cliente) => {
        const pool = getConexao();
        const query = `SELECT pontos_cliente FROM unibet.tbl_cliente WHERE id_cliente = ?`;
        const [rows] = await pool.promise().execute(query, [id_cliente]);
        return rows[0];
    };

}

module.exports = ClienteDAO;