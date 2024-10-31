/**
 * Retorna un String Random. Se pasa por parámetro el largo del string (`length`) y los caracteres disponibles para randomizar (`chars`).
 * @param {*} length 
 * @param {*} chars 
 * @returns Un String aleatorio en base al largo del campo (`length`).
 */
function randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

module.exports = {
    randomString
}