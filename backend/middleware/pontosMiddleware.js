const Admin = require('../model/admin/Admin');

module.exports = class PontosMiddleware {
    
    validateEventId = async (req, res, next) => {
        const { id_evento } = req.body;
        
        if (!id_evento || isNaN(id_evento) || id_evento <= 0) {
            return res.status(400).json({
                status: false,
                message: 'ID do evento é obrigatório e deve ser um número positivo',
            });
        }
        
        next();
    };

    validateClientId = async (req, res, next) => {
        const { id_cliente } = req.params;
        
        if (!id_cliente || isNaN(id_cliente) || id_cliente <= 0) {
            return res.status(400).json({
                status: false,
                message: 'ID do cliente é obrigatório e deve ser um número positivo',
            });
        }
        
        next();
    };

    
}
