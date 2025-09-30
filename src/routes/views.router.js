const express = require('express');
const axios = require('axios');
const router = express.Router();

// Vista principal de productos paginados
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, sort, category, status } = req.query;
    try {
        // Llama al endpoint paginado de productos
        const { data } = await axios.get(`http://localhost:8080/api/products`, {
            params: { page, limit, sort, category, status }
        });
        res.render('index', {
            products: data.payload,
            prevLink: data.prevLink,
            nextLink: data.nextLink,
            page: data.page,
            totalPages: data.totalPages
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
});

// Vista detalle de carrito
router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const { data } = await axios.get(`http://localhost:8080/api/carts/${cid}`);
        res.render('cartDetail', { products: data });
    } catch (error) {
        res.status(500).send('Error al obtener el carrito');
    }
});

module.exports = router;