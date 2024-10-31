
const { Op } = require('sequelize');
const { Autobus } = require('../associations');
const Asientos = require('./asientos.model');

const controlador = {};

// Obtener todos los autobuses
controlador.index = async (req, res) => {
    try {
        const asientos = await Asientos.findAll({ include: [{ model: Autobus, as: 'autobus', attributes: ['placa'] }] });
        return res.json(asientos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Crear un nuevo autobús
controlador.create = async (req, res) => {
    try {
        const { asientos } = req.body;

        let asiento = await Asientos.findOne({
            where: {
                [Op.or]: [
                    {
                        autobus_id: asientos.autobus_id,
                    },
                    {
                        seat_number: asientos.seat_number,
                    },
                ],
            },
        })
        if (!asiento) {
            const nuevoAsientos = await Asientos.create(asientos);
            return res.status(201).json({ response: "asiento creado con éxito", nuevoAsientos });
        } else {

        } return res.status(500).json({ response: "Asiento ya Existe" });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Obtener un autobús por ID
controlador.view = async (req, res) => {
    try {
        const id = req.params.id;
        const asientos = await Asientos.findOne({ where: { id } });

        if (asientos) return res.json(asientos);
        return res.status(404).json({ response: "asiento no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Actualizar un autobús
controlador.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { asientos } = req.body;


        const result = await Asientos.update(asientos, { where: { id } });
        return res.status(200).json({ response: "asiento actualizado con éxito" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

// Eliminar un autobús
controlador.destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Asientos.destroy({ where: { id } });

        if (result) {
            return res.status(200).json({ response: "asiento eliminado con éxito" });
        }
        return res.status(404).json({ response: "asiento no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador', error });
    }
};

module.exports = controlador;
