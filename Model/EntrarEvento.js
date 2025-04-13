const Banco = require('./Banco');

class EntrarEvento {
    constructor() {
        this._idEntrarEvento = null; 
        this._idUsuario = null; 
        this._codEvento = '';
    }


    async entrarEventoRead() {
        const conexao = Banco.getConexao(); 
        const SQL = 'SELECT idEventos FROM eventos WHERE codigoEvento = ?;'; 
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._codEvento]);
            
            if (rows.length > 0) {
                return rows[0].idEventos; 
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao achar entrar evento: ', error); 
            return null;
        }
    }

    async entrarEventoCreate(){
        const conexao = Banco.getConexao(); 
        const SQL = 'INSERT INTO eventoentrado (idUsuario, idEvento) VALUES (?, ?);'; 
        try {
            const [result] = await conexao.promise().execute(SQL, [this._idUsuario, this._codEvento]); 
            this._idEventos = result.insertId; 
            return result.affectedRows > 0; 
        } catch (error) {
            console.error('Erro ao entrar no evento:', error); 
            return false; 
        }
    }
    get idEntrarEvento() {
        return this._idEntrarEvento;
    }
    
    set idEntrarEvento(idEntrarEvento) {
        this._idEntrarEvento = idEntrarEvento;
    }

    get idUsuario() {
        return this._idUsuario;
    }
    
    set idUsuario(idUsuario) {
        this._idUsuario = idUsuario;
    }

    get codEvento() {
        return this._codEvento;
    }
    
    set codEvento(codEvento) {
        this._codEvento = codEvento;
    }
    
}

module.exports = EntrarEvento;
