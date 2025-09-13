const fs = require('fs').promises
const ProductManager = require('../dao/products.dao.js')

class CartManager {
    constructor(filePath) {
        this.filePath = filePath
        this.productManager = new ProductManager('./data/products.json')
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            }
            throw new Error('Error al leer el archivo de carritos')
        }
    }

    async saveCarts(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf8')
    }

    generateUniqueId(carts) {
        return carts.length > 0 ? (Math.max(...carts.map(c => c.id)) + 1) : 1
    }

    async addCart() {
        const carts = await this.getCarts()
        const newCart = { id: this.generateUniqueId(carts), products: [] }
        carts.push(newCart)
        await this.saveCarts(carts)
        return newCart
    }

    async getProductsInCart(cartId) {
        const carts = await this.getCarts()
        const cart = carts.find(c => c.id === parseInt(cartId))
        return cart ? cart.products : null
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(c => c.id === parseInt(cartId))

        if (cartIndex === -1) {
            return null
        }

        const productToAdd = await this.productManager.getProductById(parseInt(productId))
        if (!productToAdd) {
            return null
        }

        const productInCartIndex = carts[cartIndex].products.findIndex(p => p.id === parseInt(productId))

        if (productInCartIndex !== -1) {
            carts[cartIndex].products[productInCartIndex].quantity++
        } else {
            carts[cartIndex].products.push({ id: parseInt(productId), quantity: 1 })
        }

        await this.saveCarts(carts)
        return carts[cartIndex]
    }
}

module.exports = CartManager