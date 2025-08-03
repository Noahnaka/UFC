const Pontos = require('../model/pontos/Pontos');

module.exports = class PontosController {

    createPontos = async (req, res) => {
        try {
            console.log(req.body);
            const { id_evento } = req.body;

            if (!id_evento) {
                return res.status(400).json({
                    status: false,
                    message: 'ID do evento é obrigatório',
                });
            }

            const pontos = new Pontos();
            const result = await pontos.create(id_evento);

            if (result.success) {
                res.status(201).json({
                    status: true,
                    message: result.message,
                    data: {
                        id_evento: id_evento,
                        pontosAtualizados: result.pontosAtualizados
                    }
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Falha ao calcular pontos',
                });
            }
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao calcular pontos',
                error: err.message,
            });
        }
    };

    getPontosCliente = async (req, res) => {
        try {
            const { id_cliente } = req.params;

            if (!id_cliente) {
                return res.status(400).json({
                    status: false,
                    message: 'ID do cliente é obrigatório',
                });
            }

            const pontos = new Pontos();
            const pontosCliente = await pontos.getPontosCliente(id_cliente);

            res.status(200).json({
                status: true,
                message: 'Pontos do cliente recuperados com sucesso',
                data: {
                    id_cliente: id_cliente,
                    pontos: pontosCliente
                }
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Erro ao buscar pontos do cliente',
                error: err.message,
            });
        }
    };

    getAllPontos = async (req, res) => {
        try {
            const pontos = new Pontos();
            const todosPontos = await pontos.getAllPontos();

            res.status(200).json({
                status: true,
                message: 'Lista de pontos recuperada com sucesso',
                data: todosPontos
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Erro ao buscar todos os pontos',
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
