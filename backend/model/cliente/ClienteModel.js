class ClienteModel{
    constructor() {
        this._id_cliente = null;
        this._nome_cliente = null;
        this._email_cliente = null;
        this._senha_cliente = null;
        this._celular_cliente = null;
        this._nivel_acesso_cliente = null;
    }

    //setters

    set id_cliente(value) {
        this._id_cliente = value;
    }

    set nome_cliente(value) {
        this._nome_cliente = value;
    }

    set email_cliente(value) {
        this._email_cliente = value;
    }

    set senha_cliente(value) {
        this._senha_cliente = value;
    }

    set celular_cliente(value) {
        this._celular_cliente = value;
    }

    set nivel_acesso_cliente(value) {
        this._nivel_acesso_cliente = value;
    }

    //getters

    get id_cliente() {
        return this._id_cliente;
    }

    get nome_cliente() {
        return this._nome_cliente;
    }

    get email_cliente() {
        return this._email_cliente;
    }

    get senha_cliente() {
        return this._senha_cliente;
    }

    get celular_cliente() {
        return this._celular_cliente;
    }

    get nivel_acesso_cliente() {
        return this._nivel_acesso_cliente;
    }


}

module.exports = ClienteModel;