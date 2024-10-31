const Usuario = require('./usuarios/Usuario.model')
const Rol = require('./rol/rol.model');
const Viaje = require('./viaje/viaje.model');
const Autobus = require('./autobus/autobus.model');
const Ruta = require('./ruta/ruta.model');
const Ticket = require('./ticket/ticket.model');
const Asientos = require('./asientos/asientos.model');
const Ciudad = require('./ciudad/ciudad.model');

//Relacion rol - usuario (1-n)
Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });

Autobus.hasMany(Viaje, { foreignKey: 'autobus_id' })
Viaje.belongsTo(Autobus, { foreignKey: 'autobus_id', as: 'autobus' })

Viaje.hasMany(Ticket, { foreignKey: 'viaje_id' })
Ticket.belongsTo(Viaje, { foreignKey: 'viaje_id', as: 'viaje' })

Usuario.hasMany(Ticket, { foreignKey: 'usuario_id' })
Ticket.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' })

Autobus.hasMany(Asientos, { foreignKey: 'autobus_id', as: 'asientos' })
Asientos.belongsTo(Autobus, { foreignKey: 'autobus_id', as: 'autobus' })

Autobus.hasMany(Ticket, { foreignKey: 'ticket_id', as: 'ticket' })
Ticket.belongsTo(Autobus, { foreignKey: 'ticket_id', as: 'ticket' })

Ciudad.hasOne(Viaje, { foreignKey: 'origen_id' })
Ciudad.hasOne(Viaje, { foreignKey: 'destino_id' })
Viaje.belongsTo(Ciudad, { foreignKey: 'origen_id', as: 'origen' })
Viaje.belongsTo(Ciudad, { foreignKey: 'destino_id', as: 'destino' })

module.exports = {
    Usuario,
    Rol,
    Viaje,
    Autobus,
    Ruta,
    Ticket,
    Asientos,
    Ciudad
}