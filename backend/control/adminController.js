const Admin = require('../model/admin/Admin');
const TokenJWT = require('../model/TokenJWT');

module.exports = class AdminController {
    loginAdmin = async (req, res) => {
        try {
            const { email_admin, senha_admin } = req.body;

            const admin = new Admin();
            admin.email_admin = email_admin;
            admin.senha_admin = senha_admin;

            const success = await admin.login();

            if (success) {
                const jwt = new TokenJWT();
                const token = jwt.gerar_token_admin({
                    id_admin: admin.id_admin,
                    email_admin: admin.email_admin,
                });

                res.status(200).json({
                    status: true,
                    message: 'Admin logado com sucesso',
                    token: token,
                    data: {
                        email_admin: admin.email_admin,
                    }
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Falha ao logar admin',
                });
            }
        } catch (err) {
            res.status(401).json({
                status: false,
                message: 'Email ou senha inválidos',
                error: err.message,
            });
        }
    };


    createAdmin = async (req, res) => {
        try {
            const { email_admin, senha_admin } = req.body;

            const admin = new Admin();
            admin.email_admin = email_admin;
            admin.senha_admin = senha_admin;

            const success = await admin.create();

            if (success) {
                const jwt = new TokenJWT();
                
                const token = jwt.gerar_token_admin({
                    id_admin: admin.id_admin,
                    email_admin: admin.email_admin,
                });

                res.status(201).json({
                    status: true,
                    message: 'Admin criado com sucesso',
                    token: token,
                    data: {
                        email_admin: admin.email_admin,
                    }
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Falha ao criar admin',
                });
            }
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao criar admin',
                error: err.message,
            });
        }
    };

    /*

    getAllAdmins = async (req, res) => {
        try {
            const admins = await Admin.getAll();

            res.status(200).json({
                status: true,
                message: 'Lista de administradores recuperada com sucesso',
                data: admins.map(({ password, ...admins }) => admins),
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Erro ao buscar administradores',
                error: err.message,
            });
        }
    };

    getAdminById = async (req, res) => {
        try {
            const admin = await Admin.getById(req.params.id);

            if (!admin) {
                return res.status(404).json({
                    status: false,
                    message: 'Administrador não encontrado',
                });
            }
            const { password, ...adminData } = admin

            res.status(200).json({
                status: true,
                message: 'Administrador recuperado com sucesso',
                data: adminData,
            });
        } catch (err) {
            res.status(404).json({
                status: false,
                message: 'Erro ao buscar administrador',
                error: err.message,
            });
        }
    };

    updateAdmin = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const admin = new Admin();
            admin.id = req.params.id;
            admin.name = name;
            admin.email = email;
            admin.password = password;

            const success = await admin.update();

            if (success) {
                res.status(200).json({
                    status: true,
                    message: 'Administrador atualizado com sucesso',
                    data: {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                    },
                });
            } else {
                res.status(200).json({
                    status: false,
                    message: 'Nenhuma alteração foi feita, os dados são iguais.',
                });
            }
            
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao atualizar administrador',
                error: err.message,
            });
        }
    };

    deleteAdmin = async (req, res) => {
        try {
            const admin = new Admin();
            admin.id = req.params.id;

            const success = await admin.delete();

            res.status(success ? 200 : 400).json({
                status: success,
                message: success
                    ? 'Administrador deletado com sucesso'
                    : 'Falha ao deletar administrador',
            });
        } catch (err) {
            res.status(404).json({
                status: false,
                message: 'Erro ao deletar administrador',
                error: err.message,
            });
        }
    };

    patchAdmin = async (req, res) => {
        try {
            const { image } = req.body;

            const admin = new Admin();
            admin.id = req.params.id;
            admin.image = image;
            

            const success = await admin.patch();

            if (success) {
                res.status(200).json({
                    status: true,
                    message: 'Administrador atualizado com sucesso',
                    data: {
                        id: admin.id,
                        image: admin.image,
                    },
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Falha ao atualizar administrador',
                });
            }
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao atualizar administrador',
                error: err.message,
            });
        }
    };

    */

};
