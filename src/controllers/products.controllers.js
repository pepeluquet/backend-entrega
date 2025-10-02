class ProductsControllers {
    constructor(productsService) {
        this.productsService = productsService;
    }

    getAllProducts = async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            const filter = {};

            // Filtro por categoría o status
            if (query) {
                if (query === 'true' || query === 'false') {
                    filter.status = query === 'true';
                } else {
                    filter.category = query;
                }
            }

            // Opciones de paginación y ordenamiento
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                lean: true
            };
            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            const result = await this.productsService.getAllProducts(filter, options);

            // Construcción de links
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
            const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}` : null;
            const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}` : null;

            res.json({
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink,
                nextLink
            });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    };

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

module.exports = ProductsControllers;

