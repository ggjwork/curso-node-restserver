const { Usuario, Role, Categoria, Producto } = require('../models')


const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol })

    if (!existeRol) {
        throw new Error(`El rol ${ rol } no existe`)
    }
}


const existeEmail = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })

    if (existeEmail) {
        throw new Error(`El correo ${ correo } ya existe`)
    }
}


const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id)

    if (!existeUsuario) {
        throw new Error(`El id ${ id } no existe`)
    }
}


const existeNombreCategoria = async(nombre = '') => {
    const nombreFixed = nombre.toUpperCase()
    const existeCategoria = await Categoria.findOne({ nombre: nombreFixed })

    if (existeCategoria) {
        throw new Error(`La categoría con nombre ${ nombre } ya existe`)
    }
}


const existeCategoriaPorId = async(id) => {
    const existeCategoria = await Categoria.findById(id)

    if (!existeCategoria) {
        throw new Error(`El id ${ id } no existe`)
    }
}


const existeNombreProducto = async(nombre = '') => {
    const nombreFixed = nombre.toUpperCase()
    const existeProducto = await Producto.findOne({ nombre: nombreFixed })

    if (existeProducto) {
        throw new Error(`El producto con nombre ${ nombre } ya existe`)
    }
}


const existeProductoPorId = async(id) => {
    const existeProducto = await Producto.findById(id)

    if (!existeProducto) {
        throw new Error(`El id ${ id } no existe`)
    }
}


/**
 * Validar colecciones permitidas.
 */
const coleccionesPermitidas = (coleccion = '', coleccionesPermitidas = []) => {
    const incluida = coleccionesPermitidas.includes(coleccion)

    if (!incluida) {
        throw new Error(`La coleccion ${ coleccion } no es permitida - ${ coleccionesPermitidas }`)
    }


    return true
}


module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeNombreCategoria,
    existeCategoriaPorId,
    existeNombreProducto,
    existeProductoPorId,
    coleccionesPermitidas
}
