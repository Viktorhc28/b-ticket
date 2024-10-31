const { response } = require('express');
const Autobus = require('../modules/autobus/autobus.model');

const existePlaca = async (req, res = response, next) => {
    try {
        // Verifica si el objeto 'autobus' existe en el cuerpo de la solicitud
        const { autobus } = req.body;
        console.log(autobus);
        if (!autobus || !autobus.placa) {
            return res.status(400).json({
                response: 'Falta la placa del autobús en la solicitud.',
            });
        }

        // Busca en la base de datos si ya existe la placa
        const existingAutobus = await Autobus.findOne({ where: { placa: autobus.placa } });
        console.log(existingAutobus);
        // Si existe, devuelve un error
        if (existingAutobus) {
            return res.status(409).json({
                response: 'La placa ya existe en la base de datos.',
            });
        }

        // Continúa con la siguiente función del middleware
        next();
    } catch (error) {
        // Manejo de errores
        console.error(error);
        return res.status(500).json({
            response: 'Error en el servidor. Intenta de nuevo más tarde.',
        });
    }
};

module.exports = {
    existePlaca,
};
