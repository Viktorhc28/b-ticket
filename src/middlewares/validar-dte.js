const { response, request } = require('express');

const validarDTE = async (req = request, res = response, next) => {
    try {
        let isNumber = false;
        const tipoDTE = req.body.tipo_dte;
        if (typeof tipoDTE === "number") isNumber = true;
        if (!isValidDTE(isNumber ? tipoDTE : parseInt(tipoDTE))) {
            return res.status(400).json({
                ok: false,
                msg: 'Ingrese un Tipo de DTE válido.',
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            msg: 'Ingrese un Tipo de DTE válido.',
        });
    }
}

const validarDTEParams = async (req = request, res = response, next) => {
    try {
        let isNumber = false;
        const tipoDTE = req.params.tipo_dte;
        if (typeof tipoDTE === "number") isNumber = true;
        if (tipoDTE != 0 && !isValidDTE(isNumber ? tipoDTE : parseInt(tipoDTE))) {
            return res.status(400).json({
                ok: false,
                msg: 'Ingrese un Tipo de DTE válido.',
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            msg: 'Ingrese un Tipo de DTE válido.',
        });
    }
}

/**
 * Método que verifica si el número de documento DTE es válido para el SII acorde a los siguientes valores:
 * 
 * 33: Factura Electrónica
 * 34: Factura No Afecta o Exenta Electrónica
 * 39: Boleta Electrónica
 * 41: Boleta No Afecta o Exenta Electrónica
 * 43: Liquidación Factura Electrónica
 * 46: Factura de Compra Electrónica
 * 52: Guía de Despacho Electrónica
 * 56: Nota de Débito Electrónica
 * 61: Nota de Crédito Electrónica
 * 110: Factura de Exportación
 * 111: Nota de Débito de Exportación
 * 112: Nota de Crédito de Exportación
 * 
 * @param {*} tipoDTE como valor numérico.
 * @returns Valor booleando dependiendo si es un DTE válido o no.
 */
function isValidDTE(tipoDTE) {
    switch (tipoDTE) {
        case 33: return true;
        case 34: return true;
        case 39: return true;
        case 41: return true;
        case 43: return true;
        case 46: return true;
        case 52: return true;
        case 56: return true;
        case 61: return true;
        case 110: return true;
        case 111: return true;
        case 112: return true;
        default: return false;
    }
}

module.exports = {
    validarDTE,
    validarDTEParams,
    isValidDTE,
}