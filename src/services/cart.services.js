class CartService {
    constructor(cartDao) {
        this.cartDao = cartDao;
    }

    async createCart() {
        const carts = await this.cartDao.getCarts();
        const newCart = { id: this.cartDao.generateUniqueId(carts), products: [] };
        carts.push(newCart);
        await this.cartDao.saveCarts(carts);
        return newCart;
    }

    async getCartProducts(cartId) {
        const carts = await this.cartDao.getCarts();
        const cart = carts.find(c => String(c.id) === String(cartId));
        return cart ? cart.products : null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.cartDao.getCarts();
        const cart = carts.find(c => String(c.id) === String(cartId));
        if (!cart) return null;

        const productInCart = cart.products.find(p => String(p.product) === String(productId));
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
        await this.cartDao.saveCarts(carts);
        return cart;
    }

    async getCartById(cartId) {
        // Usa populate en el DAO
        return await this.cartDao.getCartById(cartId);
    }

    async removeProductFromCart(cartId, productId) {
        return await this.cartDao.removeProductFromCart(cartId, productId);
    }

    async replaceCartProducts(cartId, products) {
        return await this.cartDao.replaceCartProducts(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await this.cartDao.updateProductQuantity(cartId, productId, quantity);
    }

    async clearCart(cartId) {
        return await this.cartDao.clearCart(cartId);
    }
}

module.exports = CartService;