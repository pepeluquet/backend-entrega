const express = require('express')
const router = express.Router()
const ProductManager = require('../managers/ProductManager.js')
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
        const {
            title,
            description,
            code,
            price,
            status = true,
            stock,
            category,
            thumbnails = []
        } = req.body;

        // Validación de campos obligatorios
        if (
            !title ||
            !description ||
            !code ||
            typeof price !== 'number' ||
            typeof stock !== 'number' ||
            !category
        ) {
            return res.status(400).json({ error: 'Faltan campos obligatorios o tipos incorrectos.' });
        }

        // Validación de thumbnails como array
        if (!Array.isArray(thumbnails)) {
            return res.status(400).json({ error: 'Thumbnails debe ser un array de strings.' });
        }

        // El id se autogenera en el ProductManager
        const newProduct = await productManager.addProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updates = { ...req.body };

    // No permitir modificar el id
    if ('id' in updates) {
        return res.status(400).json({ error: 'No se puede modificar el id del producto.' });
    }

    // Lista de campos permitidos y sus tipos
    const allowedFields = {
        title: 'string',
        description: 'string',
        code: 'string',
        price: 'number',
        status: 'boolean',
        stock: 'number',
        category: 'string',
        thumbnails: 'object'
    };

    // Validar campos enviados
    for (const key of Object.keys(updates)) {
        if (!(key in allowedFields)) {
            return res.status(400).json({ error: `Campo no permitido: ${key}` });
        }
        // Validar tipo de dato (excepto thumbnails que debe ser array)
        if (key === 'thumbnails') {
            if (!Array.isArray(updates[key])) {
                return res.status(400).json({ error: 'Thumbnails debe ser un array de strings.' });
            }
        } else if (typeof updates[key] !== allowedFields[key]) {
            return res.status(400).json({ error: `Tipo incorrecto para el campo ${key}.` });
        }
    }

    try {
        const updatedProduct = await productManager.updateProduct(pid, updates);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
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