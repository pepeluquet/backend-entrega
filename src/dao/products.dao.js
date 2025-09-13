const fs = require('fs').promises
const crypto = require("crypto")

class ProductDao {
    constructor(filePath) {
        this.filePath = filePath
    }

    async #readFile() {
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
    async #writeFile(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2))
        } catch (error) {
            throw new Error('Error al escribir en el archivo de productos')
        }
    }
    #generateId() {
        return crypto.randomUUID
    }
    async getAll() {
        const products = await this.#readFile()
        return products
    }
    async getById(id) {
        const products = await this.#readFile()
        return products.find(p => String(p.id) === String(id))
    }
    async create(product) {
        const products = await this.#readFile()
        const newId = this.#generateId();
        const newProduct = { ...product, id: newId };
        products.push(newProduct)
        await this.#writeFile(products)
        return newProduct
    }
    async update(id, updates) {
        const products = await this.#readFile()
        const index = products.findIndex(p => String(p.id) === String(id))
        if (index !== -1) {
            products[index] = { ...products[index], ...updates, id: products[index].id }
            await this.#writeFile(products)
            return products[index]
        }
        return null
    }
    async delete(id) {
        let products = await this.#readFile()
        const initialLength = products.length
        products = products.filter(p => String(p.id) !== String(id))
        if (products.length === initialLength) {
            throw new Error('Producto no encontrado para eliminar')
        }
        await this.#writeFile(products)
    }
}

module.exports = ProductDao