const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Handlebars setup
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const productsPath = path.join(__dirname, 'data', 'products.json');

// Ruta para renderizar index.handlebars
app.get('/', (req, res) => {
    let products = [];
    try {
        const data = fs.readFileSync(productsPath, 'utf-8');
        products = JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo products.json:', error);
    }
    res.render('index', {
        title: 'Inicio',
        mensaje: 'Bienvenido a la tienda!',
        products
    });
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;