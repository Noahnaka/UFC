const express = require('express');
const eventoControle = require('../Controllers/eventoControle');

module.exports = class roteadorEvento {
    constructor() {
        this._router = express.Router();
        this._eventoControle = new eventoControle();
    }

    criarRotasEvento() {
        this._router.post('/',
            this._eventoControle.evento_create_control
        )

        return this._router;
    }
}