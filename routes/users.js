const express = require('express')
const router = express.Router()
const Users = require('../model/user')
const bcrypt = require('bcrypt')


router.get('/', async (req, res) => {
    try {
        const users = await Users.find({})
        return res.send(users)
    } catch (err) {
        return res.send({ error: 'erro na consulta de usuarios' })
    }
})

router.get('/', (req, res) => {
    Users.find({}, (err, data) => {
        if (err) return res.send({ error: `erro na consulta de usuarios` })
        return res.send(data)
    })
})

router.post('/create', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.send({ error: `dados insuficientes` })

    try {
        if (await Users.findOne({ email })) return res.send({ error: 'Usuario ja registrado' })

        const user = await Users.create(req.body)
        user.password = undefined
        return res.send(user)
    }
    catch (err) {
        return res.send({ error: `erro ao buscar os usuarios` })
    }
})

router.post('/auth', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.send({ error: 'Dados insuficientes' })

    try {
        const user = await Users.findOne({ email }).select('+password')
        if (!user) return res.send({ error: 'usuario nao registrado' })

        const pass_ok = await bcrypt.compare(password, user.password)

        if (!pass_ok) return res.send({ error: 'Erro ao atutenticar usuario' })

        user.password = undefined
        return res.send(user)
    }
    catch (err) {
        return res.send({ error: 'Erro ao buscar usuario' })
    }
})

module.exports = router;