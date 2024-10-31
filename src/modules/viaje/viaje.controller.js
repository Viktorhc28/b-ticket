
const { Ciudad, Autobus } = require('../associations');
const Viaje = require('./viaje.model');

const controlador = {};

// Obtener todos los viajes
controlador.index = async (req, res) => {
    try {
        const viajes = await Viaje.findAll({ include: [{ model: Ciudad, as: 'origen' }, { model: Ciudad, as: 'destino' }, { model: Autobus, as: 'autobus' }] });
        return res.json(viajes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Crear un nuevo viaje
controlador.create = async (req, res) => {
    try {
        const { viaje } = req.body;
        const nuevoViaje = await Viaje.create(viaje);
        return res.status(201).json({ response: "Viaje creado con éxito", nuevoViaje });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Obtener un viaje por ID
controlador.view = async (req, res) => {
    try {
        const id = req.params.id;
        const viaje = await Viaje.findOne({ where: { id } });

        if (viaje) return res.json(viaje);
        return res.status(404).json({ response: "Viaje no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Actualizar un viaje
controlador.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { viaje } = req.body;

        const result = await Viaje.update(viaje, { where: { id } });

        if (result[0]) {
            return res.status(200).json({ response: "Viaje actualizado con éxito" });
        }
        return res.status(404).json({ response: "Viaje no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

// Eliminar un viaje
controlador.destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Viaje.destroy({ where: { id } });

        if (result) {
            return res.status(200).json({ response: "Viaje eliminado con éxito" });
        }
        return res.status(404).json({ response: "Viaje no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador', error });
    }
};

module.exports = controlador;
