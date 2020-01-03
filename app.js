const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config/config')
const app = express()

const indexRoute = require('./routes/index.js')
const usersRoute = require('./routes/users')

//CONFIGURANDO O MONGOOSE
const url = config.bd_string
const options = { useNewUrlParser: true, useUnifiedTopology: true }


mongoose.connect(url, options)
mongoose.set('useCreateIndex', true)

mongoose.connection.on('connected', () => {
    console.log('aplicação conectada ao banco de dados')
})

mongoose.connection.on('error', (err) => {
    console.log(`erro no banco de dados: ${err}`)
})
mongoose.connection.on('disconnected', () => {
    console.log('aplicação desconectada')
})

//CONFIGURANDO O BODY-PARSER
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/', indexRoute)
app.use('/users', usersRoute)

app.listen(3000, (req, res) => {
    console.log('servidor conectado')
})
module.exports = app