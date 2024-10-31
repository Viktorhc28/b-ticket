const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Usuario, Rol, GrupoPermiso, PermisoRol, Permiso, LineaGrupoPermiso } = require("../modules/associations")

const tienePermisos = async (req = request, res = response, next) => {
    try {
        let controlador = req.baseUrl.split('/api/v1/')[1];
        let metodo = req.method;
        let accion = req.url.split('/')[1];

        let rol = await Rol.findByPk(req.usuario.rol_id);
        if (rol.id == 1) return next();

        let gruposRol = await PermisoRol.findAll({ where: { rol_id: rol.id } });
        let grupos = await GrupoPermiso.findAll({ where: { id: { [Op.in]: gruposRol.map(e => e.grupo_permiso_id) } } });
        let lineaGrupo = await LineaGrupoPermiso.findAll({ where: { grupo_permiso_id: { [Op.in]: grupos.map(e => e.id) } } });
        let tienePermisos = !!(await Permiso.findOne({ where: { id: { [Op.in]: lineaGrupo.map(e => e.permiso_id) }, controlador: controlador, metodo: metodo, accion: accion } }));

        if (tienePermisos) {
            next();
        } else {
            return res.status(401).json({ msg: 'No tiene permisos para acceder a esta función.' })
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    tienePermisos
}