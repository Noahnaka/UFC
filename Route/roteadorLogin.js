const express = require('express');
const loginControle = require('../Controllers/loginControle');

module.exports = class roteadorLogin {
    constructor() {
        this._router = express.Router();
        this._loginControle = new loginControle();
    }

    criarRotasLogin() {
        this._router.post('/',
            this._loginControle.login_read
        )

        return this._router;
    }
}