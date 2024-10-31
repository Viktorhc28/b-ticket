const { response, request } = require('express');
const { Empresa } = require('../modules/associations');

const validarEmpresa = async (req = request, res = response, next) => {
    try {
        const empresa = req.header('empresa');
        if (!empresa) {
            req.empresa = req.usuario.empresa_id;
        }
        req.empresa = parseInt(empresa);
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

const validarEmpresaV2 = async (req = request, res = response, next) => {
    try {
        const empresaID = req.params.id ? req.params.id : req.body.id;
        const empresa = await Empresa.findByPk(empresaID);
        if (!empresa) {
            return res.status(404).json({
                msg: 'Se requiere una empresa válida.'
            });
        }
        req.empresa = empresa;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

const validarEmpresaJWT = async (req = request, res = response, next) => {
    try {
        const empresaID = req.usuario.empresa_id;
        const empresa = await Empresa.findByPk(empresaID);
        if (!empresa) {
            return res.status(404).json({
                msg: 'Se requiere una empresa válida.'
            });
        }
        req.empresa = empresa;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarEmpresa,
    validarEmpresaV2,
    validarEmpresaJWT,
}