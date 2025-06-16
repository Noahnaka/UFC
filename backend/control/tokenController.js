const TokenJWT = require('../model/TokenJWT');

module.exports = class TokenController {
    getPayloadTokenContaCliente = async (req, res) => {
        try {
            const jwt = new TokenJWT();

            jwt.validar_token_conta_cliente(req.headers['authorization']);
            const payload = await jwt.getPayload();

            if (payload) {
                res.status(200).json({
                    status: true,
                    message: 'Payload retornado com sucesso',
                    payload: payload
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Falha ao retornar payload',
                });
            }
        } catch (err) {
            res.status(401).json({
                status: false,
                message: 'Credenciais inválidas',
                error: err.message,
            });
        }
    };

};
