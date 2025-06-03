const ClienteController = require('../control/clienteController');
const ClienteMiddleware = require('../middleware/clienteMiddleware');
const JWTMiddleware = require('../middleware/JWTMiddleware');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token com duração de 100 anos. Formato: Bearer <token>
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email_cliente
 *         - senha_cliente
 *       properties:
 *         email_cliente:
 *           type: string
 *           format: email
 *           description: Email do cliente
 *         senha_cliente:
 *           type: string
 *           description: Senha do cliente
 *     LoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Status da operação
 *         message:
 *           type: string
 *           description: Mensagem de retorno
 *         token:
 *           type: string
 *           description: JWT token com duração de 100 anos
 *         data:
 *           type: object
 *           properties:
 *             nome_cliente:
 *               type: string
 *               description: Nome do cliente
 *             email_cliente:
 *               type: string
 *               description: Email do cliente
 *             celular_cliente:
 *               type: string
 *               description: Celular do cliente
 *     ClienteRequest:
 *       type: object
 *       required:
 *         - nome_cliente
 *         - email_cliente
 *         - senha_cliente
 *         - celular_cliente
 *       properties:
 *         nome_cliente:
 *           type: string
 *           description: Nome do cliente
 *         email_cliente:
 *           type: string
 *           format: email
 *           description: Email do cliente
 *         senha_cliente:
 *           type: string
 *           description: Senha do cliente
 *         celular_cliente:
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
         * /api/cliente:
         *   get:
         *     summary: Lista todas as contas de cliente
         *     description: Retorna uma lista de todos os clientes cadastrados
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

        /**
         * @swagger
         * /api/cliente/{id_cliente}:
         *   get:
         *     summary: Busca um cliente por ID
         *     description: Retorna os detalhes de um cliente específico
         *     tags: [Cliente]
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
         *       404:
         *         description: Cliente não encontrado
         */
        this._router.get('/:id_cliente',
            this._clienteController.getClienteById
        );

        /**
         * @swagger
         * /api/cliente/cadastro:
         *   post:
         *     summary: Cria uma nova conta de cliente
         *     description: Cria um novo cliente e retorna um token JWT com duração de 100 anos
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
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/LoginResponse'
         *       400:
         *         description: Dados inválidos
         *       409:
         *         description: Email já cadastrado
         */
        this._router.post('/cadastro',
            this._clienteMiddleware.validateNome,
            this._clienteMiddleware.validateEmail,
            this._clienteMiddleware.validate_Email,
            this._clienteMiddleware.checkDuplicateEmail,
            this._clienteMiddleware.validateSenha,
            this._clienteMiddleware.validateCelular,
            this._clienteController.createCliente
        );

        /**
         * @swagger
         * /api/cliente/login:
         *   post:
         *     summary: Realiza login do cliente
         *     description: Autentica o cliente e retorna um token JWT com duração de 100 anos
         *     tags: [Cliente]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LoginRequest'
         *     responses:
         *       200:
         *         description: Login realizado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/LoginResponse'
         *       401:
         *         description: Credenciais inválidas
         */
        this._router.post('/login', 
            this._clienteMiddleware.validateEmail,
            this._clienteMiddleware.validateSenha,
            this._clienteController.loginCliente
        );

        return this._router;
    };

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