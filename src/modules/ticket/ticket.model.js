const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/config');

class Ticket extends Model { }
Ticket.init({
    asiento: DataTypes.INTEGER,
    fecha_compra: DataTypes.DATE,
    estado: DataTypes.INTEGER, //['pendiente', 'confirmado', 'cancelado'],
}, {
    sequelize,
    tableName: 'ticket',
    modelName: 'Ticket'
});

module.exports = Ticket;
