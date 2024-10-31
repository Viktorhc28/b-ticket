const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/config');

class Viaje extends Model {}
Viaje.init({
    fecha: DataTypes.DATE,
    fecha_hora_salida: DataTypes.DATE,
    fecha_hora_llegada: DataTypes.DATE,
    precio: DataTypes.INTEGER,
}, {
    sequelize,
    tableName: 'viaje',
    modelName: 'Viaje'
});

module.exports = Viaje;
