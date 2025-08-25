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
        return products.find(p => String(p.id) === String(id))
    }

    async addProduct(product) {
        const products = await this.getProducts();

        // Validar código único
        if (products.some(p => p.code === product.code)) {
            throw new Error('El código del producto ya existe.');
        }

        // Generar ID único y numérico
        const newId = this.generateUniqueId(products);
        const newProduct = { ...product, id: newId };

        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts()
        const index = products.findIndex(p => String(p.id) === String(id))
        if (index !== -1) {
            products[index] = { ...products[index], ...updates, id: products[index].id }
            await this.saveProducts(products)
            return products[index]
        }
        return null
    }

    async deleteProduct(id) {
        let products = await this.getProducts()
        const initialLength = products.length
        products = products.filter(p => String(p.id) !== String(id))
        if (products.length === initialLength) {
            throw new Error('Producto no encontrado para eliminar')
        }
        await this.saveProducts(products)
    }

    async saveProducts(products) {
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf8')
    }

    generateUniqueId(products) {
        // Asegura que todos los IDs sean numéricos y únicos
        const ids = products.map(p => Number(p.id)).filter(id => !isNaN(id));
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }
}

// const productManager = new ProductManager('./data/products.json')

module.exports = ProductManager