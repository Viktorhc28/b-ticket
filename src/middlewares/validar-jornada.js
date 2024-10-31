const { Jornada, Caja } = require("../modules/associations");

const validarJornadaActiva = async (req = request, res = response, next) => {
    try {
        const sucursalID = req.header('Sucursal');
        const usuario = req.usuario;
        const jornada = await Jornada.findOne({
            where: { usuario_id: usuario.id, fecha_termino: null }, include: [
                { model: Caja, as: 'caja', where: { estado: 1, sucursal_id: sucursalID } }
            ]
        });
        if (!jornada) {
            return res.status(404).json({
                msg: 'Se requiere una jornada activa válida.'
            });
        }
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
    validarJornadaActiva,
}