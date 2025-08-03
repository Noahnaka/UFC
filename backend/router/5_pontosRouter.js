const PontosController = require('../control/pontosController');
const PontosMiddleware = require('../middleware/pontosMiddleware');
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
 *     PontosRequest:
 *       type: object
 *       required:
 *         - id_evento
 *       properties:
 *         id_evento:
 *           type: integer
 *           description: ID do evento UFC
 *     PontosResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Status da operação
 *         message:
 *           type: string
 *           description: Mensagem de retorno
 *         data:
 *           type: object
 *           properties:
 *             id_evento:
 *               type: integer
 *               description: ID do evento processado
 *             pontosAtualizados:
 *               type: object
 *               description: Mapa de pontos atualizados por cliente
 *     ClientePontosResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           description: Status da operação
 *         message:
 *           type: string
 *           description: Mensagem de retorno
 *         data:
 *           type: object
 *           properties:
 *             id_cliente:
 *               type: integer
 *               description: ID do cliente
 *             pontos:
 *               type: integer
 *               description: Pontos do cliente
 */

module.exports = class PontosRouter {
    constructor() {
        this._router = require('express').Router();
        this._pontosMiddleware = new PontosMiddleware();
        this._pontosController = new PontosController();
        this._jwtMiddleware = new JWTMiddleware();
    }

    criarRotas = () => {
        /**
         * @swagger
         * /api/pontos:
         *   post:
         *     summary: Calcula e atualiza pontos dos clientes
         *     description: Compara apostas dos clientes com resultados reais e atualiza pontos
         *     tags: [Pontos]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/PontosRequest'
         *     responses:
         *       201:
         *         description: Pontos calculados com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/PontosResponse'
         *       400:
         *         description: Dados inválidos ou erro no cálculo
         */
        this._router.post('/',
            this._pontosMiddleware.validateEventId,
            this._pontosController.createPontos
        );

        /**
         * @swagger
         * /api/pontos/{id_cliente}:
         *   get:
         *     summary: Busca pontos de um cliente específico
         *     description: Retorna os pontos de um cliente específico
         *     tags: [Pontos]
         *     parameters:
         *       - in: path
         *         name: id_cliente
         *         required: true
         *         schema:
         *           type: integer
         *         description: ID do cliente
         *     responses:
         *       200:
         *         description: Pontos do cliente recuperados com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ClientePontosResponse'
         *       400:
         *         description: ID do cliente inválido
         *       500:
         *         description: Erro interno do servidor
         */
        this._router.get('/:id_cliente',
            this._pontosMiddleware.validateClientId,
            this._pontosController.getPontosCliente
        );

        /**
         * @swagger
         * /api/pontos/ranking/todos:
         *   get:
         *     summary: Lista ranking de pontos de todos os clientes
         *     description: Retorna lista de todos os clientes ordenados por pontos (maior para menor)
         *     tags: [Pontos]
         *     responses:
         *       200:
         *         description: Ranking de pontos recuperado com sucesso
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: boolean
         *                 message:
         *                   type: string
         *                 data:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       id_cliente:
         *                         type: integer
         *                       nome_cliente:
         *                         type: string
         *                       pontos_cliente:
         *                         type: integer
         *       500:
         *         description: Erro interno do servidor
         */
        this._router.get('/ranking/todos',
            this._pontosController.getAllPontos
        );

        return this._router;
    };

    get router() {
        return this._router;
    }

    set router(value) {
        this._router = value;
    }

    get pontosMiddleware() {
        return this._pontosMiddleware;
    }

    set pontosMiddleware(value) {
        this._pontosMiddleware = value;
    }

    get pontosController() {
        return this._pontosController;
    }

    set pontosController(value) {
        this._pontosController = value;
    }

    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(value) {
        this._jwtMiddleware = value;
    }
};