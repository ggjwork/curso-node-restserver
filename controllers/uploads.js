const { request, response } = require("express");
const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models')


const cargarArchivo = async(req = request, res = response) => {
    try {
        // txt, md
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos')
        const nombre = await subirArchivo(req.files, undefined, 'imgs')
        res.json({ nombre })
    }
    catch (msg) {
        res.status(400).json({ msg })
    }
}


const actualizarImagen = async(req = request, res = response) => {
    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }

        break
        case 'productos':
            modelo = await Producto.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }

        break
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }


    // Limpiar imagen antigua
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }


    const nombre = await subirArchivo(req.files, undefined, coleccion)
    modelo.img = nombre

    await modelo.save()


    res.json(modelo)
}


const mostrarImagen = async(req = request, res = response) => {
    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }

        break
        case 'productos':
            modelo = await Producto.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }

        break
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }


    // Limpiar imagen antigua
    if (modelo.img) {
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }


    const pathImagenNoExiste = path.join(__dirname, '../assets/no-image.jpg')

    if (fs.existsSync(pathImagenNoExiste)) {
        return res.sendFile(pathImagenNoExiste)
    }


    res.json({
        msg: 'No se encontró la imagen'
    })
}


const actualizarImagenCloudinary = async(req = request, res = response) => {
    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }

        break
        case 'productos':
            modelo = await Producto.findById(id)

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }

        break
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }


    // Limpiar imagen antigua
    if (modelo.img) {
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[ nombreArr.length - 1 ]
        const [ public_id ] = nombre.split('.')

        cloudinary.uploader.destroy(public_id)
    }


    const { tempFilePath } = req.files.archivo
    const resp = await cloudinary.uploader.upload(tempFilePath)

    modelo.img = resp.secure_url

    await modelo.save()


    res.json(resp)
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
