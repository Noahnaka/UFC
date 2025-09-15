const AdminModel = require('./AdminModel');
const { getConexao } = require('../Db');
const bcrypt = require('bcrypt');

class AdminDAO extends AdminModel {

    static hashPassword = (password) => {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    };

    static comparePassword = (plainPassword, hashedPassword) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    };

    create = async () => {
        const pool = getConexao();
        const hashedPassword = await AdminDAO.hashPassword(this._senha_admin);

        const query = `
        INSERT INTO tbl_admin (email_admin, senha_admin)
        VALUES (?, ?)
        `;
        try {
            const [result] = await pool.promise().execute(query, [
                this._email_admin.toLowerCase().trim(),
                hashedPassword,
            ]);
            
            if (result.affectedRows > 0) {
                this._id_admin = result.insertId;
                return true;
            }
            return false;
        } catch (err) {
            throw new Error('Erro ao criar admin: ' + err);
        }
    };

    login = async () => {
        const pool = getConexao();
        const query = 'SELECT * FROM tbl_admin WHERE email_admin = ?';
        
        try {
            const [rows] = await pool.promise().execute(query, [this._email_admin.toLowerCase().trim()]);
            const admin = rows[0];
            
            if (!admin) throw new Error('Credenciais inválidas');

            const passwordMatch = await AdminDAO.comparePassword(this._senha_admin, admin.senha_admin);
            if (!passwordMatch) throw new Error('Credenciais inválidas');

            this._id_admin = admin.id_admin;
            this._email_admin = admin.email_admin;
            
            return true;
        } catch (err) {
            throw new Error('Erro ao realizar login: ' + err);
        }
    };

    static isEmailTaken = async (email_admin) => {
        const pool = getConexao();
        try {
            const [rows] = await pool.promise().execute(
                'SELECT id_admin FROM tbl_admin WHERE email_admin = ?',
                [email_admin.toLowerCase().trim()]
            );
            return rows.length > 0;
        } catch (err) {
            throw new Error('Erro ao verificar e-mail duplicado');
        }
    };
}

module.exports = AdminDAO;