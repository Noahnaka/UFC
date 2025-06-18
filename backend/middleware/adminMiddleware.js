const Admin = require('../model/admin/Admin');

module.exports = class AdminMiddleware {
    checkDuplicateEmail = async (req, res, next) => {
        try {
            const { email_admin } = req.body;

            const isTaken = await Admin.isEmailTaken(email_admin);
            if (isTaken) {
                return res.status(409).json({
                    status: false,
                    message: 'Já existe uma conta admin cadastrado com este e-mail',
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

    validateSenha = async (req, res, next) => {
        if (!req.body.senha_admin) {
            return res.status(400).json({
                status: false,
                message: 'O campo senha_admin é obrigatório',
            });
        }
        next();
    }

    validateEmail = async (req, res, next) => {
        if (!req.body.email_admin) {
            return res.status(400).json({
                status: false,
                message: 'O campo email_admin é obrigatório',
            });
        }
        next();
    }

    validate_Email = async (req, res, next) => {
        const { email_admin } = req.body;

        const atIndex = email_admin.indexOf('@');
        const dotIndex = email_admin.lastIndexOf('.');

        if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex + 2 >= email_admin.length) {
            return res.status(400).json({   
                status: false,
                message: 'E-mail inválido. Por favor, insira um e-mail válido com @.',
            });
        }

        next();
    }

}
