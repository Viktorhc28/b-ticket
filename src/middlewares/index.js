
const validaCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const validaRoles = require('./validar-roles');
const validarEmpresa = require('./validar-empresa');
const guardarHistorial = require('./guardar-historial');
const tienePermisos = require('./tiene-permisos');
const validarCaja = require('./validar-caja');
const validarJornada = require('./validar-jornada');
const getJornada = require('./get-jornada');
const parseFormData = require('../middlewares/parse-form-data');

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarEmpresa,
    ...guardarHistorial,
    ...tienePermisos,
    ...validarCaja,
    ...validarJornada,
    ...getJornada,
    ...parseFormData,
}