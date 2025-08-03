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

    ufc_delete_evento_by_id = async (req, res) => {
        try {
            const ufc = new UFC();
            ufc.id_evento = req.params.id_evento;

            const success = await ufc.delete_evento();

            res.status(success ? 200 : 400).json({
                status: success,
                message: success
                    ? 'Evento deletado com sucesso'
                    : 'Falha ao deletar evento',
            });
        } catch (err) {
            res.status(404).json({
                status: false,
                message: 'Erro ao deletar evento',
                error: err.message,
            });
        }
    };

    ufc_delete_fight_by_id = async (req, res) => {
        try {
            const ufc = new UFC();
            ufc.id_luta = req.params.id_luta;

            const success = await ufc.delete_fight();

            res.status(success ? 200 : 400).json({
                status: success,
                message: success
                    ? 'Luta deletado com sucesso'
                    : 'Falha ao deletar luta',
            });
        } catch (err) {
            res.status(404).json({
                status: false,
                message: 'Erro ao deletar luta',
                error: err.message,
            });
        }
    };

    ufc_update_status = async(req, res) => {
        try {
            const ufc = new UFC();

            const success = await ufc.update_event_status(req.params.id_evento);

            if (success) {
                res.status(200).json({
                    status: true,
                    message: 'Status evento atualizada com sucesso',
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
                message: 'Erro ao atualizar luta',
                error: err.message,
            });
        }
    };

    ufc_update_fight_by_id = async(req, res) => {
        try {
            const { red_fighter, blue_fighter, categoria, titulo } = req.body;

            const ufc = new UFC();
            ufc.id_luta = req.params.id_luta;
            ufc.red_fighter = red_fighter;
            ufc.blue_fighter = blue_fighter;
            ufc.categoria = categoria;
            ufc.titulo = titulo;

            const success = await ufc.update_fight();

            if (success) {
                res.status(200).json({
                    status: true,
                    message: 'Luta atualizada com sucesso',
                    data: {
                        id_luta: ufc.id_luta,
                        red_fighter: ufc.red_fighter,
                        blue_fighter: ufc.blue_fighter,
                        categoria: ufc.categoria,
                        titulo: ufc.titulo
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
                message: 'Erro ao atualizar luta',
                error: err.message,
            });
        }
    };

    ufc_get_fights_by_id = async(req, res) => {
        try {
            const ufc = new UFC();

            const resultado = await ufc.UFC_read_fights_by_id(req.params.id_evento);

            res.status(200).json({
                status: true,
                message: 'Lutas encontradas',
                data: resultado,
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Erro ao buscar lutas',
                error: err.message,
            });
        }
    };
    
    ufc_get_events_by_id = async (req, res) => {
        try {
            const ufc = new UFC();
            ufc.id_evento = req.query.id_evento;

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

    ufc_create_event = async (req, res) => {
        try {
            const { nome_evento, local_evento, data_evento } = req.body;
            
            const ufc = new UFC();
            ufc.nome_evento = nome_evento;
            ufc.local_evento = local_evento;
            ufc.data_evento = data_evento;

            const success = await ufc.ufc_create_event();

            if (success) {
                res.status(201).json({
                    status: true,
                    message: 'Evento criado com sucesso',
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Erro ao criar evento',
                });
            }
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao criar evento',
                error: err.message,
            });
        }
    };

    ufc_create_fight = async (req, res) => {
        try {
            const { id_evento, red_fighter, blue_fighter, categoria, titulo } = req.body;
            
            const ufc = new UFC();
            ufc.id_evento = id_evento;
            ufc.red_fighter = red_fighter;
            ufc.blue_fighter = blue_fighter;
            ufc.categoria = categoria;
            ufc.titulo = titulo;

            const success = await ufc.ufc_create_fight();

            if (success) {
                res.status(201).json({
                    status: true,
                    message: 'Luta criado com sucesso',
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Erro ao criar luta',
                });
            }
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao criar luta',
                error: err.message,
            });
        }
    };

    ufc_create_bet = async (req, res) => {
        try {
            const { id_cliente, id_evento, id_luta, vencedor, rodada, metodo } = req.body;
            console.log(req.body);
            const ufc = new UFC();
            ufc.id_cliente = id_cliente;    
            ufc.id_evento = id_evento;
            ufc.id_luta = id_luta;
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

    ufc_get_payload = async (req, res) => {
        try {
            const ufc = new UFC();

            const resultado = await ufc.UFC_get_payload();

        res.status(200).json({
            status: true,
            message: 'Payload encontrada',
            data: resultado,
        });
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao buscar payload',
                error: err.message,
            });
        }
    };

    ufc_create_winner = async (req, res) => {
        try {
            console.log("Body:" , req.body.id_evento);
            const ufc = new UFC();
            ufc.id_evento = req.body.id_evento;
            ufc.id_luta = req.body.id_luta;
            ufc.vencedor = req.body.winner;
            ufc.rodada = req.body.round;
            ufc.metodo = req.body.method;

            const success = await ufc.ufc_winner();

            if (success) {
                res.status(200).json({
                    status: true,
                    message: 'Vencedor criado com sucesso',
                });
            } else {
                res.status(400).json({
                    status: false,
                    message: 'Erro ao criar vencedor',
                });
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({
                status: false,
                message: 'Erro ao criar vencedor',
                error: err.message,
            });
        }
    };

    ufc_get_bets_by_user = async (req, res) => {
        try {
            const ufc = new UFC();
            ufc.id_cliente = req.query.id_cliente;

            const resultado = await ufc.UFC_read_bets_by_user();

        res.status(200).json({
            status: true,
            message: 'Apostas encontradas',
            data: resultado,
        });
        } catch (err) {
            res.status(400).json({
                status: false,
                message: 'Erro ao buscar apostas',
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
