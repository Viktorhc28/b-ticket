const { response, request } = require('express');
const { Usuario, Rol, Empresa } = require('../associations')
const { kuv_lazy_table } = require('../../helpers/kuv-lazy-table');
const passwordHash = require('password-hash');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const { sendToSentry } = require('../../helpers/sentry');

const view = async (req = request, res = response) => {
    try {
        const usuario = await Usuario.findByPk(req.body.id);

        return res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
}

const create = async (req = request, res = response) => {
    try {
        req.body.password = passwordHash.generate(req.body.password);
        const usuario = await Usuario.create(req.body);

        return res.status(201).json(usuario);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
}

const index = async (req = request, res = response) => {
    try {
        if (req.usuario.rol_id != 1) {
            req.body.filtered = true;
            req.body.filters.push({ column: 'rol_id', value: 1, op: 'ne' });
        }

        if (req.body.sorted) {
            if (req.body.sorted_by == 'rol') {
                req.body.order = [['rol', 'nombre', (req.body.sorted_asc) ? 'ASC' : 'DESC']];
            }
        } else {
            req.body.sorted = true;
            req.body.order = [['creado', 'DESC']];
        }

        const opts = kuv_lazy_table(req.body);
        opts.attributes = ['id', 'rut', 'nombre', 'apellido', 'creado', 'email', 'fono', 'estado', 'rol_id'];
        opts.include = [{ model: Rol, as: 'rol', attributes: ['nombre'] }];

        const result = await Usuario.findAndCountAll(opts);

        return res.status(200).json({ elements: result.rows, count: result.count });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
            error
        });
    }
}

const indexSelect = async (req = request, res = response) => {
    try {
        const result = await Usuario.findAll({ where: { estado: 1 } });

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
            error
        });
    }
}


const update = async (req, res = response) => {
    try {
        const id_usuario = req.params.id;
        const body = req.body;
        if (req.body.password) {
            req.body.password = passwordHash.generate(req.body.password);
        }

        const result = await Usuario.update(body, { where: { id: id_usuario } });

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const activate = async (req = request, res = response) => {
    try {
        const id_usuario = req.params.id;

        const result = await Usuario.update({ estado: 1 }, { where: { id: id_usuario } });

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
            error
        });
    }
}


const deactivate = async (req = request, res = response) => {
    try {
        const id_usuario = req.params.id;

        const result = await Usuario.update({ estado: 0 }, { where: { id: id_usuario } });

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
            error
        });
    }
}

const destroy = async (req = request, res = response) => {
    try {
        const id_usuario = req.params.id;

        const result = await Usuario.destroy({ where: { id: id_usuario } });

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
            error
        });
    }
}

const indexRolSelect = async (req = request, res = response) => {
    try {
        const result = await Rol.findAll({
            attributes: ['id', 'nombre'],
            where: { estado: 1, id: { [Op.ne]: 1 } }
        });

        return res.status(200).json(result)
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
            error
        });
    }
}

const excel = async (req = request, res = response) => {
    try {
        const workbook = new ExcelJS.Workbook();

        let worksheet = workbook.addWorksheet('Usuarios');

        worksheet.columns = [
            { header: 'ID', key: 'id' },
            { header: 'Fecha Creación', key: 'creado' },
            { header: 'RUT', key: 'rut' },
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido', key: 'apellido' },
            { header: 'Correo Electrónico', key: 'email' },
            { header: 'Rol', key: 'rol' },
            { header: 'Fono', key: 'fono' },
        ];

        if (req.body.sorted) {
            if (req.body.sorted_by == 'rol') {
                req.body.order = [['rol', 'nombre', (req.body.sorted_asc) ? 'ASC' : 'DESC']]
            }
        }
        const opts = kuv_lazy_table(req.body, true);

        opts.attributes = ['id', 'creado', 'rut', 'nombre', 'apellido', 'email', 'fono', 'estado', 'rol_id'];

        opts.include = [{ model: Rol, as: 'rol', attributes: ['nombre'] }];


        let datos_excel = [];

        const result = await Usuario.findAll(opts);

        for (let index = 0; index < result.length; index++) {
            datos_excel.push({
                id: result[index].id,
                creado: result[index].creado,
                rut: result[index].rut,
                nombre: result[index].nombre,
                apellido: result[index].apellido,
                email: result[index].email,
                fono: result[index].fono,
                estado: result[index].estado == 0 ? 'Desactivado' : 'Activado',
                rol: result[index].rol.nombre,
            });
        }

        worksheet.addRows(datos_excel);

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/xlsx');
        res.setHeader('Content-disposition', `attachment; filename=document.xlsx`);
        return res.send(buffer);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
            error
        });
    }
}


module.exports = {
    view,
    create,
    index,
    indexSelect,
    update,
    activate,
    deactivate,
    destroy,
    indexRolSelect,
    excel,
}