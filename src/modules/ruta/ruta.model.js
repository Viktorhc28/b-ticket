const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/config');

class Ruta extends Model {}
Ruta.init({
    origen: DataTypes.STRING,
    destino: DataTypes.STRING,
    duracion: DataTypes.TIME,
    distancia: DataTypes.FLOAT,
}, {
    sequelize,
    tableName: 'ruta',
    modelName: 'Ruta'
});

module.exports = Ruta;
