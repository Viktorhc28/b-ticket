const { Parametro } = require("../modules/associations");

const validarParametros = async (req = request, res = response, next) => {
    try {
        const empresa = req.empresa;
        const parametros = await Parametro.findAll({ where: { empresa_id: empresa.id } });
        if (!parametros || parametros.length == 0) {
            await crearParametroSII(empresa.id);
            const newParametros = await Parametro.findAll({ where: { empresa_id: empresa.id } });
            if (!newParametros || newParametros.length == 0) {
                return res.status(404).json({
                    msg: 'No se encontraron los parámetros.'
                });
            }
            req.parametros = newParametros;
            next();
            return;
        }
        req.parametros = parametros;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

async function crearParametroSII(idEmpresa) {
    await Parametro.create({ clave: 'SII_ACTIVADO', valor: 0, empresa_id: idEmpresa });
}

module.exports = {
    validarParametros,
}