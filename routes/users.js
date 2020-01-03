const express = require('express')
const router = express.Router()
const Users = require('../model/user')
const bcrypt = require('bcrypt')


router.get('/users', (req, res) => {
    Users.find({}, (err, data) => {
        if (err) return res.send({ error: `erro na consulta de usuarios` })
        return res.send(data)
    })
})

router.post('/create', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.send({ error: `dados insuficientes` })

    Users.findOne({ email }, (err, data) => {
        if (err) return res.send({ error: `erro ao buscar os usuarios` })
        if (data) return res.send({ error: `usuario ja criado` })

        Users.create(req.body, (err, data) => {
            if (err) return res.send({ error: `erro ao criar o usuario` })

            data.password = undefined
            return res.send(data)
        })
    })
})

router.post('/auth', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.send({ error: 'Dados insuficientes' })

    Users.findOne({ email }, (err, data) => {
        if (err) return res.send({ error: 'Erro ao buscar usuario' })
        if (!data) return res.send({ error: 'usuario nao registrado' })

        bcrypt.compare(password, data.password, (err, same) => {
            if (!same) return res.send({ error: 'Erro ao atutenticar usuario' })

            data.password = undefined
            return res.send(data)
        })
    }).select('+password')
})

module.exports = router;