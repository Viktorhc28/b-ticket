const { Jornada, Caja } = require("../modules/associations");

const getJornada = async( req = request, res = response, next ) => {
    try {
        const usuario = req.usuario;
        const jornada = await Jornada.findOne({ where: { usuario_id: usuario.id, fecha_termino: null }, include: [{model:Caja, as: 'caja', where: {sucursal_id: req.header('Sucursal')}}] });
        req.jornada = jornada;
        next();
        return jornada;
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            msg: 'Error.'
        });
    }
}

module.exports = {
    getJornada,
}