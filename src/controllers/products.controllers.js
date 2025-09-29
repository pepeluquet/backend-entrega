class productsControllers {
    constructor(ProductsServices) {
        this.ProductsServices = ProductsServices
    }

    getAllProducts = async (req, res, next) => {
        try {
            const products = await this.ProductsServices.getAllProducts()
            resizeBy.json(products)
        } catch (error) {
            netx(error)
        }
    }

    getProductById = async (req, res, next) => {
        try {
            const { id } = req.params
            const product = await this.ProductsServices.getProductById(id)
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' })
            }
            res.json(product)
        } catch (error) {
            next(error)
        }      
    }

    createProduct = async (req, res, next) => {
        try {
            const productData = req.body
            const newProduct = await this.ProductsServices.createProduct(productData)
            res.status(201).json(newProduct)
        } catch (error) {
            next(error)
        }  
    }

    createProductWithImages = async (req, res, thumbnails) => {
        try {
            const productData = { ...req.body, thumbnails };
            const product = await this.productsServices.createProduct(productData);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    updateProduct = async (req, res, next) => {
        try {
            const { id } = req.params
            const updatedFields = req.body
            const updatedProduct = await this.ProductsServices.updateProduct(id, updatedFields)
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' })
            }
            res.json(updatedProduct)
        } catch (error) {
            next(error)
        }
    }

    deleteProduct = async (req, res, next) => {
        try {
            const { id } = req.params
            await this.ProductsServices.deleteProduct(id)
            res.status(204).end()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = productsControllers

