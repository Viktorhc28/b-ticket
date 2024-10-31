const { Empresa, Parametro } = require('../modules/associations');

const validarSII = async (req = request, res = response, next) => {
    try {
        const empresa = req.empresa;
        if (!empresa) {
            return res.status(404).json({
                ok: false,
                msg: 'Ingrese una empresa válida.',
                response: 'Ingrese una empresa válida.'
            });
        }

        const parametro = await Parametro.findOne({ where: { empresa_id: empresa.id } });
        if (!parametro) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el Parámetro para la empresa ingresada.',
                response: 'No existe el Parámetro para la empresa ingresada.'
            });
        }
        const siiActivado = validarParametroSII(parametro);
        if (!siiActivado) {
            return res.status(400).json({
                ok: false,
                msg: 'El SII no se encuentra habilitado para la Empresa.',
                detail: 'El SII no se encuentra habilitado para la Empresa.',
                response: 'El SII no se encuentra habilitado para la Empresa.',
            });
        }
        req.sii = siiActivado;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            msg: 'Ingrese un Tipo de DTE válido.',
        });
    }
}

/**
 * Función que retorna true si el SII a través de la clave 'sii_activado' existe y si su valor es '1'.
 * 
 * Es importante señalar que la entrada Parámetro debe poseer la clave 'sii_activado'. De lo contrario, el resultado siempre será false.
 * @param {*} parametro 
 * @returns 
 */
function validarParametroSII(parametros) {
    if (parametros.length == 0) return false;
    for (let parametro of parametros) {
        if (parametro.clave == 'SII_ACTIVADO' && parametro.valor == '1') return true;
    }
    return false;
}

module.exports = {
    validarSII,
    validarParametroSII,
}
