const express = require('express')
const router = express.Router()

router.get('/users', (req, res) => {
    return res.send({ message: 'tudo ok com o metodo GET' })
})


module.exports = router;