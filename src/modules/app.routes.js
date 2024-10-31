const baseRoute = '/api/v1';

const loadRoutes = (app) => {
    //Rutas
    app.get(`${baseRoute}`, (req, res) => { return res.json('Server Working') });

    app.use(`${baseRoute}/sesion`, require('./sesion/sesion.routes'));
    app.use(`${baseRoute}/ticket`, require('./ticket/ticket.routes'));
    app.use(`${baseRoute}/viaje`, require('./viaje/viaje.routes'));
    app.use(`${baseRoute}/ciudad`, require('./ciudad/ciudad.routes'));
    app.use(`${baseRoute}/autobus`, require('./autobus/autobus.routes'));
    app.use(`${baseRoute}/usuarios`, require('./usuarios/usuarios.routes'));
    app.use(`${baseRoute}/asientos`, require('./asientos/asientos.routes'));

}

module.exports = loadRoutes;