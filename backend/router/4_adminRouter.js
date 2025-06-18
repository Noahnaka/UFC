const AdminController = require('../control/adminController');
const AdminMiddleware = require('../middleware/adminMiddleware');
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
 *     AdminLoginRequest:
 *       type: object
 *       required:
 *         - email_admin
 *         - senha_admin
 *       properties:
 *         email_admin:
 *           type: string
 *           format: email
 *           description: Email do administrador
 *         senha_admin:
 *           type: string
 *           description: Senha do administrador
 *     AdminLoginResponse:
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
 *             email_admin:
 *               type: string
 *               description: Email do administrador
 *     AdminRequest:
 *       type: object
 *       required:
 *         - email_admin
 *         - senha_admin
 *       properties:
 *         email_admin:
 *           type: string
 *           format: email
 *           description: Email do administrador
 *         senha_admin:
 *           type: string
 *           description: Senha do administrador
 *     AdminResponse:
 *       type: object
 *       properties:
 *         id_admin:
 *           type: integer
 *           description: ID do administrador
 *         email_admin:
 *           type: string
 *           description: Email do administrador
 */

module.exports = class AdminRouter {
    constructor() {
        this._router = require('express').Router();
        this._adminMiddleware = new AdminMiddleware();
        this._adminController = new AdminController();
        this._jwtMiddleware = new JWTMiddleware();
    }

    criarRotas = () => {


        /**
         * @swagger
         * /api/admin/cadastro:
         *   post:
         *     summary: Cria uma nova conta de administrador
         *     description: Cria um novo administrador e retorna um token JWT com duração de 100 anos
         *     tags: [Admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AdminRequest'
         *     responses:
         *       201:
         *         description: Administrador criado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminLoginResponse'
         *       400:
         *         description: Dados inválidos
         *       409:
         *         description: Email já cadastrado
         */
        this._router.post('/cadastro',
            this._adminMiddleware.validateEmail,
            this._adminMiddleware.validate_Email,
            this._adminMiddleware.checkDuplicateEmail,
            this._adminMiddleware.validateSenha,
            this._adminController.createAdmin
        );

        /**
         * @swagger
         * /api/admin/login:
         *   post:
         *     summary: Realiza login do administrador
         *     description: Autentica o administrador e retorna um token JWT com duração de 100 anos
         *     tags: [Admin]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/AdminLoginRequest'
         *     responses:
         *       200:
         *         description: Login realizado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/AdminLoginResponse'
         *       401:
         *         description: Credenciais inválidas
         */
        this._router.post('/login', 
            this._adminMiddleware.validateEmail,
            this._adminMiddleware.validateSenha,
            this._adminController.loginAdmin
        );      

        return this._router;
    };

    get router() {
        return this._router;
    }

    set router(value) {
        this._router = value;
    }

    get adminMiddleware() {
        return this._adminMiddleware;
    }

    set adminMiddleware(value) {
        this._adminMiddleware = value;
    }

    get adminController() {
        return this._adminController;
    }

    set adminController(value) {
        this._adminController = value;
    }

    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(value) {
        this._jwtMiddleware = value;
    }
};