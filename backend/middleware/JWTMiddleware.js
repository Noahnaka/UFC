const TokenJWT = require('../model/TokenJWT');

module.exports = class JWTMiddleware {
    validate_token_cliente = (req, res, next) => {
        const authHeader = req.headers['authorization'];

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const jwt = new TokenJWT();

            if (jwt.validar_token_cliente(token)) {
                req.tokenPayload = jwt.getPayload(); 
                next();

            } else {
                return res.status(401).json({ 
                    status: false, 
                    message: 'Token inválido ou expirado' 
                });
            }
            
        } else {
            return res.status(401).json({ 
                status: false,
                message: 'Token não fornecido' 
            });
        }
    };

}