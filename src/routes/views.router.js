const express = require('express');
const ProductDao = require('../dao/products.dao.js');
const CartDao = require('../dao/cart.dao.js');
const router = express.Router();

const productDao = new ProductDao();
const cartDao = new CartDao();

// Vista principal de productos paginados
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, sort, query } = req.query;
    const filter = {};
    if (query) {
        if (query === 'true' || query === 'false') filter.status = query === 'true';
        else filter.category = query;
    }
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
        lean: true
    };
    const result = await productDao.getAll(filter, options);

    // Links para la vista
    const baseUrl = '/';
    const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}` : null;
    const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}` : null;

    res.render('index', {
        products: result.docs,
        prevLink,
        nextLink,
        page: result.page,
        totalPages: result.totalPages
    });
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartDao.getCartById(cid);
        if (!cart) return res.status(404).send('Carrito no encontrado');
        res.render('cartDetail', { products: cart.products });
    } catch (error) {
        res.status(500).send('Error al obtener el carrito');
    }
});

module.exports = router;