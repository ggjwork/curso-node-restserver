const { Router } = require('express')
const { check } = require('express-validator')

const { obtenerCategorias, crearCategoria, obtenerCategoria, modificarCategoria, borrarCategoria } = require('../controllers/categorias')
const { existeNombreCategoria, existeCategoriaPorId } = require('../helpers/db-validators')

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares')


const router = Router()


/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorías - público
router.get('/', obtenerCategorias)

// Obtener una categoría por id - público
router.get(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],
    obtenerCategoria
)

// Crear categoría - privado - cualquier persona con token válido
router.post(
    '/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('nombre').custom(existeNombreCategoria),
        validarCampos
    ],
    crearCategoria
)

// Modificar categoría - privado - cualquier persona con token válido
router.put(
    '/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],
    modificarCategoria
)

// Borrar categoría - privado - admin
router.delete(
    '/:id',
    [
        validarJWT,
        esAdminRol,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoriaPorId),
        validarCampos
    ],
    borrarCategoria
)


module.exports = router
