const { Router } = require('express')
const { check } = require('express-validator')

const { obtenerProductos, crearProducto, obtenerProducto, modificarProducto, borrarProducto } = require('../controllers/productos')
const { existeNombreProducto, existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators')

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares')


const router = Router()


/**
 * {{url}}/api/productos
 */

// Obtener todas los productos - público
router.get('/', obtenerProductos)

// Obtener un producto por id - público
router.get(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos
    ],
    obtenerProducto
)

// Crear producto - privado - cualquier persona con token válido
router.post(
    '/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'No es un ID válido').isMongoId(),
        check('categoria').custom(existeCategoriaPorId),
        check('nombre').custom(existeNombreProducto),
        validarCampos
    ],
    crearProducto
)

// Modificar producto - privado - cualquier persona con token válido
router.put(
    '/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos
    ],
    modificarProducto
)

// Borrar producto - privado - admin
router.delete(
    '/:id',
    [
        validarJWT,
        esAdminRol,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos
    ],
    borrarProducto
)


module.exports = router
