class UfcModel{
    constructor() {
        this._id_ufc = null;
        this._id_usuario = null;
        this._id_evento = null;
        this._vencedor = null;
        this._metodo = null;
        this._rodada = null;
        this._evento = null;
        this._data = null;
        this._local = null;
        this._lutas = null;
    }

    //setters

    set id_ufc(value) {
        this._id_ufc = value;
    }

    set id_usuario(value) {
        this._id_usuario = value;
    }

    set id_evento(value) {
        this._id_evento = value;
    }

    set vencedor(value) {
        this._vencedor = value;
    }

    set metodo(value) {
        this._metodo = value;
    }

    //getters

    get id_ufc() {
        return this._id_ufc;
    }

    get id_usuario() {
        return this._id_usuario;
    }

    get id_evento() {
        return this._id_evento;
    }

    get vencedor() {
        return this._vencedor;
    }

    get metodo() {
        return this._metodo;
    }

    get rodada() {
        return this._rodada;
    }

    get evento() {
        return this._evento;
    }

    get data() {
        return this._data;
    }
    
    
}

module.exports = UfcModel;