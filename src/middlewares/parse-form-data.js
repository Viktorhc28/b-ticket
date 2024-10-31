const { response, request } = require('express');

const parseFormData = async (req = request, res = response, next) => {
    try {
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] == 'null') req.body[key] = null;
            if (req.body[key] == 'undefined') req.body[key] = undefined;
            if (req.body[key] && (req.body[key].includes(' ') || req.body[key].includes('/') || req.body[key].includes(',') || req.body[key].includes('-'))) req.body[key] = req.body[key];
            if (parseFloat(req.body[key]) != req.body[key]) req.body[key] = req.body[key];
            else if (!isNaN(parseFloat(req.body[key]))) req.body[key] = parseFloat(req.body[key]);
        });
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    parseFormData
}