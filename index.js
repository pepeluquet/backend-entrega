const app = require('./src/app');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const path = require('path');

const server = http.createServer(app);
const io = socketio(server);

const productsPath = path.join(__dirname, 'src', 'data', 'products.json');

// io.on('connection', socket => {
//     // Enviar productos al conectar
//     socket.emit('productsUpdated', getProducts());

//     // Crear producto
//     socket.on('newProduct', data => {
//         const products = getProducts();
//         const newProduct = { ...data, id: Date.now() };
//         products.push(newProduct);
//         fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
//         io.emit('productsUpdated', products);
//     });

//     // Eliminar producto
//     socket.on('deleteProduct', id => {
//         let products = getProducts();
//         products = products.filter(p => String(p.id) !== String(id));
//         fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
//         io.emit('productsUpdated', products);
//     });
// });

// function getProducts() {
//     try {
//         const data = fs.readFileSync(productsPath, 'utf-8');
//         return JSON.parse(data);
//     } catch {
//         return [];
//     }
// }

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
});
