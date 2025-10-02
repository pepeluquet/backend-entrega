const crypto = require("crypto")
const ProductModel = require('../models/product.model.js');

class ProductDao {

    #generateId() {
        return crypto.randomUUID
    }
    async getAll(query = {}, options = {}) {
        return await ProductModel.paginate(query, options);
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