
const Ticket = require('./ticket.model');
const Viaje = require('../viaje/viaje.model');
const Autobus = require('../autobus/autobus.model');

const ticket = {};

// Obtener todos los tickets
ticket.index = async (req, res) => {
    try {
        const tickets = await Ticket.findAll({ include: { model: Viaje, as: 'viaje', include: { model: Autobus, as: 'autobus' } } });
        return res.json(tickets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Crear un nuevo ticket
ticket.create = async (req, res) => {
    try {
        const { ticket } = req.body;
        const nuevoTicket = await Ticket.create(ticket);
        return res.status(201).json({ response: "Ticket creado con éxito", nuevoTicket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Obtener un ticket por ID
ticket.view = async (req, res) => {
    try {
        const id = req.params.id;
        const ticket = await Ticket.findOne({ where: { id } });

        if (ticket) return res.json(ticket);
        return res.status(404).json({ response: "Ticket no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Actualizar un ticket
ticket.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { ticket } = req.body;

        const result = await Ticket.update(ticket, { where: { id } });

        if (result[0]) {
            return res.status(200).json({ response: "Ticket actualizado con éxito" });
        }
        return res.status(404).json({ response: "Ticket no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

// Eliminar un ticket
ticket.destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Ticket.destroy({ where: { id } });

        if (result) {
            return res.status(200).json({ response: "Ticket eliminado con éxito" });
        }
        return res.status(404).json({ response: "Ticket no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador', error });
    }
};

module.exports = ticket;
