class ProductServices {
    constructor(productsDao) {
        this.productsDao = productsDao;
    }

    async getAllProducts({ limit = 10, page = 1, sort, query }) {
        const filter = {};
        if (query) {
            // Permite filtrar por category o status
            if (query.category) filter.category = query.category;
            if (query.status !== undefined) filter.status = query.status === 'true';
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true
        };

        return await this.productsDao.getAll(filter, options);
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

module.exports = ProductServices;