const express = require('express');
const ufcControle = require('../Controllers/ufcControle');

module.exports = class roteadorUFC {
    constructor() {
        this._router = express.Router();
        this._ufcControle = new ufcControle();
    }

    criarRotasUFC() {
        this._router.get('/eventos',
            this._ufcControle.ufc_get_events
        )

        this._router.get('/eventos/bet',
            this._ufcControle.ufc_get_events_by_id
        )

        this._router.get('/bets',
            this._ufcControle.ufc_get_bets
        )

        this._router.post('/',
            this._ufcControle.ufc_create_bet
        )

        this._router.post('/sync',
            this._ufcControle.ufc_sync_events
        )

        return this._router;
    }
}