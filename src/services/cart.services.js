class CartService {
    constructor(cartDao) {
        this.cartDao = cartDao;
    }

    async createCart() {
        return await this.cartDao.createCart();
    }

    async getCartProducts(cartId) {
        const cart = await this.cartDao.getCartById(cartId);
        return cart ? cart.products : null;
    }

    async addProductToCart(cartId, productId) {
        return await this.cartDao.addProductToCart(cartId, productId);
    }

    async getCartById(cartId) {
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