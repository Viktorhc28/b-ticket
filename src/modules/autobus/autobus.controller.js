
const { fn, col } = require('sequelize');
const Autobus = require('./autobus.model');
const { Asientos } = require('../associations');

const controlador = {};

// Obtener todos los autobuses
controlador.index = async (req, res) => {
    try {
        const autobuses = await Autobus.findAll({
            attributes: [
              'placa','modelo','ano_fabricacion', // Incluye todas las columnas de Autobus
              [fn('COUNT', col('asientos.row_label')), 'asientoCount'] // Contar `row_label` en `asientos`
            ],
            include: [
              {
                model: Asientos,
                as: 'asientos',
                attributes: []
              }
            ],
            group: ['Autobus.id'] // Agrupar por `Autobus.id` para que el conteo funcione correctamente
          });
        return res.json(autobuses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Crear un nuevo autobús
controlador.create = async (req, res) => {
    try {
        const { autobus } = req.body;
        const nuevoAutobus = await Autobus.create(autobus);
        return res.status(201).json({ response: "Autobús creado con éxito", nuevoAutobus });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Obtener un autobús por ID
controlador.view = async (req, res) => {
    try {
        const id = req.params.id;
        const autobus = await Autobus.findOne({ where: { id } });

        if (autobus) return res.json(autobus);
        return res.status(404).json({ response: "Autobús no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Actualizar un autobús
controlador.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { autobus } = req.body;


        const result = await Autobus.update(autobus, { where: { id } });
        return res.status(200).json({ response: "Autobús actualizado con éxito" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

// Eliminar un autobús
controlador.destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Autobus.destroy({ where: { id } });

        if (result) {
            return res.status(200).json({ response: "Autobús eliminado con éxito" });
        }
        return res.status(404).json({ response: "Autobús no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador', error });
    }
};

module.exports = controlador;
