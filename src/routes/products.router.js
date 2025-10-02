const express = require('express');
const ProductDao = require('../dao/products.dao.js');
const ProductsService = require('../services/products.services.js');
const ProductsControllers = require('../controllers/products.controllers.js');
const uploader = require('../utils/uploaders.js');

const router = express.Router();
const productDao = new ProductDao();
const productsService = new ProductsService(productDao);
const productsController = new ProductsControllers(productsService);

// GET /api/products
router.get('/', productsController.getAllProducts)

// GET /api/products/:pid
router.get('/:pid', productsController.getProductById)

// POST /api/products (con Multer)
router.post(
  '/',
  uploader.array('thumbnails'),
  async (req, res) => {
    try {
      // Procesa las rutas de las imágenes subidas
      const thumbnails = req.files ? req.files.map(file => `/images/${file.filename}`) : [];
      // Envía el body y las rutas al controlador
      await productsController.createProductWithImages(req, res, thumbnails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// PUT /api/products/:pid
router.put('/:pid', productsController.updateProduct)

// DELETE /api/products/:pid
router.delete('/:pid', productsController.deleteProduct)

module.exports = router