const UFC = require('../model/ufc/UFC');

module.exports = class UFCController {
    ufc_get_events = async (req, res) => {
        try {
            const ufc = new UFC();

            const resultado = await ufc.UFC_read_all();

            res.status(200).json({
                status: true,
                message: 'Eventos encontrados',
                data: resultado
            });
        } catch (err) {
            res.status(401).json({
                status: false,
                message: 'Erro ao buscar eventos',
                error: err.message,
            });
        }
    };
    
    ufc_get_events_by_id = async (req, res) => {
        try {
            const ufc = new UFC();
            ufc.idUFC = req.query.idUFC;

            const resultado = await ufc.UFC_read_by_id();

            res.status(200).json({
                status: true,
                message: 'Evento encontrado',
                data: resultado,
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Erro ao buscar evento',
                error: err.message,
            });
        }
    };

    ufc_get_bets = async (req, res) => {
        try {
            const ufc = new UFC();
            ufc.idUsuario = req.query.idUsuario;

            const resultado = await ufc.UFC_read_bets_by_id();

            res.status(200).json({
                status: true,
                message: 'Apostas encontradas',
                data: resultado,
            });
        } catch (err) {
            res.status(404).json({
                status: false,
                message: 'Erro ao buscar apostas',
                error: err.message,
            });
        }
    };

    ufc_create_bet = async (req, res) => {
        try {
            const { id_cliente, id_evento, id_luta, vencedor, rodada, metodo } = req.body;

            const ufc = new UFC();
            ufc.idUsuario = id_cliente;    
            ufc.idUFC = id_evento;
            ufc.idEvento = id_luta;
            ufc.vencedor = vencedor;
            ufc.rodada = rodada;
            ufc.metodo = metodo;

            const success = await ufc.create_bet();

            if (success) {
                res.status(201).json({  
                    status: true,
                    message: 'Aposta criada com sucesso',
                    idAposta: ufc._idAposta
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Erro ao criar aposta',
                });
            }
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao criar aposta',
                error: err.message,
            });
        }
    };

    ufc_sync_events = async (req, res) => {
        try {
            const ufc = new UFC();

            const resultado = await ufc.ufc_sync_events();

            res.status(200).json({
                status: true,
                message: 'Eventos sincronizados com sucesso',
                data: resultado,
            });
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao sincronizar eventos',
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
