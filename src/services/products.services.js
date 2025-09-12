class ProductServices {
    constructor(productDao) {
        this.productDao = productDao
    }

    async getAllProducts() {
        return await this.productDao.getAll()
    }



    async getProductById(id) {
        if (!id) {
            throw new Error('ID del producto es requerido')
        }   
        return await this.productDao.getProductById(id)
    }

    async createProduct(productData) {
        // Validación de campos obligatorios
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails = [],
            status = true
        } = productData
        if (
            !title ||
            !description ||
            !code ||
            typeof price !== 'number' ||
            typeof stock !== 'number' ||
            !category
        ) {
            throw new Error('Faltan campos obligatorios o tipos incorrectos.')
        }
        if (!Array.isArray(thumbnails)) {
            throw new Error('Thumbnails debe ser un array de strings.')
        }
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status
        }
        return await this.productDao.create(newProduct)
    }

    async updateProduct(id, updatedFields) {
        if (!id) {
            throw new Error('ID del producto es requerido para actualizar')
        }
        const existingProduct = await this.productDao.getById(id)
        if (!existingProduct) {
            throw new Error('Producto no encontrado')
        }
        return await this.productDao.updateProduct(id, updatedFields)
    }

    async deleteProduct(id) {
        if (!id) {
            throw new Error('ID del producto es requerido para eliminar')
        }
        const existingProduct = await this.productDao.getById(id)
        if (!existingProduct) {
            throw new Error('Producto no encontrado')
        }
        return await this.productDao.deleteProduct(id)
    }
}