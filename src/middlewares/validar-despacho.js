const { response } = require('express')
const { Despacho, Sucursal, Stock, LineaDespacho, Producto } = require('../modules/associations');

const switchDespacho = (req, res = response, next) => {
    const { despacho } = req.body;
    if (despacho.tipo_destino == 2) {
        despacho.direccion_destino = null
    } else {
        despacho.sucursal_destino_id = null
    }
    next();
}

const validarStockSucursal = async (req, res = response, next) => {
    try {
        const { despacho, linea_despacho } = req.body;
        const model = await Despacho.findByPk(despacho.id);

        for (const element of linea_despacho) {
            const linea = await LineaDespacho.findByPk(element.id);

            if (!model.direccion_destino) {
                let stock_destino = await Stock.findOne({
                    where: { producto_id: linea.producto_id, sucursal_id: model.sucursal_destino_id }
                });
                if (!stock_destino) {
                    stock_destino = await Stock.create({ cantidad: 0, producto_id: linea.producto_id, sucursal_id: model.sucursal_destino_id });
                }
                stock_destino.cantidad -= element.cantidad_recibida;
                if (stock_destino.cantidad < 0) {
                    return res.status(400).json({
                        response: 'Stock Insuficiente de la Sucursal de destino'
                    });
                }
            } else if (!model.sucursal_destino_id) {
                next();
                return;
            }
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            response: 'Error al validar Stocks'
        });
    }
}

module.exports = {
    switchDespacho,
    validarStockSucursal
}