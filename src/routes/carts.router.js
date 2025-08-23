const express = require('express');
const CartManager = require('../managers/CartManager.js');

const router = express.Router();
const cartManager = new CartManager('./data/carts.json');

// POST /api/carts
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const products = await cartManager.getProductsInCart(cid);
        if (products) {
            res.json(products);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos del carrito' });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        if (updatedCart) {
            res.json(updatedCart);
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

module.exports = router;