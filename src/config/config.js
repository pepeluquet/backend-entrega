const path = require('path');
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8080,
    PERSISTENCE: process.env.PERSISTENCE || 'file',
    PRODUCTS_FILE: path.join(__dirname, '..', 'data', 'products.json'),
    CARTS_FILE: path.join(__dirname, '..', 'data', 'carts.json')
};
