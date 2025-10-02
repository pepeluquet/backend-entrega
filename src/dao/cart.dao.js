const CartModel = require('../models/cart.model.js');

class CartDao {
    async createCart() {
        return await CartModel.create({ products: [] });
    }

    async getCartById(id) {
        return await CartModel.findById(id).populate('products.product');
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

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        cart.products = cart.products.filter(p => !p.product.equals(productId));
        await cart.save();
        return cart.populate('products.product');
    }

    async replaceCartProducts(cartId, products) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        cart.products = products;
        await cart.save();
        return cart.populate('products.product');
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        const prod = cart.products.find(p => p.product.equals(productId));
        if (prod) {
            prod.quantity = quantity;
            await cart.save();
            return cart.populate('products.product');
        }
        return null;
    }

    async clearCart(cartId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        cart.products = [];
        await cart.save();
        return cart.populate('products.product');
    }
}

module.exports = CartDao;