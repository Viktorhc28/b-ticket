const { response, request } = require('express');
const { Empresa } = require('../modules/associations');

const validarCertificadoEmpresa = async (req = request, res = response, next) => {
    try {
        const empresa = await Empresa.findByPk(req.usuario.empresa_id);
        if (!empresa) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe la Empresa.',
                response: 'No existe la Empresa.'
            });
        }
        if (!empresa.certificado) {
            return res.status(404).json({
                ok: false,
                msg: 'Certificado Digital no encontrado. Por favor suba uno e inténtelo nuevamente.',
                detail: 'Certificado Digital no encontrado. Por favor suba uno e inténtelo nuevamente.',
                response: 'Certificado Digital no encontrado. Por favor suba uno e inténtelo nuevamente.',
            });
        }
        req.empresa = empresa;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            msg: 'Ingrese un Tipo de DTE válido.',
        });
    }
}


const validarCertificadoEmpresaCron = async (req = request, res = response, next) => {
    try {
        const empresa = await Empresa.findByPk(req.body.empresa_id);
        if (!empresa) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe la Empresa.',
                response: 'No existe la Empresa.'
            });
        }
        if (!empresa.certificado) {
            return res.status(404).json({
                ok: false,
                msg: 'Certificado Digital no encontrado. Por favor suba uno e inténtelo nuevamente.',
                detail: 'Certificado Digital no encontrado. Por favor suba uno e inténtelo nuevamente.',
                response: 'Certificado Digital no encontrado. Por favor suba uno e inténtelo nuevamente.',
            });
        }
        req.empresa = empresa;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            msg: 'Ingrese un Tipo de DTE válido.',
        });
    }
}

module.exports = {
    validarCertificadoEmpresa,
    validarCertificadoEmpresaCron,
}
