const app = require('./src/app.js');
const config = require('./src/config/config.js');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const productsPath = './src/data/products.json';


const server = http.createServer(app);
const io = socketio(server);

app.set('io', io);

const PORT = config.PORT || 8080;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

io.on('connection', socket => {
    socket.on('newProduct', data => {
        let products = [];
        try {
            products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        } catch {}
        const newProduct = { ...data, id: Date.now() };
        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        io.emit('productsUpdated', products);
    });

    socket.on('deleteProduct', id => {
        let products = [];
        try {
            products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        } catch {}
        products = products.filter(p => String(p.id) !== String(id));
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
        io.emit('productsUpdated', products);
    });
});
