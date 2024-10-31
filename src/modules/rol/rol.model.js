const {
    Model,
    DataTypes
} = require('sequelize');
const sequelize = require('../../config/config');

class Rol extends Model { }
Rol.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    estado: DataTypes.INTEGER,
}, {
    sequelize,
    tableName: 'rol',
    modelName: 'Rol'
});

module.exports = Rol;