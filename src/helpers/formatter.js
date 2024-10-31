/** 
 * [Deprecated]: Usar dateFormat() en su lugar.
 * 
 * Esta función se utiliza para formatear una fecha en un formato específico (dd-mm-yyyy).
 * Si la fecha es `null` o `undefined`, se devuelve `null`.
 * @param {Date} date - La fecha a formatear.
 * @returns {string|null} La fecha formateada en el formato dd-mm-yyyy, o `null` si la fecha es
 * `null` o `undefined`.
 */
const formatDate = ( date ) => {
    if (date) {
        let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
    } else {
        return null
    }
}

const capitalize = (texto) => {
    return texto.substring(0, 1).toUpperCase() + texto.substring(1);
}

/**
 * Esta función se utiliza para formatear una fecha en un formato específico (dd-mm-yyyy).
 * Si la fecha es `null` o `undefined`, se devuelve `null`.
 * @param {Date} date - La fecha a formatear.
 * @returns {string|null} La fecha formateada en el formato dd-mm-yyyy, o `null` si la fecha es
 * `null` o `undefined`.
 */
const dateFormat = ( date, format = 'dd-mm-yyyy' ) => {
    if (date) {
        let dias = ['','lunes', 'martes', 'jueves', 'miércoles', 'viernes', 'sábado', 'domingo'];
        let meses = ['','enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        let d = date;
        if (typeof (date) == 'string') d = new Date(date);
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        dayOfWeek = d.getDay(),
        year = d.getFullYear();
        hour = d.getHours();
        minute = d.getMinutes();
        second = d.getSeconds();
    
        if (month.toString().length < 2) month = '0' + month;
        if (day.toString().length < 2) day = '0' + day;
        if (hour.toString().length < 2) hour = '0' + hour;
        if (minute.toString().length < 2) minute = '0' + minute;
        if (second.toString().length < 2) second = '0' + second;

        let result = format + '';
        result = result.replace('hh', hour);
        result = result.replace('ii', minute);
        result = result.replace('ss', second);
        result = result.replace('ddd', dias[parseInt(dayOfWeek)]);
        result = result.replace('Ddd', capitalize(dias[parseInt(dayOfWeek)]));
        result = result.replace('DDD', dias[parseInt(dayOfWeek)].toUpperCase());
        result = result.replace('dd', day);
        result = result.replace('mmm', meses[parseInt(month)]);
        result = result.replace('Mmm', capitalize(meses[parseInt(month)]));
        result = result.replace('MMM', meses[parseInt(month)].toUpperCase());
        result = result.replace('mm', month);
        result = result.replace('yyyy', year);
    
        return result
    } else {
        return null
    }
}

function formatFullDateAndHours(date) {
    const df = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    return df.format(new Date(date));
}

/**
 * Esta función se utiliza para formatear un número con un número específico de decimales. Si el
 * número no es un número válido, se devuelve un mensaje de error especificado.
 * @param {number} num - El número a formatear.
 * @param {number} [minDecimal=0] - El número mínimo de decimales a incluir en el número
 * formateado.
 * @param {number} [maxDecimal=2] - El número máximo de decimales a incluir en el número
 * formateado.
 * @param {string} [errMsg='N.D.'] - El mensaje de error a devolver si el número no es válido.
 * @returns {string} El número formateado con el número especificado de decimales, o el mensaje de
 * error si el número no es válido.
 */
const numberFormat = (num, minDecimal = 0, maxDecimal = 2, errMsg = 'N.D.') => {
    try {
        if(!num && num != 0) return '';
        return num.toLocaleString('es-CL', { minimumFractionDigits: minDecimal, maximumFractionDigits: maxDecimal });
    } catch (error) {
        console.error(error);
        return errMsg;
    }
}

/**
 * Limpia una cadena de caracteres que representa un RUT en Chile.
 *
 * @param {any} value - El valor a limpiar. Puede ser cualquier tipo de valor.
 * @return {string} La cadena de caracteres limpia, en mayúsculas. Si value no es una cadena, devuelve una cadena vacía.
 */
const rutClean = (value) => {
    if (typeof value === 'string') {
        return value
            .replace(/[^0-9kK]+/g, '')
            .replace(/^0+/, '')
            .toUpperCase();
    }
    return '';
}

/**
 * Da formato a una cadena de caracteres que representa un RUT en Chile.
 *
 * @param {any} value - El valor a dar formato. Puede ser cualquier tipo de valor.
 * @return {string} La cadena de caracteres con formato. Si value no es una cadena o tiene una longitud menor o igual a 1, devuelve el valor sin formato.
 */
const rutFormat = (value) => {
    const rut = rutClean(value);
    if (rut.length <= 1) {
        return rut;
    }
    let result = `${rut.slice(-4, -1)}-${rut.slice(-1)}`;
    for (let i = 4; i < rut.length; i += 3) {
        result = `${rut.slice(-3 - i, -i)}.${result}`;
    }
    return result;
}

  /**
   * Retorna la concatencación de nombre y apellido
   * @param persona Object el objeto que tiene nombre y apellido
   * @param nombre string el identificador del nombre
   * @param apellido string el identificador del apellido
   * @returns 
   */
const nombreCompleto = (persona, nombre = "nombre", apellido = "apellido") => {
    let palabras = [];
    if (!persona) return "";
    if (persona[nombre]) palabras.push(persona[nombre]);
    if (persona[apellido]) palabras.push(persona[apellido]);
    return palabras.join(' ');
}

const notNull = (valor, mensaje = "") => {
    if (!valor) return mensaje;
    return valor;
}

const labelEstadoOT = (estado) => {
    switch (estado) {
        case -1:
            return 'Anulada';
        case 1:
            return 'Pendiente';
        case 2:
            return 'En Proceso';
        case 3:
            return 'Completada';
        default:
            return '';
    }
}

const labelNumber = (number, array, error = '') => {
    let data = array[number];
    if(data ?? false) return error;
    return data;
}

module.exports = {
    formatDate,
    dateFormat,
    formatFullDateAndHours,
    numberFormat,
    rutClean,
    rutFormat,
    nombreCompleto,
    notNull,
    capitalize,
    labelEstadoOT
}