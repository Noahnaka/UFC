/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     TokenResponseContaCliente:
 *       type: object
 *       properties:
 *         id_conta_cliente:
 *           type: integer
 *           description: ID do cliente
 *         nome_conta_cliente:
 *           type: string
 *           description: Nome do cliente
 *         sobrenome_conta_cliente:
 *           type: string
 *           description: Sobrenome do cliente
 *         email_conta_cliente:
 *           type: string
 *           description: Email do cliente
 *         cnpj_conta_cliente:
 *           type: string
 *           description: CNPJ do cliente
 *         celular_conta_cliente:
 *           type: string
 *           description: Celular do cliente
 *         status_conta_cliente:
 *           type: boolean
 *           description: Status do cliente
 *     TokenResponseContaAtendente:
 *       type: object
 *       properties:
 *         id_conta_atendente:
 *           type: integer
 *           description: ID do atendente
 *         id_conta_cliente:
 *           type: integer
 *           description: ID do cliente responsável
 *         nome_conta_atendente:
 *           type: string
 *           description: Nome do atendente
 *         sobrenome_conta_atendente:
 *           type: string
 *           description: Sobrenome do atendente
 *         email_conta_atendente:
 *           type: string
 *           description: Email do atendente
 *         celular_conta_atendente:
 *           type: string
 *           description: Celular do atendente
 *         status_conta_atendente:
 *           type: boolean
 *           description: Status do atendente
 */

const TokenController = require('../control/tokenController');
const JWTMiddleware = require('../middleware/JWTMiddleware');

module.exports = class TokenRouter {
    constructor() {
        this._router = require('express').Router();
        this._tokenController = new TokenController();
        this._jwtMiddleware = new JWTMiddleware();
    }

    criarRotas = () => {
        /**
         * @swagger
         * /api/token/conta/cliente:
         *   get:
         *     summary: Obtém o payload do token do cliente
         *     tags: [Token]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Payload do token obtido com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/TokenResponseContaCliente'
         *       401:
         *         description: Token inválido ou expirado
         */
        this._router.get('/conta/cliente', 
            this._jwtMiddleware.validate_token_cliente,
            this._tokenController.getPayloadTokenContaCliente
        );        

        /**
         * @swagger
         * /api/token/conta/atendente:
         *   get:
         *     summary: Obtém o payload do token do atendente
         *     tags: [Token]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Payload do token obtido com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/TokenResponseContaAtendente'
         *       401:
         *         description: Token inválido ou expirado
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

    get tokenController() {
        return this._tokenController;
    }

    set tokenController(value) {
        this._tokenController = value;
    }

    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(value) {
        this._jwtMiddleware = value;
    }
};