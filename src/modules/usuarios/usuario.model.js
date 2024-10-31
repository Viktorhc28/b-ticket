const {
    Model,
    DataTypes
} = require('sequelize');
const sequelize = require('../../config/config');

class Usuario extends Model {}
Usuario.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    fono: DataTypes.STRING,
    estado: DataTypes.INTEGER,
    creado: DataTypes.DATE,
    password: DataTypes.STRING,
    password_inicial: DataTypes.STRING,
    password_activado: DataTypes.INTEGER,
    codigo_recuperacion: DataTypes.STRING,
    codigo_verificacion: DataTypes.STRING,
    verificado: DataTypes.BOOLEAN,
    rol_id: DataTypes.INTEGER,
    empresa_id: DataTypes.INTEGER
}, {
    sequelize,
    tableName: 'usuario',
    modelName: 'Usuario'
});

Usuario.prototype.toJSON =  function () 
{   var values = Object.assign({}, this.get());   
    delete values.password;   
    return values; 
}

module.exports = Usuario;