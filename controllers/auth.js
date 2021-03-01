const { request, response } = require("express");
const bcryptjs = require('bcryptjs')

const { Usuario } = require('../models');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req = request, res = response) => {
    const { correo, password } = req.body

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - No existe'
            })
        }


        // Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado false'
            })
        }


        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password incorrecto'
            })
        }


        // Generar el JWT
        const token = await generarJWT(usuario.id)


        res.json({
            usuario,
            token
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error en login'
        })
    }
}


const googleSingIn = async(req = request, res = response) => {
    const { id_token } = req.body

    try {
        const { correo, nombre, img } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id)


        res.json({
            msg: 'Todo ok google signin',
            usuario,
            token
        })
    }
    catch (error) {
        res.status(400).json({
            msg: 'Token de Google no válido'
        })
    }
}


module.exports = {
    login,
    googleSingIn
}
