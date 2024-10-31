
const Ciudad = require('./ciudad.model');

const controlador = {};

// Obtener todas las ciudades
controlador.index = async (req, res) => {
    try {
        const ciudades = await Ciudad.findAll();
        return res.json(ciudades);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

controlador.select = async (req, res) => {
    try {
        const ciudades = await Ciudad.findAll({ where: { estado: 1 } });
        return res.json(ciudades);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Crear una nueva ciudad
controlador.create = async (req, res) => {
    try {
        const { ciudad } = req.body;
        const nuevaCiudad = await Ciudad.create(ciudad);
        return res.status(201).json({ response: "Ciudad creada con éxito", nuevaCiudad });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Obtener una ciudad por ID
controlador.view = async (req, res) => {
    try {
        const id = req.params.id;
        const ciudad = await Ciudad.findOne({ where: { id } });

        if (ciudad) return res.json(ciudad);
        return res.status(404).json({ response: "Ciudad no encontrada" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Actualizar una ciudad
controlador.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { ciudad } = req.body;

        const result = await Ciudad.update(ciudad, { where: { id } });
        if (result[0] === 0) {
            return res.status(404).json({ response: "Ciudad no encontrada" });
        }
        return res.status(200).json({ response: "Ciudad actualizada con éxito" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

// Eliminar una ciudad
controlador.destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Ciudad.destroy({ where: { id } });

        if (result) {
            return res.status(200).json({ response: "Ciudad eliminada con éxito" });
        }
        return res.status(404).json({ response: "Ciudad no encontrada" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Hable con el administrador', error });
    }
};

module.exports = controlador;
