const UfcModel = require('./ufcModel');
const { getConexao } = require('../Db');
const axios = require('axios');
const cheerio = require('cheerio');

class UfcDAO extends UfcModel {

    UFC_get_payload = async () => {
        const pool = getConexao();
        try{
            const [usuarios] = await pool.promise().execute('SELECT COUNT(*) as total FROM unibet.tbl_cliente');
            const [apostas] = await pool.promise().execute('SELECT COUNT(*) as total FROM unibet.tbl_apostas_ufc');
            
            return {
                total_usuarios: usuarios[0].total,
                total_apostas: apostas[0].total
            };
        }catch (err) {
            throw new Error('Erro ao buscar apostas UFC');
        }
    }

    UFC_read_all = async () => {
        const pool = getConexao();
        try {
            const [rows] = await pool.promise().execute('SELECT * FROM unibet.tbl_eventos_ufc');
            return rows;
        } catch (err) {
            throw new Error('Erro ao buscar apostas UFC');
        }
    };

    update_fight = async() => {
        const pool = getConexao();
        
        const query = `
            UPDATE unibet.tbl_lutas_ufc 
            SET red_fighter = ?, blue_fighter = ?, categoria = ?, titulo = ?
            WHERE id_luta = ?
        `;
        
        try {
            const [result] = await pool.promise().execute(query, [
                this._red_fighter,
                this._blue_fighter,
                this._categoria,
                this._titulo,
                this._id_luta
            ]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar luta: ' + err);
        }
    };

    delete_evento = async() => { 
        const pool = getConexao();
        
        const query = `
            DELETE from unibet.tbl_eventos_ufc WHERE id_evento = ?
        `;
        
        try {
            const [result] = await pool.promise().execute(query, [
                this._id_evento
            ]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar evento: ' + err);
        }
    };

    delete_fight = async() => { 
        const pool = getConexao();
        
        const query = `
            DELETE from unibet.tbl_lutas_ufc WHERE id_luta = ?
        `;
        
        try {
            const [result] = await pool.promise().execute(query, [
                this._id_luta
            ]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar luta: ' + err);
        }
    };

    update_event_status = async(id_evento) => {
        const pool = getConexao();
        
        const query = `
            UPDATE unibet.tbl_eventos_ufc 
            SET status_evento = !status_evento
            WHERE id_evento = ?
        `;
        
        try {
            const [result] = await pool.promise().execute(query, [
                id_evento
            ]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao atualizar status evento: ' + err);
        }
    };

    UFC_read_fights_by_id = async (id_evento) => {
        const pool = getConexao();

        if (!id_evento) {
            throw new Error('O campo id_evento é obrigatório');
        }
    
        try {
            const query = `SELECT * FROM unibet.tbl_lutas_ufc WHERE id_evento = ?`;
            const [rows] = await await pool.promise().execute(query, [id_evento]);
            return rows; 
        } catch (err) {
            throw new Error('Erro ao buscar lutas: ' + err.message);
        }
    };

    static UFC_read_by_id = async (id_ufc) => {
        const pool = getConexao();

        if (!id_ufc) {
            throw new Error('O campo id_ufc é obrigatório');
        }
    
        try {
            const query = `SELECT * FROM unibet.tbl_eventos_ufc WHERE id_evento = ?`;
            const [rows] = await pool.query(query, [id_ufc]);
            return rows[0]; 
        } catch (err) {
            throw new Error('Erro ao buscar UFC: ' + err.message);
        }
    };

    create_bet = async () => {
        const pool = getConexao();

        const query = `
        INSERT INTO unibet.tbl_apostas_ufc (id_cliente, id_evento, id_luta, vencedor, metodo, rodada)
        VALUES (?, ?, ?, ?, ?, ?)
        `;

        try {
            const [result] = await pool.promise().execute(query, [
                this._id_cliente,
                this._id_evento,
                this._id_luta,
                this._vencedor,
                this._metodo,
                this._rodada
            ]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao criar aposta: ' + err);
        }
    };

    ufc_winner = async () => {
        const pool = getConexao();
        const query = `
        INSERT INTO unibet.tbl_vencedores_ufc (id_evento, id_luta, vencedor, rodada, metodo)
        VALUES (?, ?, ?, ?, ?)
        `;

        console.log(this._id_evento, this._id_luta, this._vencedor, this._rodada, this._metodo);

        try {
            const [result] = await pool.promise().execute(query, [this._id_evento, this._id_luta, this._vencedor, this._rodada, this._metodo]);
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao criar vencedor: ' + err);
        }
    }

    UFC_read_bets_by_user = async () => {
        const pool = getConexao();
        const query = `SELECT * FROM unibet.tbl_apostas_ufc WHERE id_cliente = ?`;
        const [result] = await pool.promise().execute(query, [this._id_cliente]);
        return result;
    }

    ufc_create_fight = async () => {
        const pool = getConexao();
        const query = `
        INSERT INTO unibet.tbl_lutas_ufc (id_evento, red_fighter, blue_fighter, categoria, titulo)
        VALUES (?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await pool.promise().execute(query, [this._id_evento, this._red_fighter, this._blue_fighter, this.categoria, this._titulo]);   
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao criar luta: ' + err);
        }
    }

    ufc_read_odds_by_id = async () => {
        const pool = getConexao();
        const query = `SELECT * FROM unibet.tbl_apostas_ufc WHERE id_luta = ?`;
        const [result] = await pool.promise().execute(query, [this._id_luta]);
        console.log(result);
        return result;
    }

    ufc_create_event = async () => {
        const pool = getConexao();
        const query = `
        INSERT INTO unibet.tbl_eventos_ufc (nome_evento, local_evento, data_evento)
        VALUES (?, ?, ?)
        `;
        try {
            const [result] = await pool.promise().execute(query, [this._nome_evento, this._local_evento, this._data_evento]);   
            return result.affectedRows > 0;
        } catch (err) {
            throw new Error('Erro ao criar evento: ' + err);
        }
    }


    login = async () => {
        const pool = getConexao();
        const query = 'SELECT * FROM techfala2.tbl_conta_cliente WHERE email_conta_cliente = ?';
        
        try {
            const result = await pool.query(query, [this._email_conta_cliente]);
            const contaCliente = result.rows[0];
            
            if (!contaCliente) throw new Error('Credenciais inválidas');

            const passwordMatch = await ContaClienteDAO.comparePassword(this._senha_conta_cliente, contaCliente.senha_conta_cliente);
            if (!passwordMatch) throw new Error('Credenciais inválidas');

            this._id_cliente = contaCliente.id_cliente;
            this._nome_conta_cliente = contaCliente.nome_conta_cliente;
            this._sobrenome_conta_cliente = contaCliente.sobrenome_conta_cliente;
            this._email_conta_cliente = contaCliente.email_conta_cliente;
            this._cnpj_conta_cliente = contaCliente.cnpj_conta_cliente;
            this.celular_conta_cliente = contaCliente.celular_conta_cliente;
            this._status_conta_cliente = contaCliente.status_conta_cliente;
            
            return true;
        } catch (err) {
            throw new Error('Erro ao realizar login: ' + err);
        }
    };

    static isEmailTaken = async (email_conta_cliente) => {
        const pool = getConexao();
        try {
            const result = await pool.query(
                'SELECT id_cliente FROM techfala2.tbl_conta_cliente WHERE email_conta_cliente = ?', 
                [email_conta_cliente.toLowerCase().trim()]
            );
            return result.rows.length > 0;
        } catch (err) {
            throw new Error('Erro ao verificar e-mail duplicado');
        }
    };
}

module.exports = UfcDAO;