const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const { Usuario } = require('../models')


const usuariosGet = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}


const usuariosPost = async(req, res) => {
    const { nombre, correo, password, rol } = req.body

    const usuario = new Usuario({
        nombre,
        correo,
        password,
        rol
    })

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10)
    usuario.password = bcryptjs.hashSync(password, salt)

    // Guardar en BD
    await usuario.save()

    res.status(201).json({
        msg: 'post API - controlador',
        usuario
    })
}


const usuariosPut = async(req, res) => {
    const { id } = req.params
    const { _id, password, google, correo, ...resto } = req.body

    // TODO validar contra base de datos
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10)
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.status(500).json(usuario)
}


const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
}


const usuariosDelete = async(req, res) => {
    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })

    res.json(usuario)
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
