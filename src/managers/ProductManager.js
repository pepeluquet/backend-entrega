const fs = require('fs').promises

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            }
            throw new Error('Error al leer el archivo de productos')
        }
    }

    async getProductById(id) {
        const products = await this.getProducts()
        return products.find(p => p.id === id)
    }

    async addProduct(product) {
        const products = await this.getProducts()
        const newProduct = { ...product, id: this.generateUniqueId(products) }
        products.push(newProduct)
        await this.saveProducts(products)
        return newProduct
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts()
        const index = products.findIndex(p => p.id === id)
        if (index !== -1) {
            products[index] = { ...products[index], ...updates, id: id }
            await this.saveProducts(products)
            return products[index]
        }
        return null
    }

    async deleteProduct(id) {
        let products = await this.getProducts()
        const initialLength = products.length
        products = products.filter(p => p.id !== id)
        if (products.length === initialLength) {
            throw new Error('Producto no encontrado para eliminar')
        }
        await this.saveProducts(products)
    }

    async saveProducts(products) {
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf8')
    }

    generateUniqueId(products) {
        return products.length > 0 ? (Math.max(...products.map(p => p.id)) + 1) : 1
    }
}

module.exports = ProductManager