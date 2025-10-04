const express = require('express');
const ProductDao = require('../dao/products.dao.js');
const CartDao = require('../dao/cart.dao.js');
const router = express.Router();

const productDao = new ProductDao();
const cartDao = new CartDao();

// Vista principal de productos paginados
router.get('/', async (req, res) => {
    // Obtiene los query params con valores por defecto
    const { limit = 10, page = 1, sort, query } = req.query;

    // Construye el filtro
    const filter = {};
    if (query) {
        // Si query es 'true' o 'false', filtra por status
        if (query === 'true' || query === 'false') {
            filter.status = query === 'true';
        } else {
            // Si no, filtra por categoría
            filter.category = query;
        }
    }

    // Opciones de paginación y ordenamiento
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true
    };
    if (sort) {
        options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    try {
        const result = await productDao.getAll(filter, options);

        // Links para la vista
        const baseUrl = '/';
        const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
        const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

        res.render('index', {
            products: result.docs,
            prevLink,
            nextLink,
            page: result.page,
            totalPages: result.totalPages
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
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