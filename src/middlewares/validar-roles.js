const { response } = require('express')

const esSuperAdmin = (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol_id, nombre } = req.usuario;

    if (rol_id !== 1) {
        return res.status(401).json({
            msg: `${nombre} no es Superadministrador - No puede hacer esto`
        });
    }
    next();
}

const esAdmin = (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const { rol_id, nombre } = req.usuario;

    if (rol_id > 2) {
        return res.status(401).json({
            msg: `No posee permisos para realizar esta operación.`
        });
    }
    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol_id)) {
            return res.status(401).json({
                msg: `No tiene permisos para esta función.`
            });
        }
        next();
    }
}

module.exports = {
    esSuperAdmin,
    esAdmin,
    tieneRole,
}