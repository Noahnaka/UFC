const express = require("express");
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');
const ClienteRouter = require("./backend/router/2_clienteRouter");
const UfcRouter = require("./backend/router/3_ufcRouter");

const { connectToDatabase } = require('./backend/model/Db');  

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API UNIBET',
            version: '1.0.0',
            description: 'Documentação da API UNIBET',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: 'Servidor de Desenvolvimento',
            },
        ],
    },
    apis: ['./backend/router/*.js'], // Caminho para os arquivos que contêm as rotas
};

class Servidor {
    constructor() {
        this._porta = process.env.PORT;
        this._app = express();
        this._app.use(cors({
            origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080', 'https://techfala2.sanjaworks.com.br'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            exposedHeaders: ['Access-Control-Allow-Origin']
        }));
        this._app.use(express.json({ limit: '100mb' })); 
        this._app.use(express.urlencoded({ extended: true, limit: '100mb' })); 
        
        this._clienteRouter = new ClienteRouter();
        this._ufcRouter = new UfcRouter();
        this.configurarRotas();
    }

    configurarRotas = () => {
        const swaggerDocs = swaggerJsDoc(swaggerOptions);
        this._app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
        
        this._app.use("/api/cliente", this._clienteRouter.criarRotas());
        this._app.use("/api/ufc", this._ufcRouter.criarRotas());
    }

    iniciar = async () => {
        try {
            await connectToDatabase();
            
            this._app.listen(this._porta, () => {
                console.log(`Server running at http://localhost:${this._porta}/`);
                console.log(`Swagger documentation available at http://localhost:${this._porta}/api/docs`);
            });
        } catch (error) {
            console.error('Error starting server:', error);
            process.exit(1);
        }
    }
}

// Create and start server instance
const servidor = new Servidor();
servidor.iniciar();
 