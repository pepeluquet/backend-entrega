const fs = require('fs').promises
const crypto = require("crypto")
const ProductModel = require('../models/product.model.js');

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
    async getAll(query = {}, options = {}) {
        return ProductModel.paginate(query, options);
    }
    async getById(id) {
        return ProductModel.findById(id);
    }
    async create(productData) {
        return ProductModel.create(productData);
    }
    async update(id, updateData) {
        return ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    async delete(id) {
        return ProductModel.findByIdAndDelete(id);
    }
}

module.exports = ProductDao