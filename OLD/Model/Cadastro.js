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
