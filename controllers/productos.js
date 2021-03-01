const { request, response } = require("express");

const { Producto } = require('../models')


const obtenerProductos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])

    res.json({
        total,
        productos
    })
}


const obtenerProducto = async(req = request, res = response) => {
    const { id } = req.params
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre')

    res.json(producto)
}


const crearProducto = async(req = request, res = response) => {
    const { estado, usuario, ...body } = req.body

    // Generar el data
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data)


    // Guardar DB
    await producto.save()

    res.status(201).json(producto)
}


const modificarProducto = async(req = request, res = response) => {
    const { id } = req.params
    const { _id, estado, usuario, ...resto } = req.body

    if (resto.nombre) {
        resto.nombre = resto.nombre.toUpperCase()
    }

    resto.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate(id, resto, { new: true })

    res.status(500).json(producto)
}


const borrarProducto = async(req = request, res = response) => {
    const { id } = req.params

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json(producto)
}


module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    modificarProducto,
    borrarProducto
}
