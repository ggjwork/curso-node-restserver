const { Router } = require('express')
const { check } = require('express-validator')

const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/usuarios')

const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators')

const {
    validarCampos,
    validarJWT,
    esAdminRol,
    tieneRol
} = require('../middlewares')


const router = Router()


router.get('/', usuariosGet)
router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password tiene que tener más de 6 caracteres').isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom(existeEmail),
        check('rol').custom(esRoleValido),
        validarCampos
    ],
    usuariosPost)

router.put(
    '/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRoleValido),
        validarCampos
    ],
    usuariosPut
)
router.patch('/', usuariosPatch)
router.delete(
    '/:id',
    [
        validarJWT,
        // esAdminRol,
        tieneRol('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
    ],
    usuariosDelete
)


module.exports = router
