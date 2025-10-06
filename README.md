# InaYoga Trail Running - API de E-commerce

¡Bienvenido/a a InaYoga Trail Running!  
Esta es la API que impulsa nuestra tienda online de ropa y accesorios deportivos para amantes del trail running.

---

## ¿Qué es esto?

Este proyecto es el corazón digital de una tienda de ropa deportiva especializada en trail running. Aquí podrás encontrar, filtrar y explorar productos como camisetas técnicas, chaquetas, mochilas, accesorios y mucho más. Además, permite a los usuarios crear su propio carrito de compras y agregar productos fácilmente.

---

## ¿Qué puedes hacer con esta API?

- **Ver productos:** Explora nuestro catálogo de productos deportivos.
- **Filtrar y buscar:** Encuentra productos por categoría, disponibilidad y ordena por precio.
- **Paginación:** Navega cómodamente por páginas de productos.
- **Carrito de compras:** Crea tu carrito y agrega productos para preparar tu compra.
- **Visualización amigable:** La tienda cuenta con una interfaz clara y fácil de usar.

---

## ¿Cómo funciona la tienda?

1. **Explora los productos:**  
   Desde la página principal puedes ver todos los productos disponibles, filtrarlos por categoría (como "Accesorios" o "Camisetas"), por disponibilidad, y ordenar por precio.

2. **Agrega productos al carrito:**  
   Cada producto tiene un botón para agregarlo a tu carrito personal. El carrito se crea automáticamente la primera vez que lo necesitas.

3. **Revisa tu carrito:**  
   Puedes ver en cualquier momento los productos que has agregado y prepararte para finalizar tu compra.

4. **Navega fácilmente:**  
   Usa los botones de "Siguiente" y "Anterior" para moverte entre páginas de productos.

---

## Tecnologías utilizadas

- **Node.js y Express:** Para el servidor y la API.
- **MongoDB:** Para almacenar los productos y carritos de manera segura y eficiente.
- **Handlebars:** Para mostrar la tienda de forma visual y agradable.
- **HTML, CSS y JavaScript:** Para la experiencia de usuario en la web.

---

## ¿Quién puede usarlo?

Este proyecto está pensado para quienes buscan una experiencia sencilla y directa al comprar ropa y accesorios para trail running.  
No necesitas conocimientos técnicos para navegar y comprar.

---

## Instrucciones para desarrolladores

### Requisitos

- Node.js (v18 o superior recomendado)
- MongoDB Atlas o una instancia local de MongoDB

### Instalación

1. **Clona este repositorio:**
    ```bash
    git clone https://github.com/tuusuario/inayoga-trailrunner.git
    cd inayoga-trailrunner
    ```

2. **Instala las dependencias:**
    ```bash
    npm install
    ```

3. **Crea un archivo `.env` en la raíz del proyecto con tu cadena de conexión de MongoDB:**
    ```
    MONGO_URL=mongodb+srv://<usuario>:<password>@cluster001.mongodb.net/
    ```

4. **Inicia el servidor:**
    ```bash
    npm start
    ```
    El servidor estará disponible en [http://localhost:8080](http://localhost:8080)

---

### Endpoints principales

- `GET /`  
  Vista principal con productos, filtros y paginación.

- `GET /api/products`  
  Devuelve productos en formato JSON. Soporta filtros por query params:  
  - `limit` (número de productos por página, default 10)
  - `page` (número de página, default 1)
  - `query` (categoría o disponibilidad)
  - `sort` (`asc` o `desc` por precio)

- `POST /api/carts`  
  Crea un nuevo carrito.

- `POST /api/carts/:cid/product/:pid`  
  Agrega un producto al carrito.

- `GET /carts/:cid`  
  Vista del carrito con los productos agregados.

---

### Helpers de Handlebars

El proyecto utiliza el helper `eq` para comparar valores en los filtros de la vista.  
Está registrado en la configuración de Handlebars en `app.js`:

```js
const hbs = exphbs.create({
    helpers: {
        eq: (a, b) => a == b
    }
});
```

¡Gracias por visitar InaYoga Trail Running! 