class UfcModel{
    constructor() {
        this._id_ufc = null;
        this._idUsuario = null;
        this._id_evento = null;
        this._id_luta = null;
        this._vencedor = null;
        this._metodo = null;
        this._rodada = null;
        this._evento = null;
        this._data = null;
        this._local = null;
        this._lutas = null;
        this._nome_evento = null;
        this._local_evento = null;
        this._data_evento = null;
        this._red_fighter = null;
        this._blue_fighter = null;
        this._categoria = null;
        this._titulo = null;
        this._id_cliente = null;
        this._id_ufc = null;
        this._id_evento = null;
        this._id_luta = null;
        this._vencedor = null;
        this._metodo = null;
        this._rodada = null;
        this._evento = null;
        this._data = null;
    }

    //setters

    set id_ufc(value) {
        this._id_ufc = value;
    }
    

    set idUsuario(value) {
        this._idUsuario = value;
    }

    set id_evento(value) {
        this._id_evento = value;
    }

    set id_luta(value) {
        this._id_luta = value;
    }

    set vencedor(value) {
        this._vencedor = value;
    }

    set metodo(value) {
        this._metodo = value;
    }

    set rodada(value) {
        this._rodada = value;
    }

    set nome_evento(value) {
        this._nome_evento = value;
    }

    set local_evento(value) {
        this._local_evento = value;
    }

    set data_evento(value) {
        this._data_evento = value;
    }

    set red_fighter(value) {
        this._red_fighter = value;
    }

    set blue_fighter(value) {
        this._blue_fighter = value;
    }

    set categoria(value) {
        this._categoria = value;
    }

    set titulo(value) {
        this._titulo = value;
    }

    set local(value) {
        this._local = value;
    }

    set lutas(value) {
        this._lutas = value;
    }

    set id_cliente(value) {
        this._id_cliente = value;
    }

    //getters

    get id_ufc() {
        return this._id_ufc;
    }

    get idUsuario() {
        return this._idUsuario;
    }

    get id_evento() {
        return this._id_evento;
    }

    get id_luta() {
        return this._id_luta;
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

    get nome_evento() {
        return this._nome_evento;
    }

    get local_evento() {
        return this._local_evento;
    }

    get data_evento() {
        return this._data_evento;
    }

    get red_fighter() {
        return this._red_fighter;
    }

    get blue_fighter() { 
        return this._blue_fighter;
    }

    get categoria() {
        return this._categoria;
    }

    get titulo(){
        return this._titulo;
    }
    
    get local() {
        return this._local;
    }

    get lutas() {
        return this._lutas;
    }

    get id_cliente() {
        return this._id_cliente;
    }
}

module.exports = UfcModel;