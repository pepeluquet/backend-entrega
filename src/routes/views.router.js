const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const productsPath = path.join(__dirname, '..', 'data', 'products.json');

// Home: muestra productos
router.get('/', (req, res) => {
    let products = [];
    try {
        const data = fs.readFileSync(productsPath, 'utf-8');
        products = JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo products.json:', error);
    }
    res.render('home', {
        title: 'Inicio',
        products
    });
});

// Formulario para agregar producto (solo ejemplo, no persistente)
router.post('/add-product', (req, res) => {
    // Aquí deberías agregar lógica para guardar el producto en products.json
    res.redirect('/');
});

module.exports = router;