const fs = require('fs').promises;
const path = require('path');
const CartModel = require('../models/cart.model.js');

class CartDao {
    constructor(filePath) {
        this.filePath = path.resolve(__dirname, '..', filePath);
    }

    async createCart() {
        const newCart = await CartModel.create({ products: [] });
        return newCart;
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId).populate('products.product');
    }

    async addProductToCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        const productInCart = cart.products.find(p => p.product.equals(productId));
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();
        return cart;
    }

    async replaceCartProducts(cartId, products) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        cart.products = products;
        await cart.save();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        const productInCart = cart.products.find(p => p.product.toString() === productId);
        if (!productInCart) return null;
        productInCart.quantity = quantity;
        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        cart.products = [];
        await cart.save();
        return cart;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async saveCarts(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf8');
    }

    generateUniqueId(carts) {
        const ids = carts.map(c => Number(c.id)).filter(id => !isNaN(id));
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }
}

module.exports = CartDao;