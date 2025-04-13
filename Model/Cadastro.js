const Banco = require('./Banco');

class Cadastro {
    constructor() {
        this._idUsuario = null; 
        this._nomeCadastro = ''; 
        this._emailCadastro = '';
        this._senhaCadastro = '';
        this._telefoneCadastro = '';
        this._nascimentoCadastro = '';
    }


    async create() {
        const conexao = Banco.getConexao(); 
        const SQL = 'INSERT INTO usuarios (nome, email, senha, telefone, nascimento) VALUES (?, ?, MD5(?), ?, ?);'; 
        try {
            const [result] = await conexao.promise().execute(SQL, [this._nomeCadastro, this._emailCadastro, this._senhaCadastro, this._telefoneCadastro, this._nascimentoCadastro]); 
            this._idUsuario = result.insertId; 
            return result.affectedRows > 0; 
        } catch (error) {
            console.error('Erro ao criar o cadastro:', error); 
            return false; 
        }
    }


    get idUsuario() {
        return this._idUsuario;
    }
    
    set idUsuario(idUsuario) {
        this._idUsuario = idUsuario;
    }
    
    get nomeCadastro() {
        return this._nomeCadastro;
    }
    
    set nomeCadastro(nomeCadastro) {
        this._nomeCadastro = nomeCadastro;
    }
    
    get emailCadastro() {
        return this._emailCadastro;
    }
    
    set emailCadastro(emailCadastro) {
        this._emailCadastro = emailCadastro;
    }

    get telefoneCadastro() {
        return this._telefoneCadastro;
    }
    
    set telefoneCadastro(telefoneCadastro) {
        this._telefoneCadastro = telefoneCadastro;
    }
    
    get senhaCadastro() {
        return this._senhaCadastro;
    }
    
    set senhaCadastro(senhaCadastro) {
        this._senhaCadastro = senhaCadastro;
    }
    
    get nascimentoCadastro() {
        return this._nascimentoCadastro;
    }
    
    set nascimentoCadastro(nascimentoCadastro) {
        this._nascimentoCadastro = nascimentoCadastro;
    }
}

module.exports = Cadastro;
