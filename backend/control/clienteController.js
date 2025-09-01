const Cliente = require('../model/cliente/Cliente');
const TokenJWT = require('../model/TokenJWT');

module.exports = class ClienteController {
    loginCliente = async (req, res) => {
        try {
            const { email_cliente, senha_cliente } = req.body;

            const cliente = new Cliente();
            cliente.email_cliente = email_cliente;
            cliente.senha_cliente = senha_cliente;

            const success = await cliente.login();

            if (success) {
                const jwt = new TokenJWT();
                const token = jwt.gerar_token_cliente({
                    id_cliente: cliente.id_cliente,
                    nome_cliente: cliente.nome_cliente,
                    sobrenome_cliente: cliente.sobrenome_cliente,
                    email_cliente: cliente.email_cliente,
                    celular_cliente: cliente.celular_cliente
                });

                res.status(200).json({
                    status: true,
                    message: 'Cliente logado com sucesso',
                    token: token,
                    data: {
                        nome_cliente: cliente.nome_cliente,
                        sobrenome_cliente: cliente.sobrenome_cliente,
                        email_cliente: cliente.email_cliente,
                        celular_cliente: cliente.celular_cliente,
                        nivel_acesso_cliente: cliente.nivel_acesso_cliente
                    }
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Falha ao logar cliente',
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

    updateAcessoCliente = async (req, res) => {
        try {

            const cliente = new Cliente();
            cliente.id_cliente = req.params.id_cliente;
            cliente.nivel_acesso_cliente = req.body.nivel_acesso_cliente;

            const success = await cliente.updateAcesso();

            console.log(success);

            if (success) {
                res.status(200).json({
                    status: true,
                    message: 'Acesso do cliente atualizado com sucesso',
                    data: cliente,
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
                message: 'Erro ao atualizar acesso do cliente',
                error: err.message,
            });
        }
    };
    
    getPontosCliente = async (req, res) => {
        try {
            const cliente = new Cliente();
            
            const pontos = await cliente.getPontos(req.params.id_cliente); 

            res.status(200).json({
                status: true,
                message: 'Pontos do cliente recuperado com sucesso',
                data: pontos,
            });
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao buscar pontos do cliente',
                error: err.message,
            });
        }
    };

    getAllCliente = async (req, res) => {
        try {
            const cliente = await Cliente.getAll();

            res.status(200).json({
                status: true,
                message: 'Get all cliente realizado com sucesso',
                data: cliente,
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Erro ao buscar cliente',
                error: err.message,
            });
        }
    };

    getClienteById = async (req, res) => {
        try {
            const cliente = await Cliente.getById(req.params.id_cliente);

            if (!cliente) {
                return res.status(404).json({
                    status: false,
                    message: 'Cliente não encontrado',
                });
            }

            res.status(200).json({
                status: true,
                message: 'Cliente recuperado com sucesso',
                data: cliente,
            });
        } catch (err) {
            res.status(404).json({
                status: false,
                message: 'Erro ao buscar cliente',
                error: err.message,
            });
        }
    };

    createCliente = async (req, res) => {
        try {
            const { nome_cliente, email_cliente, senha_cliente, celular_cliente } = req.body;

            const cliente = new Cliente();
            cliente.nome_cliente = nome_cliente;    
            cliente.email_cliente = email_cliente;
            cliente.senha_cliente = senha_cliente;
            cliente.celular_cliente = celular_cliente;

            const success = await cliente.create();

            if (success) {
                const jwt = new TokenJWT();
                
                const token = jwt.gerar_token_cliente({
                    id_cliente: cliente.id_cliente,
                    nome_cliente: cliente.nome_cliente,
                    email_cliente: cliente.email_cliente,
                    celular_cliente: cliente.celular_cliente
                });

                res.status(201).json({
                    status: true,
                    message: 'Cliente criado com sucesso',
                    token: token,
                    data: {
                        nome_cliente: cliente.nome_cliente,
                        email_cliente: cliente.email_cliente,
                        celular_cliente: cliente.celular_cliente
                    }
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Falha ao criar cliente',
                });
            }
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao criar cliente',
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
