const Banco = require('./Banco');

class Login {
    constructor() {
        this._idUsuario = null; 
        this._emailLogin = '';
        this._senhaLogin = '';
    }


    async loginRead() {
        const conexao = Banco.getConexao(); 
        const SQL = 'SELECT idUsuario FROM Informacao_usuario WHERE email = ? AND senha = MD5(?);'; 
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._emailLogin, this._senhaLogin]);
            
            if (rows.length > 0) {
                return rows[0].idUsuario; 
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erro ao fazer login: ', error); 
            return null;
        }
    }


    get idUsuario() {
        return this._idUsuario;
    }
    
    set idUsuario(idUsuario) {
        this._idUsuario = idUsuario;
    }

    get emailLogin() {
        return this._emailLogin;
    }
    
    set emailLogin(emailLogin) {
        this._emailLogin = emailLogin;
    }

    
    get senhaLogin() {
        return this._senhaLogin;
    }
    
    set senhaLogin(senhaLogin) {
        this._senhaLogin = senhaLogin;
    }
    
}

module.exports = Login;
