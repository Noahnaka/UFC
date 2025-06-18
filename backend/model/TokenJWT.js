const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = class MeuTokenJWT {
    constructor() {
        this._key_conta_cliente = process.env.KEY_CLIENTE;
        this._key_conta_admin = process.env.KEY_ADMIN;
        this._alg = 'HS256';
        this._type = 'JWT';
        this._iss = 'http://localhost';
        this._aud = 'http://localhost';
        this._sub = "acesso_sistema";
        // 100 years in seconds (3600 * 24 * 365 * 100)
        this._duracaoToken = 3153600000;
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

    gerar_token_admin(parametroClaims) {
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
            id_admin: parametroClaims.id_admin,
            email_admin: parametroClaims.email_admin
        };

        return jwt.sign(payload, this._key_conta_admin, { algorithm: this._alg, header: headers });
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

    validar_token_admin(stringToken) {

        if (!stringToken || stringToken.trim() === "") {
            return false;
        }
        const token = stringToken.replace("Bearer ", "").trim();
        
        try {
            const decoded = jwt.verify(token, this._key_conta_admin, { algorithms: [this._alg] });
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


