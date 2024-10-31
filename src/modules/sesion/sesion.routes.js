const { Router } = require('express');
const { check } = require('express-validator');
const { login, changePassword, recuperarPassword, restablecerPassword, updateUsuario, sendCodeToRecoverPass, checkCodeToRecoverPass, changePassFromRecover, loginApp, changeFirstPassword, verificarSesion, empresas } = require('./sesion.controller');

const {
    validarCampos,
    validarJWT,
    tieneRole
} = require('../../middlewares');

const { emailComprobar } = require('../../helpers/db-validators');

const router = Router();

router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], login);

router.post('/login-app', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    validarCampos
], loginApp);

router.put('/update-usuario', [
    validarJWT,
    tieneRole(1, 2, 3, 4),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('fono', 'El apellido es obligatorio').notEmpty(),
    validarCampos
], updateUsuario);

router.post('/change-password', [
    validarJWT,
    tieneRole(1, 2, 3, 4),
    check('oldPass', 'El password es obligatorio').notEmpty(),
    check('newPass', 'El password es obligatorio').notEmpty(),
    validarCampos
], changePassword);

router.post('/change-initial-password', [
    validarJWT,
    tieneRole(1, 2, 3, 4),
    check('initialPass', 'El password inicial es obligatorio').notEmpty(),
    check('newPass', 'El nuevo password es obligatorio').notEmpty(),
    validarCampos
], changeFirstPassword);

router.post('/recuperar-pass', [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(emailComprobar),
    validarCampos
], recuperarPassword);

router.post('/recuperar-pass-app', [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(emailComprobar),
    validarCampos
], sendCodeToRecoverPass);

router.post('/recuperar-pass-app-check-code', [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(emailComprobar),
    check('code', 'El codigo es obligatorio').notEmpty(),
    validarCampos
], checkCodeToRecoverPass);

router.post('/recuperar-pass-app-new-pass', [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(emailComprobar),
    check('newPass', 'El new pwd es obligatorio').notEmpty(),
    check('code', 'El codigo es obligatorio').notEmpty(),
    validarCampos
], changePassFromRecover);


router.post('/restablecer', [
    validarJWT,
    tieneRole(1, 2, 3, 4),
    check('newPass', 'El password es obligatorio').notEmpty(),
    validarCampos
], restablecerPassword);


router.get('/is-logged',
    validarJWT,
    verificarSesion,
);

router.get('/empresas', [
    validarJWT,
    tieneRole(1, 2),
    validarCampos
], empresas);

module.exports = router;