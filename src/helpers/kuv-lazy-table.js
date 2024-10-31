const { Op } = require('sequelize');

/**
 * Esta función se utiliza para crear un objeto de opciones que se puede utilizar para filtrar,
 * ordenar y paginar una tabla de datos.
 * @param {object} action - Un objeto que contiene información sobre cómo se deben filtrar,
 * ordenar y paginar los datos de la tabla.
 * @param {boolean} [excel=false] - Una bandera booleana que indica si se deben incluir todos los
 * datos de la tabla (sin paginar) en el objeto de opciones.
 * @returns {object} Un objeto de opciones que incluye información sobre cómo se deben filtrar,
 * ordenar y paginar los datos de la tabla.
 */
const kuv_lazy_table = (action, excel = false) => {

    //Crea un objeto `opts` que incluye un desplazamiento (offset) y un límite (limit).

    //El desplazamiento se utiliza para determinar cuántos registros se deben saltar al principio de la tabla, y el límite se utiliza para determinar cuánto registros se deben incluir en la tabla. 

    //Si el parametro `excel` es `verdadera`, se establece el desplazamiento y el límite en `null` para incluir todos los registros de la tabla.

    let opts = {
        offset: (!excel) ? (action.page - 1) * action.pageSize : null,
        limit: (!excel) ? action.pageSize : null
    }

    // Si el objeto `action` incluye una propiedad `sorted`, significa que se ha solicitado un
    // ordenamiento de la tabla. En este caso, se agrega una propiedad `order` al objeto `opts`
    // que incluye la columna de ordenamiento y el tipo de ordenamiento (ascendente o descendente).
    if (action.sorted) {
        if (action.sorted_by && action.sorted_by.includes('.')) {
            let sorted_by = action.sorted_by.split('.');
            opts.order = (action.order) ? action.order : [[...sorted_by, (action.sorted_asc) ? 'ASC' : 'DESC']]
        } else {
            opts.order = (action.order) ? action.order : [[action.sorted_by, (action.sorted_asc) ? 'ASC' : 'DESC']]
        }
    }

    // Si el objeto `action` incluye una propiedad `filtered`, significa que se han especificado
    // filtros para la tabla. En este caso, se crea una propiedad `where` en el objeto `opts`
    // que incluye las condiciones de filtro especificadas en el objeto `action`.
    if (action.filtered) {

        const filtros = action.filters

        let condiciones = [];
        let subCondiciones = [];
        // Itera sobre cada filtro y agrega una condición de filtro al arreglo `condiciones`. La
        // condición de filtro incluye la columna a filtrar, el tipo de operador de comparación y el
        // valor a comparar. Si el operador de comparación es 'like' o 'substring', se agrega un
        // comodín al valor a comparar.

        for (let index = 0; index < filtros.length; index++) {
            if (filtros[index].value && typeof (filtros[index].value) == 'string') filtros[index].value = filtros[index].value.trim();

            if (filtros[index].cond || filtros[index].cond === 'subcondicion') {
                subCondiciones.push({ [filtros[index].column]: { [Op[filtros[index].op]]: (filtros[index].op === 'like' || filtros[index].op === 'substring') ? '%' + filtros[index].value + '%' : filtros[index].value } });
            } else {
                condiciones.push({ [filtros[index].column]: { [Op[filtros[index].op]]: (filtros[index].op === 'like' || filtros[index].op === 'substring') ? '%' + filtros[index].value + '%' : filtros[index].value } });
            }
        }

        if (subCondiciones.length !== 0) {
            condiciones.push({ [Op.or]: subCondiciones })
        }

        // Agrega las condiciones de filtro al objeto `opts` utilizando la cláusula `AND` de la librería `Sequelize`.
        opts.where = {
            [Op.and]: condiciones
        }
    }

    // Devuelve el objeto `opts` que incluye información sobre cómo se deben filtrar, ordenar y paginar los datos de la tabla.
    return opts
}

const kuv_lazy_table_empresa = (action = {}, empresa = null) => {
    //Paginación tabla
    let opts = {
        offset: (action.page - 1) * action.pageSize,
        limit: action.pageSize
    }

    //Opts para contador de tabla
    let opts_count = {}

    //Ordenamiento tabla
    if (action.sorted) {

        if (action.order) {
            opts.order = action.order
        } else {
            opts.order = [[action.sorted_by, (action.sorted_asc) ? 'ASC' : 'DESC']]
        }
    }


    //Filtro de tabla
    let condiciones = [];

    // Filtro de empresa
    condiciones.push({ empresa_id: empresa });

    // Filtros desde frontend
    if (action.filtered) {

        const filtros = action.filters


        for (let index = 0; index < filtros.length; index++) {
            condiciones.push({ [filtros[index].column]: { [Op[filtros[index].op]]: (filtros[index].op === 'like') ? '%' + filtros[index].value + '%' : filtros[index].value } });
        }

    }

    opts.where = {
        [Op.and]: condiciones
    }

    opts_count.where = {
        [Op.and]: condiciones
    }

    return { opts, opts_count };
}

module.exports = {
    kuv_lazy_table,
    kuv_lazy_table_empresa
}