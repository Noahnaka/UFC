const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = class MeuTokenJWT {
    constructor() {
        this._key_conta_master = process.env.KEY_MASTER;
        this._key_conta_socio = process.env.KEY_SOCIO;
        this._key_conta_cliente = process.env.KEY_CLIENTE;
        this._key_conta_gestor = process.env.KEY_GESTOR;
        this._key_conta_atendente = process.env.KEY_ATENDENTE;
        this._alg = 'HS256';
        this._type = 'JWT';
        this._iss = 'http://localhost';
        this._aud = 'http://localhost';
        this._sub = "acesso_sistema";
        this._duracaoToken = 3600 * 24; 
    }

    //generates

    gerar_token_cliente(parametroClaims) {
        const headers = {
            alg: this._alg,
            typ: this._type
        };

        const payload = {
            iss: this._iss,
            aud: this._aud,
            sub: this._sub,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + this._duracaoToken,
            nbf: Math.floor(Date.now() / 1000),
            jti: require('crypto').randomBytes(16).toString('hex'),
            id_cliente: parametroClaims.id_cliente,
            nome_cliente: parametroClaims.nome_cliente,
            email_cliente: parametroClaims.email_cliente,
            celular_cliente: parametroClaims.celular_cliente
        };

        return jwt.sign(payload, this._key_conta_cliente, { algorithm: this._alg, header: headers });
    }


    //validates

    validar_token_cliente(stringToken) {
        if (!stringToken || stringToken.trim() === "") {
            return false;
        }
        const token = stringToken.replace("Bearer ", "").trim();
        try {
            const decoded = jwt.verify(token, this._key_conta_cliente, { algorithms: [this._alg] });
            this.payload = decoded;
            return true;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                console.error("Token expirado");
            } else if (err instanceof jwt.JsonWebTokenError) {
                console.error("Token inválido");
            } else {
                console.error("Erro geral", err);
            }
            return false;
        }
    }

    getPayload() {
        return this.payload;
    }
}


