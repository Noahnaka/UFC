const express = require('express');
const cadastroControle = require('../Controllers/cadastroControle');

module.exports = class roteadorCadastro {
    constructor() {
        this._router = express.Router();
        this._cadastroControle = new cadastroControle();
    }

    criarRotasCadastro() {
        this._router.post('/',
            this._cadastroControle.cadastro_create,
        )

        return this._router;
    }
}