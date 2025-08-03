const UFCController = require('../control/ufcController');
const JWTMiddleware = require('../middleware/JWTMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email_conta_cliente
 *         - senha_conta_cliente
 *       properties:
 *         email_conta_cliente:
 *           type: string
 *           format: email
 *           description: Email do cliente
 *         senha_conta_cliente:
 *           type: string
 *           description: Senha do cliente
 *     ClienteRequest:
 *       type: object
 *       required:
 *         - nome_conta_cliente
 *         - sobrenome_conta_cliente
 *         - email_conta_cliente
 *         - senha_conta_cliente
 *         - cpf_conta_cliente
 *         - telefone_conta_cliente
 *         - celular_conta_cliente
 *       properties:
 *         nome_conta_cliente:
 *           type: string
 *           description: Nome do cliente
 *         sobrenome_conta_cliente:
 *           type: string
 *           description: Sobrenome do cliente
 *         email_conta_cliente:
 *           type: string
 *           format: email
 *           description: Email do cliente
 *         senha_conta_cliente:
 *           type: string
 *           description: Senha do cliente
 *         cpf_conta_cliente:
 *           type: string
 *           description: CPF do cliente
 *         cnpj_conta_cliente:
 *           type: string
 *           description: CNPJ do cliente (opcional)
 *         telefone_conta_cliente:
 *           type: string
 *           description: Telefone fixo do cliente
 *         celular_conta_cliente:
 *           type: string
 *           description: Celular do cliente
 *     UFCEvent:
 *       type: object
 *       properties:
 *         id_evento:
 *           type: integer
 *           description: ID do evento UFC
 *         nome_evento:
 *           type: string
 *           description: Nome do evento UFC
 *         data_evento:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *         status_evento:
 *           type: string
 *           description: Status do evento
 *     UFCBet:
 *       type: object
 *       properties:
 *         id_bet:
 *           type: integer
 *           description: ID da aposta
 *         id_evento:
 *           type: integer
 *           description: ID do evento UFC
 *         id_cliente:
 *           type: integer
 *           description: ID do cliente
 *         valor_bet:
 *           type: number
 *           description: Valor da aposta
 *         status_bet:
 *           type: string
 *           description: Status da aposta
 */

module.exports = class UfcRouter {
    constructor() {
        this._router = require('express').Router();
        this._ufcController = new UFCController();
        this._jwtMiddleware = new JWTMiddleware();
    }

    criarRotas = () => {
        /**
         * @swagger
         * /api/ufc/eventos:
         *   get:
         *     summary: Lista todos os eventos UFC
         *     tags: [UFC]
         *     responses:
         *       200:
         *         description: Lista de eventos obtida com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/UFCEvent'
         */
        this._router.get('/eventos',
            this._ufcController.ufc_get_events
        )

        this._router.get('/fights/:id_evento',
            this._ufcController.ufc_get_fights_by_id
        )

        this._router.put('/update/fight/:id_luta',
            this._ufcController.ufc_update_fight_by_id
        )

        this._router.put('/event/status/:id_evento',
            this._ufcController.ufc_update_status
        )

        this._router.delete('/delete/evento/:id_evento',
            this._ufcController.ufc_delete_evento_by_id
        )

        this._router.delete('/delete/fight/:id_luta',
            this._ufcController.ufc_delete_fight_by_id
        )

        this._router.get('/payload',
            this._ufcController.ufc_get_payload
        )

        /**
         * @swagger
         * /api/ufc/eventos/bet:
         *   get:
         *     summary: Obtém detalhes de um evento UFC específico
         *     tags: [UFC]
         *     parameters:
         *       - in: query
         *         name: id_evento
         *         required: true
         *         schema:
         *           type: integer
         *         description: ID do evento UFC
         *     responses:
         *       200:
         *         description: Detalhes do evento obtidos com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/UFCEvent'
         */
        this._router.get('/eventos/bet',
            this._ufcController.ufc_get_events_by_id
        )

        /**
         * @swagger
         * /api/ufc/bets:
         *   get:
         *     summary: Lista todas as apostas UFC
         *     tags: [UFC]
         *     responses:
         *       200:
         *         description: Lista de apostas obtida com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/UFCBet'
         */
        this._router.get('/bets',
            this._ufcController.ufc_get_bets
        )

        /**
         * @swagger
         * /api/ufc:
         *   post:
         *     summary: Cria uma nova aposta UFC
         *     tags: [UFC]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/UFCBet'
         *     responses:
         *       201:
         *         description: Aposta criada com sucesso
         *       400:
         *         description: Dados inválidos
         */
        this._router.post('/',
            this._ufcController.ufc_create_bet
        )

        this._router.get('/user/bets',
            this._ufcController.ufc_get_bets_by_user
        )

        /**
         * @swagger
         * /api/ufc/sync:
         *   post:
         *     summary: Sincroniza eventos UFC
         *     tags: [UFC]
         *     responses:
         *       200:
         *         description: Eventos sincronizados com sucesso
         *       500:
         *         description: Erro ao sincronizar eventos
         */
        this._router.post('/sync',
            this._ufcController.ufc_sync_events
        )

        this._router.post('/create/event',
            this._ufcController.ufc_create_event
        )

        this._router.post('/create/fight',
            this._ufcController.ufc_create_fight
        )

        this._router.post('/vencedor',
            this._ufcController.ufc_create_winner
        )

        /**
         * @swagger
         * /api/conta/cliente/{id_cliente}:
         *   get:
         *     summary: Busca uma conta de cliente por ID
         *     tags: [Cliente]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id_cliente
         *         required: true
         *         schema:
         *           type: integer
         *         description: ID do cliente
         *     responses:
         *       200:
         *         description: Cliente encontrado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ClienteRequest'
         *       401:
         *         description: Token inválido ou expirado
         *       404:
         *         description: Cliente não encontrado
         */


        /**
         * @swagger
         * /api/conta/cliente/status/{id_cliente}:
         *   put:
         *     summary: Atualiza o status de uma conta de cliente
         *     tags: [Cliente]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id_cliente
         *         required: true
         *         schema:
         *           type: integer
         *         description: ID do cliente
         *     responses:
         *       200:
         *         description: Status do cliente atualizado com sucesso
         *       401:
         *         description: Token inválido ou expirado
         *       404:
         *         description: Cliente não encontrado
         */


        /**
         * @swagger
         * /api/conta/cliente/{id_cliente}:
         *   delete:
         *     summary: Deleta uma conta de cliente
         *     tags: [Cliente]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id_cliente
         *         required: true
         *         schema:
         *           type: integer
         *         description: ID do cliente
         *     responses:
         *       200:
         *         description: Cliente deletado com sucesso
         *       401:
         *         description: Token inválido ou expirado
         *       404:
         *         description: Cliente não encontrado
         */


        /**
         * @swagger
         * /api/conta/cliente:
         *   post:
         *     summary: Cria uma nova conta de cliente
         *     tags: [Cliente]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ClienteRequest'
         *     responses:
         *       201:
         *         description: Cliente criado com sucesso
         *       400:
         *         description: Dados inválidos
         *       409:
         *         description: Email já cadastrado
         */


        /*
        this._router.get('/',
            this._jwtMiddleware.validateToken,
            this._adminController.getAllAdmins
        );

        this._router.get('/:id',
            this._jwtMiddleware.validateToken,
            this._adminController.getAdminById
        );

        this._router.patch('/:id',
            this._jwtMiddleware.validateToken,
            this._adminController.patchAdmin
        );

        this._router.put('/:id',
            this._jwtMiddleware.validateToken,
            this._adminMiddleware.validateName,
            this._adminMiddleware.validateEmail,
            this._adminMiddleware.validatePassword,
            this._funcionarioMiddleware.checkDuplicateEmail,
            this._fornecedorMiddleware.checkDuplicateEmail,
            this._adminMiddleware.validate_Email,
            this._adminMiddleware.validate_Password,
            this._adminController.updateAdmin
        );

        this._router.delete('/:id',
            this._jwtMiddleware.validateToken,
           this._adminController.deleteAdmin
        );
        */

        return this._router;
    };

    //getters e setters

    get router() {
        return this._router;
    }

    set router(value) {
        this._router = value;
    }

    get ufcController() {
        return this._ufcController;
    }

    set ufcController(value) {
        this._ufcController = value;
    }

    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(value) {
        this._jwtMiddleware = value;
    }
};