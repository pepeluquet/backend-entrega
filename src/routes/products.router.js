const express = require('express')
const router = express.Router()
const config = require('../config/config.js');
const ProductsDao = require(`../dao/products.dao.js`)
const ProductsServices = require('../services/products.services.js')
const ProductsControllers = require('../controllers/products.controllers.js')
const uploader = require('../utils/uploaders.js')

const productsDao = new ProductsDao()
const productsServices = new ProductsServices(productsDao)
const productsControllers = new ProductsControllers(productsServices)


// GET /api/products
router.get('/', productsControllers.getAllProducts)

// GET /api/products/:pid
router.get('/:pid', productsControllers.getProductById)

// POST /api/products (con Multer)
router.post(
  '/',
  uploader.array('thumbnails'),
  async (req, res) => {
    try {
      // Procesa las rutas de las imágenes subidas
      const thumbnails = req.files ? req.files.map(file => `/images/${file.filename}`) : [];
      // Envía el body y las rutas al controlador
      await productsControllers.createProductWithImages(req, res, thumbnails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// PUT /api/products/:pid
router.put('/:pid', productsControllers.updateProduct)

// DELETE /api/products/:pid
router.delete('/:pid', productsControllers.deleteProduct)

module.exports = router