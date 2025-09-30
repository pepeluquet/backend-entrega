const express = require('express');
const CartDao = require('../dao/cart.dao.js');
const CartService = require('../services/cart.services.js');
const CartController = require('../controllers/cart.controllers.js');

const router = express.Router();
const cartDao = new CartDao('data/carts.json');
const cartService = new CartService(cartDao);
const cartController = new CartController(cartService);

// POST /api/carts
router.post('/', cartController.createCart);

// GET /api/carts/:cid
router.get('/:cid', cartController.getCartProducts);

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', cartController.addProductToCart);
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);
router.put('/:cid', cartController.replaceCartProducts);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid', cartController.clearCart);

module.exports = router;