const { response } = require('express');
const passwordHash = require('password-hash');
const { Usuario, Rol, Empresa } = require('../associations')

const { transport, nombreSistemaAcortado, nombreSistema } = require('../../config/keys');
const util = require('util');
const fs = require('fs')
const { generarJWT } = require('../../helpers/generar-jwt');
const { sendToSentry } = require('../../helpers/sentry');
const { randomString } = require('../../helpers/utils');
const baseUrl = 'http://localhost:4400'; // (LOCAL)
const baseRoute = "./../../..";

const login = async (req, res = response) => {
    try {
        const { email, password } = req.body;

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({
            where: { [Op.and]: [{ email: email }, [{ rol_id: { [Op.ne]: 4 } }]] },
            include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
        });

        if (!usuario) {
            return res.status(404).json(
                { mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // Si el usuario está activo
        if (usuario.estado === 0) {
            return res.status(403).json(
                { mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // Verificar la contraseña
        const validPassword = passwordHash.verify(password, usuario.password);

        if (!validPassword) {
            return res.status(401).json(
                { internalCode: 1, mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        return res.status(200).json({
            usuario,
            token,
        });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
}

const loginApp = async (req, res = response) => {
    try {
        const { email, password } = req.body;

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({
            where: { [Op.and]: [{ email: email }, [{ rol_id: 4 }]] },
            include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }],
        });

        if (!usuario) {
            return res.status(404).json(
                { mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // SI el usuario está activo
        if (usuario.estado === 0) {
            return res.status(403).json(
                { mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // Verificar la contraseña
        const validPassword = passwordHash.verify(password, usuario.password);

        if (!validPassword) {
            return res.status(401).json(
                { internalCode: 1, mensaje: 'El nombre de usuario o la contraseña son incorrectos.' }
            );
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        return res.status(200).json({
            usuario,
            token,
        });
    } catch (err) {
        console.error(err);
        sendToSentry(err);
        return res.status(500).json({
            msg: 'Hable con el administrador',
        });
    }
}

const updateUsuario = async (req = request, res = response) => {
    try {
        const { nombre, apellido, fono } = req.body;

        const usuario = req.usuario;

        const result = await Usuario.update({
            nombre: nombre,
            apellido: apellido,
            fono: fono,
        }, {
            where: { id: usuario.id }
        });

        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const changePassword = async (req, res = response) => {
    try {
        const { oldPass, newPass } = req.body;

        const usuario = req.usuario;

        const validPassword = passwordHash.verify(oldPass, usuario.password);

        if (!validPassword) return res.status(401).json('La contraseña es incorrecta');

        const result = await Usuario.update({
            password: passwordHash.generate(newPass),
        }, {
            where: { id: usuario.id }
        });

        const filename = require.resolve(`${baseRoute}/src/assets/templates/pass-actualizada.html`);
        const readFile = util.promisify(fs.readFile);

        let html = await readFile(filename, 'utf-8');
        html = html.replace(new RegExp('{{nombreSistema}}', 'g'), `${nombreSistemaAcortado}`);
        html = html.replace('{{nombre}}', usuario.nombre + ' ' + usuario.apellido);
        html = html.replace('{{fecha}}', new Date().toLocaleString('es-CL'));

        // send mail with defined transport object
        await transport.sendMail({
            from: `Soporte "${nombreSistemaAcortado}" <${mailSender}>`,
            to: usuario.email,
            subject: "Actualización de Contraseña",
            html: html,
        });

        return res.json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const changeFirstPassword = async (req, res = response) => {
    try {
        const { initialPass, newPass } = req.body;
        const usuario = req.usuario;

        const validPassword = passwordHash.verify(initialPass, usuario.password_inicial);

        if (!validPassword) return res.status(401).json('La contraseña es incorrecta');

        const result = await Usuario.update({
            password: passwordHash.generate(newPass),
            password_activado: 1,
        }, {
            where: { id: usuario.id }
        });
        return res.json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

// Envío de correo para poder restablecer la contraseña (parte 1-2)
const recuperarPassword = async (req = request, res = response) => {
    try {
        const usuario = req.usuarioEmail;

        // Generar el JWT
        const token = await generarJWT(usuario.id, '10m');

        const filename = require.resolve(`${baseRoute}/src/assets/templates/recuperar-pass.html`);
        const readFile = util.promisify(fs.readFile);

        let html = await readFile(filename, 'utf-8');
        html = html.replace(new RegExp('{{nombreSistema}}', 'g'), `${nombreSistema}`);
        html = html.replace('{{nombre}}', usuario.nombre + ' ' + usuario.apellido);
        html = html.replace('{{fecha}}', new Date().toLocaleString('es-CL'));
        html = html.replace(new RegExp('{{enlace}}', 'g'), `${baseUrl}/restablecer/${token}`);

        // send mail with defined transport object
        const info = await transport.sendMail({
            from: `Soporte "${nombreSistema}" <${mailSender}>`,
            to: usuario.email,
            subject: "Recuperación de Contraseña",
            html: html,
        });
        return res.status(201).json(info);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

// Se restablece la contraseña despues de recibir el correo
const restablecerPassword = async (req = request, res = response) => {
    try {
        const { newPass } = req.body;

        const usuario = req.usuario;

        const result = await Usuario.update({
            password: passwordHash.generate(newPass),
        }, {
            where: { id: usuario.id }
        });

        const filename = require.resolve(`${baseRoute}/src/assets/templates/pass-restablecida.html`);
        const readFile = util.promisify(fs.readFile);

        let html = await readFile(filename, 'utf-8');
        html = html.replace(new RegExp('{{nombreSistema}}', 'g'), `${nombreSistemaAcortado}`);
        html = html.replace('{{nombre}}', usuario.nombre + ' ' + usuario.apellido);
        html = html.replace('{{fecha}}', new Date().toLocaleString('es-CL'));

        // send mail with defined transport object
        await transport.sendMail({
            from: `Soporte "${nombreSistemaAcortado}" <${mailSender}>`,
            to: usuario.email,
            subject: "Se ha cambiado tu contraseña",
            html: html,
        });

        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

/**
 * Send code to recover password from mobile app.
 * @param {*} req: email
 * @param {*} res: any 
 * @returns Una `Exception` en el caso que el usuario no exista, se encuentre inactivo, es un cliente o
 * si la contraseña no es válida. Retorna un `UsuarioSinPass` y un token en el caso de éxito.
 */
const sendCodeToRecoverPass = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ where: { email: req.body.email } });

        // Si el usuario no existe se retorna un error
        if (!usuario) {
            return res.status(404).json({
                mensaje: "El usuario no existe."
            });
        }
        const code = randomString(6, '0123456789');
        const filename = require.resolve(`${baseRoute}/src/assets/templates/recuperar-pass-app.html`);
        await Usuario.update({ codigo_recuperacion: code }, { where: { id: usuario.id } });

        const readFile = util.promisify(fs.readFile);
        let html = await readFile(filename, 'utf-8');
        html = html.replace(new RegExp('{{nombreSistema}}', 'g'), `${nombreSistema}`);
        html = html.replace('{{nombre}}', usuario.nombre + ' ' + usuario.apellido);
        html = html.replace('{{fecha}}', new Date().toLocaleString('es-CL'));
        html = html.replace('{{codigo}}', `${code}`);

        const message = {
            from: `Soporte "${nombreSistemaAcortado}" <${mailSender}>`,
            to: usuario.email,
            subject: "Código de Recuperación de Cuenta",
            html: html
        };
        // Enviar mensaje con el código generado
        transport.sendMail(message, (err, info) => {
            if (err) console.error(err);
            return res.status(500).json({
                mensaje: "Error al enviar el mensaje, intentelo denuevo."
            });
        });
        usuario.verification_code = code;
        await usuario.save();
        return res.json({
            response: "Correo electrónico enviado con éxito.",
            email: req.body.email
        });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador',
            error,
        });
    }
}

/**
 * Check code to recover password from mobile app.
 * @param {*} req: email, code
 * @param {*} res: any 
 * @returns Una `Exception` en el caso que el usuario no exista, se encuentre inactivo, es un cliente o
 * si la contraseña no es válida. Retorna un `UsuarioSinPass` y un token en el caso de éxito.
 */
const checkCodeToRecoverPass = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ where: { email: req.body.email } });
        // Si el usuario no existe se retorna un error
        if (!usuario) {
            return res.status(404).json({
                mensaje: "El usuario no existe."
            });
        }

        // Si el codigo temporal no es el mismo que el del usuario retorna error
        if (usuario.codigo_recuperacion != req.body.code) {
            return res.status(401).json({
                internalCode: 1,
                mensaje: "El código temporal es incorrecto. Inténtelo nuevamente."
            });
        }
        const usuarioSinPass = await Usuario.findByPk(usuario.id, { attributes: ['id', 'nombre', 'apellido', 'fono'] });
        return res.json({
            response: "Verificación realizada con éxito.",
            model: usuarioSinPass
        });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            mensaje: 'Ha ocurrido un error en la verificación.'
        });
    }
}

/**
 * Change password on recover from mobile app. Se valida también el código para asegurarse que el usuario venga desde el proceso de recuperación de contraseña.
 * @param {*} req: email, newPass, code
 * @param {*} res: any 
 * @returns Una `Exception` en el caso que el usuario no exista, se encuentre inactivo, es un cliente o
 * si la contraseña no es válida. Retorna un `UsuarioSinPass` y un token en el caso de éxito.
 */
const changePassFromRecover = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            where: {
                [Op.and]: [
                    { email: req.body.email },
                    { codigo_recuperacion: req.body.code },
                ]
            },
        });
        // Si el usuario no existe se retorna un error
        if (!usuario) {
            return res.status(404).json({
                mensaje: "El usuario no existe o falló la operación."
            });
        }

        // Cambiar la contraseña, estado de pwd inicial y guardar
        usuario.password = passwordHash.generate(req.body.newPass);
        usuario.password_activado = 1;
        usuario.codigo_recuperacion = '';
        await usuario.save();
        // Obtiene el usuario sin la contraseña
        const usuarioSinPass = await Usuario.findByPk(usuario.id, { attributes: ['id', 'email', 'rut', 'nombre', 'apellido', 'fono'] });
        
        const filename = require.resolve(`${baseRoute}/src/assets/templates/pass-restablecida.html`);
        const readFile = util.promisify(fs.readFile);

        let html = await readFile(filename, 'utf-8');
        html = html.replace(new RegExp('{{nombreSistema}}', 'g'), `${nombreSistemaAcortado}`);
        html = html.replace('{{nombre}}', usuario.nombre + ' ' + usuario.apellido);
        html = html.replace('{{fecha}}', new Date().toLocaleString('es-CL'));

        // send mail with defined transport object
        await transport.sendMail({
            from: `Soporte "${nombreSistemaAcortado}" <${mailSender}>`,
            to: usuario.email,
            subject: "Se ha cambiado tu contraseña",
            html: html,
        });
        
        return res.json({
            response: "Se ha cambiado la contraseña con éxito.",
            model: usuarioSinPass
        });
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            mensaje: "Ha ocurrido un error al cambiar la contraseña.",
            err,
        });
    }
}

const verificarSesion = async (req, res = response) => {
    try {
        const usuario = req.usuario;
        await Usuario.update({ ultimo_acceso: Date.now() }, { where: { id: usuario.id } });
        return res.json({ usuario: usuario });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const empresas = async (req = request, res = response) => {
    try {
        const result = await Empresa.findAll({
            where: { estado: 1 }
        });
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        sendToSentry(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    login,
    loginApp,
    updateUsuario,
    changePassword,
    changeFirstPassword,
    recuperarPassword,
    restablecerPassword,
    sendCodeToRecoverPass,
    checkCodeToRecoverPass,
    changePassFromRecover,
    changeFirstPassword,
    verificarSesion,
    empresas,
}
