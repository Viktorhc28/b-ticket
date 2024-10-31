const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/config');

class Asientos extends Model { }
Asientos.init({
    row_label: DataTypes.STRING,
    seat_number: DataTypes.NUMBER,
    estado: DataTypes.STRING,
    layout: DataTypes.STRING,
    row_label: DataTypes.STRING
}, {
    sequelize,
    tableName: 'asientos',
    modelName: 'Asientos'
});

module.exports = Asientos;
