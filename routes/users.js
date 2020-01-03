const express = require('express')
const router = express.Router()
const Users = require('../model/user')


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


module.exports = router;