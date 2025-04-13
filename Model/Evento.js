const Banco = require('./Banco');

class Evento {
    constructor() {
        this._idEventos = null; 
        this._nomeEvento = ''; 
        this._codigoEvento = '';
        this._teams = '';
    }


    async create() {
        const conexao = Banco.getConexao(); 
        const SQL = 'INSERT INTO eventos (nomeEvento, codigoEvento, times) VALUES (?, ?, ?);'; 
        try {
            console.log(this._nomeEvento, this._codigoEvento, this._teams);
            const teamsJSON = JSON.stringify(this._teams); 
            const [result] = await conexao.promise().execute(SQL, [this._nomeEvento, this._codigoEvento, teamsJSON]); 
            this._idEventos = result.insertId; 
            return result.affectedRows > 0; 
        } catch (error) {
            console.error('Erro ao criar o evento:', error); 
            return false; 
        }
    }


    get idEventos() {
        return this._idEventos;
    }

    set idEventos(idEventos) {
        this._idEventos = idEventos;
    }
    
    get nomeEvento() {
        return this._nomeEvento;
    }
    
    set nomeEvento(nomeEvento) {
        this._nomeEvento = nomeEvento;
    }
    
    get codigoEvento() {
        return this._codigoEvento;
    }
    
    set codigoEvento(codigoEvento) {
        this._codigoEvento = codigoEvento;
    }

    get teams() {
        return this._teams;
    }
    
    set teams(teams) {
        this._teams = teams;
    }
    
 
}

module.exports = Evento;
