const Cliente = require('../model/cliente/Cliente');

module.exports = class ClienteMiddleware {
    checkDuplicateEmail = async (req, res, next) => {
        try {
            const { email_cliente } = req.body;

            const isTaken = await Cliente.isEmailTaken(email_cliente);
            if (isTaken) {
                return res.status(409).json({
                    status: false,
                    message: 'Já existe uma conta cliente cadastrado com este e-mail',
                });
            }
    
            next();
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: 'Erro ao verificar duplicidade de e-mail',
                error: err.message,
            });
        }
    };
    
    validateIdCliente = async (req, res, next) => {
        if (!req.params.id_cliente) {
            return res.status(400).json({
                status: false,
                message: 'O campo id_cliente é obrigatório',
            });
        }
        next();
    }

    validateNome = async (req, res, next) => {
        if (!req.body.nome_cliente) {
            return res.status(400).json({
                status: false,
                message: 'O campo nome_cliente é obrigatório',
            });
        }
        next();
    }


    validateEmail = async (req, res, next) => {
        if (!req.body.email_cliente) {
            return res.status(400).json({
                status: false,
                message: 'O campo email_cliente é obrigatório',
            });
        }
        next();
    }

    validateSenha = async (req, res, next) => {
        if (!req.body.senha_cliente) {
            return res.status(400).json({
                status: false,
                message: 'O campo senha_cliente é obrigatório',
            });
        }
        next();
    }

    validateCelular = async (req, res, next) => {
        if (!req.body.celular_cliente) {
            return res.status(400).json({
                status: false,
                message: 'O campo celular_cliente é obrigatório',
            });
        }
        next();
    }

    validate_Email = async (req, res, next) => {
        const { email_cliente } = req.body;

        const atIndex = email_cliente.indexOf('@');
        const dotIndex = email_cliente.lastIndexOf('.');

        if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex + 2 >= email_cliente.length) {
            return res.status(400).json({
                status: false,
                message: 'E-mail inválido. Por favor, insira um e-mail válido com @.',
            });
        }

        next();
    }

}
