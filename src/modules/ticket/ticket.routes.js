const { Router } = require('express');
const { check } = require('express-validator');
const { index, view, destroy, update, create } = require('./ticket.controller');
const { validarJWT, tieneRole } = require('../../middlewares');

const router = Router();

router.get('/index', /* [validarJWT, tieneRole(1)], */ index);
router.get('/view/:id', /* [validarJWT, tieneRole(1)], */ view);
router.post('/create', /* [validarJWT, tieneRole(1),  *//* check('ticket.viaje_id', 'El viaje es obligatorio').notEmpty()], */ create);
router.put('/update/:id', /* [validarJWT, tieneRole(1)], */ update);
router.delete('/delete/:id', /* [validarJWT, tieneRole(1)], */ destroy);

module.exports = router;
