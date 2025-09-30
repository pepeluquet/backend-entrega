const fs = require('fs').promises;
const path = require('path');
const CartModel = require('../models/cart.model.js');

class CartDao {
    constructor(filePath) {
        this.filePath = path.resolve(__dirname, '..', filePath);
    }

    async createCart() {
        return CartModel.create({ products: [] });
    }

    async getCartById(id) {
        return CartModel.findById(id).populate('products.product');
    }

    async addProductToCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        const prod = cart.products.find(p => p.product.equals(productId));
        if (prod) {
            prod.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        await cart.save();
        return cart.populate('products.product');
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