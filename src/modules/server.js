const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require("@sentry/profiling-node");

const express = require('express');
const sequelize = require('../config/config');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const loadRoutes = require('./app.routes');

class Server {
    constructor() {
        // Express
        this.app = express();
        this.port = process.env.PORT || 3500;

        // Inicializa Sentry
        this.initSentry(this.app);

        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server, { cors: { 'Access-Control-Allow-Origin': '*' } });

        //Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        loadRoutes(this.app);

        // Crons
        this.crons();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json({ limit: '50mb' }));

        this.app.use(express.urlencoded({
            limit: '50mb',
            extended: false
        }));

        // Habilita lectura de archivos via express (req.files).
        this.app.use(fileUpload());

        // Agregar el objeto io al middleware de Express
        this.app.use((req, res, next) => {
            req.io = this.io;
            next();
        });
    }

    conectarDB = async () => {
        try {
            await sequelize.sync({ force: false })
            console.log('Nos hemos conectado a la bd');
            console.log(this.port);
        } catch (error) {
            console.log(error);
            throw new Error('Error en conectar la base de datos.')
        }
    }

    initSentry(app) {
        if (!process.env.ENABLE_SENTRY || !process.env.SENTRY_DNS) return;
        Sentry.init({
            dsn: process.env.SENTRY_DNS,
            integrations: [
                // enable HTTP calls tracing
                new Sentry.Integrations.Http({ tracing: true }),
                // enable Express.js middleware tracing
                new Sentry.Integrations.Express({ app }),
                new ProfilingIntegration(),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0,
            // Set sampling rate for profiling - this is relative to tracesSampleRate
            profilesSampleRate: 1.0,
        });
    }


    crons = () => {
        // Inicia los Crons
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
