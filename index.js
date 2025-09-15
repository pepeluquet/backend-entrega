const app = require('./src/app.js');
const config = require('./src/config/config.js');

const PORT = config.PORT || 8080;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
