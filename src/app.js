const express = require('express')
const productsRouter = require('./routes/products.router.js')
const cartsRouter = require('./routes/carts.router.js')

const app = express()
const PORT = 8080

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})