const { Router } = require('express');
const { check } = require('express-validator');

const {
    create,
    index,
    update,
    activate,
    deactivate,
    destroy,
    excel,
    indexSelect,
    indexRolSelect,
    view
} = require('./usuarios.controller')

const { emailExisteUsuario, esRoleValido, existeUsuarioPorId } = require('../../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    esAdmin,
    esSuperAdmin,
} = require('../../middlewares');

const router = Router();

//create
router.post('/crear', [
    validarJWT,
    esAdmin,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('username', 'El nombre de usuario es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExisteUsuario),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('rol_id').custom(esRoleValido),
    validarCampos
], create);

router.post('/ver', [
    validarJWT,
    esAdmin
], index);

router.get('/ver-select', [
    validarJWT,
    esAdmin
], indexSelect);

router.post('/view', [
    validarJWT,
    esAdmin
], view);

router.post('/excel', [
    validarJWT,
    esAdmin
], excel);

router.get('/ver-rol-select', [
    validarJWT,
    esAdmin
], indexRolSelect);

router.put('/actualizar/:id', [
    validarJWT,
    esAdmin,
    check('id', 'El id de usuario no es un valor válido').isNumeric(),
    check('id').custom(existeUsuarioPorId),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('rol_id').custom(esRoleValido),
    validarCampos
], update);

router.delete('/activar/:id', [
    validarJWT,
    esAdmin,
    check('id', 'El id de usuario no es un valor válido').isNumeric(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], activate);

router.delete('/desactivar/:id', [
    validarJWT,
    esAdmin,
    check('id', 'El id de usuario no es un valor válido').isNumeric(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], deactivate);

router.delete('/eliminar/:id', [
    validarJWT,
    esSuperAdmin,
    check('id', 'El id de usuario no es un valor válido').isNumeric(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], destroy);

module.exports = router;