const ClienteController = require('../control/clienteController');
const ClienteMiddleware = require('../middleware/clienteMiddleware');
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
 */

module.exports = class ClienteRouter {
    constructor() {
        this._router = require('express').Router();
        this._clienteMiddleware = new ClienteMiddleware();
        this._clienteController = new ClienteController();
        this._jwtMiddleware = new JWTMiddleware();
    }

    criarRotas = () => {
        /**
         * @swagger
         * /api/conta/cliente:
         *   get:
         *     summary: Lista todas as contas de cliente
         *     tags: [Cliente]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Lista de clientes obtida com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/ClienteRequest'
         *       401:
         *         description: Token inválido ou expirado
         */
        this._router.get('/',
            this._clienteController.getAllCliente
        );

        this._router.get('/:id_cliente',
            this._clienteController.getClienteById
        );

        this._router.post('/cadastro',
            this._clienteMiddleware.validateNome,
            this._clienteMiddleware.validateEmail,
            this._clienteMiddleware.validate_Email,
            this._clienteMiddleware.checkDuplicateEmail,
            this._clienteMiddleware.validateSenha,
            this._clienteMiddleware.validateCelular,
            this._clienteController.createCliente
        );

        this._router.post('/login', 
            this._clienteMiddleware.validateEmail,
            this._clienteMiddleware.validateSenha,
            this._clienteController.loginCliente
        );

      //  this._router.put('/status/:id_cliente',
      //      this._clienteController.atualizarStatus
      //  );

     //   this._router.delete('/:id_cliente',
        //    this._clienteController.deleteCliente
       // );
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

    get clienteMiddleware() {
        return this._clienteMiddleware;
    }

    set clienteMiddleware(value) {
        this._clienteMiddleware = value;
    }

    get clienteController() {
        return this._clienteController;
    }

    set clienteController(value) {
        this._clienteController = value;
    }

    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(value) {
        this._jwtMiddleware = value;
    }
};