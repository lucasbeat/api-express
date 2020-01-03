const express = require('express')
const Users = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const config = require('../config/config')

//FUNCOES AUXILIARES
const createUserToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt_pass, { expiresIn: config.jwt_expires_in })
}

router.get('/', async (req, res) => {
    try {
        const users = await Users.find({})
        return res.send(users)
    } catch (err) {
        return res.status(500).send({ error: 'erro na consulta de usuarios' })
    }
})

router.post('/create', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).send({ error: `dados insuficientes` })

    try {
        if (await Users.findOne({ email })) return res.status(400).send({ error: 'Usuario ja registrado' })

        const user = await Users.create(req.body)
        user.password = undefined
        return res.status(201).send({ user, token: createUserToken(user.id) })
    }
    catch (err) {
        return res.status(500).send({ error: `erro ao buscar os usuarios` })
    }
})

router.post('/auth', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).send({ error: 'Dados insuficientes' })

    try {
        const user = await Users.findOne({ email }).select('+password')
        if (!user) return res.status(400).send({ error: 'usuario nao registrado' })

        const pass_ok = await bcrypt.compare(password, user.password)

        if (!pass_ok) return res.status(401).send({ error: 'Erro ao atutenticar usuario' })

        user.password = undefined
        return res.send({ user, token: createUserToken(user.id) })
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro ao buscar usuario' })
    }
})

module.exports = router;