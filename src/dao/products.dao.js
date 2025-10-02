// const fs = require('fs').promises
const crypto = require("crypto")
const ProductModel = require('../models/product.model.js');

class ProductDao {
    constructor(filePath) {
        this.filePath = filePath
    }

    // async #readFile() {
    //     try {
    //         const data = await fs.readFile(this.filePath, 'utf8')
    //         return JSON.parse(data)
    //     } catch (error) {
    //         if (error.code === 'ENOENT') {
    //             return []
    //         }
    //         throw new Error('Error al leer el archivo de productos')
    //     }
    // }
    // async #writeFile(data) {
    //     try {
    //         await fs.writeFile(this.filePath, JSON.stringify(data, null, 2))
    //     } catch (error) {
    //         throw new Error('Error al escribir en el archivo de productos')
    //     }
    // }
    #generateId() {
        return crypto.randomUUID
    }
    async getAll(query = {}, options = {}) {
        return await ProductModel.find(query, null, options);
    }
    async getById(id) {
        return await ProductModel.findById(id);
    }
    async create(productData) {
        return await ProductModel.create(productData);
    }
    async update(id, updateData) {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    }
    async delete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
    async paginate(filter, options) {
        return await ProductModel.paginate(filter, options);
    }
}

module.exports = ProductDao