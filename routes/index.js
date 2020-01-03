const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/', auth, (req, res) => {

    console.log(res.locals.auth_data)
    return res.send({ message: 'acesso autorizado' })
})
router.post('/', auth, (req, res) => {
    return res.send({ message: 'tudo ok com o metodo POST' })
})


module.exports = router;