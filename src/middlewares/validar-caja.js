const { response, request } = require('express');
const { Op } = require('sequelize');
const { Caja, Sucursal, Jornada } = require('../modules/associations');

const existeCaja = async (req = request, res = response, next) => {
    try {
        const id = req.params.id;
        const caja = await Caja.findByPk(id);
        if (!caja) {
            return res.status(404).json({
                response: 'No existe la caja.'
            });
        }
        req.caja = caja;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            response: 'Error al encontrar la caja'
        });
    }
}

const validarCaja = async (req = request, res = response, next) => {
    try {
        const id = req.params.id;
        const caja = await Caja.findOne({ where: { [Op.and]: [{ id: id, estado: 1 }] } });
        if (!caja) {
            return res.status(404).json({
                response: 'No existe la caja o se encuentra desactivada.'
            });
        }
        req.caja = caja;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            response: 'Error al encontrar la caja.'
        });
    }
}

const validarMiCaja = async (req = request, res = response, next) => {
    try {
        const usuario = req.usuario;
        if (!usuario) {
            return res.status(404).json({
                response: 'Debe ingresar un usuario en la solicitud.'
            });
        }

        const sucursalID = req.header('Sucursal');
        if (!sucursalID) {
            return res.status(404).json({
                response: 'Debe ingresar una sucursal en la solicitud.'
            });
        }
        const sucursal = await Sucursal.findByPk(sucursalID);
        if (!sucursalID) {
            return res.status(404).json({
                response: 'La sucursal no existe.'
            });
        }

        // Verifica si la caja este habilitada y le pertenece al usuario, empresa y sucursal.
        const caja = await Caja.findOne({ where: { [Op.and]: [{ estado: 1 }, { sucursal_id: sucursal.id }] } });
        if (!caja) {
            return res.status(200).json({
                caja_activa: false,
                response: 'No existe la caja o se encuentra desactivada.'
            });
        }

        const jornada = await Jornada.findOne({
            where: { usuario_id: usuario.id, fecha_termino: null }, include: [
                { model: Caja, as: 'caja', where: { estado: 1, sucursal_id: sucursalID } }
            ]
        });
        if (!jornada) {
            return res.status(200).json({
                caja_activa: false,
                msg: 'Se requiere una jornada activa válida.'
            });
        }
        req.caja = caja;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            response: 'Error al encontrar la caja.'
        });
    }
}

module.exports = {
    existeCaja,
    validarCaja,
    validarMiCaja,
}