const express = require('express')
const ProductManager = require('../managers/ProductManager.js')

const router = express.Router()
const productManager = new ProductManager('./data/products.json')

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' })
    }
})

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        const product = await productManager.getProductById(pid)
        if (product) {
            res.json(product)
        } else {
            res.status(404).json({ error: 'Producto no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' })
    }
})

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body)
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        const updatedProduct = await productManager.updateProduct(pid, req.body)
        if (updatedProduct) {
            res.json(updatedProduct)
        } else {
            res.status(404).json({ error: 'Producto no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' })
    }
})

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        await productManager.deleteProduct(pid)
        res.status(204).send()
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' })
    }
})

module.exports = router