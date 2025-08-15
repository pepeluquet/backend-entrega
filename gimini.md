Para implementar tu servidor con Node.js y Express, siguiendo la estructura de archivos que proporcionaste, necesitas configurar `app.js` (o `index.js`), las rutas en las carpetas `routes` y los gestores de datos en la carpeta `managers`.

### 1\. Configuración Principal del Servidor (`app.js`)

Tu archivo `app.js` (o `index.js`) será el punto de entrada de la aplicación. Aquí es donde se crea la instancia de Express, se definen el puerto y se conectan los `routers`.

```javascript
const express = require('express');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');

const app = express();
const PORT = 8080; // O 3000, según tu preferencia

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
```

En este archivo, importas los routers, configuras los middlewares para que Express pueda manejar JSON y datos de formularios, y conectas cada router a su respectiva ruta base (`/api/products` y `/api/carts`). Finalmente, el servidor se inicia en el puerto especificado.

-----

### 2\. Implementación de los Routers

Cada archivo de ruta (`products.router.js` y `carts.router.js`) manejará los `endpoints` específicos de su dominio. Utilizarás **`Express.Router()`** para modularizar las rutas.

#### `routes/products.router.js`

Este archivo manejará las peticiones para la ruta `/api/products`. Importarás el `ProductManager` y usarás sus métodos para interactuar con el archivo `products.json`.

```javascript
const express = require('express');
const ProductManager = require('../managers/ProductManager.js');

const router = express.Router();
const productManager = new ProductManager('./data/products.json');

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productManager.getProductById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        const updatedProduct = await productManager.updateProduct(pid, req.body);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        await productManager.deleteProduct(pid);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

module.exports = router;
```

#### `routes/carts.router.js`

De manera similar, este archivo se encargará de las rutas para `/api/carts`.

```javascript
const express = require('express');
const CartManager = require('../managers/CartManager.js');

const router = express.Router();
const cartManager = new CartManager('./data/carts.json');

// POST /api/carts
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const productsInCart = await cartManager.getProductsInCart(cid);
        if (productsInCart) {
            res.json(productsInCart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        if (updatedCart) {
            res.json(updatedCart);
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

module.exports = router;
```

-----

### 3\. Implementación de los Managers

Los **`managers`** son los responsables de la lógica de negocio y la persistencia de datos. Utilizarán el módulo `fs` para leer y escribir en los archivos `.json`.

#### `managers/ProductManager.js`

Este gestor se encargará de todas las operaciones sobre el archivo `products.json`.

```javascript
const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw new Error('Error al leer el archivo de productos');
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = { ...product, id: this.generateUniqueId(products) };
        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates, id: id };
            await this.saveProducts(products);
            return products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== id);
        if (products.length === initialLength) {
            throw new Error('Producto no encontrado para eliminar');
        }
        await this.saveProducts(products);
    }

    async saveProducts(products) {
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf8');
    }

    generateUniqueId(products) {
        return products.length > 0 ? (Math.max(...products.map(p => p.id)) + 1) : 1;
    }
}

module.exports = ProductManager;
```

#### `managers/CartManager.js`

Este gestor se encargará de las operaciones sobre el archivo `carts.json`.

```javascript
const fs = require('fs').promises;
const ProductManager = require('./ProductManager.js');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.productManager = new ProductManager('./data/products.json');
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw new Error('Error al leer el archivo de carritos');
        }
    }

    async saveCarts(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf8');
    }

    generateUniqueId(carts) {
        return carts.length > 0 ? (Math.max(...carts.map(c => c.id)) + 1) : 1;
    }

    async addCart() {
        const carts = await this.getCarts();
        const newCart = { id: this.generateUniqueId(carts), products: [] };
        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async getProductsInCart(cartId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === parseInt(cartId));
        return cart ? cart.products : null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === parseInt(cartId));

        if (cartIndex === -1) {
            return null;
        }

        const productToAdd = await this.productManager.getProductById(parseInt(productId));
        if (!productToAdd) {
            return null;
        }

        const productInCartIndex = carts[cartIndex].products.findIndex(p => p.id === parseInt(productId));

        if (productInCartIndex !== -1) {
            carts[cartIndex].products[productInCartIndex].quantity++;
        } else {
            carts[cartIndex].products.push({ id: parseInt(productId), quantity: 1 });
        }

        await this.saveCarts(carts);
        return carts[cartIndex];
    }
}

module.exports = CartManager;
```

Con estos archivos y la lógica implementada, tu proyecto de backend estará listo para manejar las peticiones de productos y carritos, utilizando la persistencia de datos con **`FileSystem`** en archivos `.json`. Solo necesitas instalar las dependencias con `npm install express`.