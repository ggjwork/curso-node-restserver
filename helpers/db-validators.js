const Roles = require('../models/role')
const usuario = require('../models/usuario')


const esRoleValido = async(rol = '') => {
    const existeRol = await Roles.findOne({ rol })

    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe`)
    }
}


const existeEmail = async(correo = '') => {
    const existeEmail = await usuario.findOne({ correo })

    if (existeEmail) {
        throw new Error(`El correo ${correo} ya existe`)
    }
}


const existeUsuarioPorId = async(id) => {
    const existeUsuario = await usuario.findById(id)

    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`)
    }
}


module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId
}
