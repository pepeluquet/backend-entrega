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
            const products = await this.cartService.getCartProducts(cid);
            if (products) {
                res.json(products);
            } else {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        } catch {
            res.status(500).json({ error: 'Error al obtener productos del carrito' });
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
}

module.exports = CartController;