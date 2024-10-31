const { Nutriente } = require('../modules/associations')
const { response, request } = require('express');
const { Op } = require('sequelize');

/**
 * Formatea una fecha
 * @param {*} date Fecha
 * @returns Fecha en formato string.
 */
function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

function formatOnlyHours(date) {
    return date.substring(11, 16);
}


function randomPwd(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function nombreCompleto(persona, nombre = "nombre", apellido = "apellido") {
    if (!persona) return "";
    if (!persona[apellido]) return persona[nombre];
    return persona[nombre] + " " + persona[apellido];
}

module.exports = {
    formatDate,
    randomPwd,
    nombreCompleto,
    formatOnlyHours,
}