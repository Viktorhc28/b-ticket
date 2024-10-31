
const Ruta = require('./ruta.model');

const controlador = {};

// Obtener todas las rutas
controlador.index = async (req, res) => {
    try {
        const rutas = await Ruta.findAll();
        return res.json(rutas);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Crear una nueva ruta
controlador.create = async (req, res) => {
    try {
        const { ruta } = req.body;
        const nuevaRuta = await Ruta.create(ruta);
        return res.status(201).json({ response: "Ruta creada con éxito", nuevaRuta });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Obtener una ruta por ID
controlador.view = async (req, res) => {
    try {
        const id = req.params.id;
        const ruta = await Ruta.findOne({ where: { id } });

        if (ruta) return res.json(ruta);
        return res.status(404).json({ response: "Ruta no encontrada" });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({ err: error, response: "Fallo del servidor" });
    }
};

// Actualizar una ruta
controlador.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { ruta } = req.body;

        const result = await Ruta.update(ruta, { where: { id } });

        if (result[0]) {
            return res.status(200).json({ response: "Ruta actualizada con éxito" });
        }
        return res.status(404).json({ response: "Ruta no encontrada" });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({ msg: 'Hable con el administrador' });
    }
};

// Eliminar una ruta
controlador.destroy = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Ruta.destroy({ where: { id } });

        if (result) {
            return res.status(200).json({ response: "Ruta eliminada con éxito" });
        }
        return res.status(404).json({ response: "Ruta no encontrada" });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({ msg: 'Hable con el administrador', error });
    }
};

module.exports = controlador;
