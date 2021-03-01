const { request, response } = require("express");

const { Categoria } = require('../models')


const obtenerCategorias = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ])

    res.json({
        total,
        categorias
    })
}


const obtenerCategoria = async(req = request, res = response) => {
    const { id } = req.params
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json(categoria)
}


const crearCategoria = async(req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase()

    // Generar el data
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)


    // Guardar DB
    await categoria.save()

    res.status(201).json(categoria)
}


const modificarCategoria = async(req = request, res = response) => {
    const { id } = req.params
    const { _id, estado, usuario, ...resto } = req.body

    resto.nombre = resto.nombre.toUpperCase()
    resto.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true })

    res.status(500).json(categoria)
}


const borrarCategoria = async(req = request, res = response) => {
    const { id } = req.params

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false })

    res.json(categoria)
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    modificarCategoria,
    borrarCategoria
}
