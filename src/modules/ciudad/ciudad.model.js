const {
    Model,
    DataTypes
} = require('sequelize');
const sequelize = require('../../config/config');

class Ciudad extends Model { }
Ciudad.init({
    nombre: DataTypes.STRING,
    pais: DataTypes.STRING,
    estado: DataTypes.INTEGER,
}, {
    sequelize,
    tableName: 'ciudad',
    modelName: 'Ciudad'
});

module.exports = Ciudad;