const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/config');

class Autobus extends Model {}
Autobus.init({
    placa: {
        type: DataTypes.STRING,
        unique: true,
    },
    modelo: DataTypes.STRING,
    capacidad: DataTypes.INTEGER,
    ano_fabricacion: DataTypes.DATEONLY,
    seat_map:DataTypes.JSON
}, {
    sequelize,
    tableName: 'autobus',
    modelName: 'Autobus'
});

module.exports = Autobus;
