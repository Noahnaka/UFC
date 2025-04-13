const express = require('express');
const entrarEventoControle = require('../Controllers/entrarEventoControle');

module.exports = class roteadorEntrarEvento {
    constructor() {
        this._router = express.Router();
        this._entrarEventoControle = new entrarEventoControle();
    }

    criarRotasEntrarEvento() {
        this._router.get('/',
            this._entrarEventoControle.entrar_evento_read
        )
        this._router.post('/',
            this._entrarEventoControle.entrar_evento_create
        )

        return this._router;
    }
}