class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }

    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart();
            res.status(201).json(newCart);
        } catch {
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    };

    getCartProducts = async (req, res) => {
        const { cid } = req.params;
        try {
            // Usar populate para traer detalles completos del producto
            const cart = await this.cartService.getCartById(cid);
            if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
            res.json(cart.products); // Devuelve los productos con detalles
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    addProductToCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const cart = await this.cartService.addProductToCart(cid, pid);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        } catch {
            res.status(500).json({ error: 'Error al agregar producto al carrito' });
        }
    };

    // 1. Eliminar un producto específico del carrito
    deleteProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const cart = await this.cartService.removeProductFromCart(cid, pid);
            if (!cart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // 2. Reemplazar todos los productos del carrito
    replaceCartProducts = async (req, res) => {
        const { cid } = req.params;
        const { products } = req.body; // Debe ser un array [{product, quantity}]
        try {
            const cart = await this.cartService.replaceCartProducts(cid, products);
            if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // 3. Actualizar SOLO la cantidad de un producto
    updateProductQuantity = async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const cart = await this.cartService.updateProductQuantity(cid, pid, quantity);
            if (!cart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // 4. Vaciar completamente el carrito
    clearCart = async (req, res) => {
        const { cid } = req.params;
        try {
            const cart = await this.cartService.clearCart(cid);
            if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = CartController;