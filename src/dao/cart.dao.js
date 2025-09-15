const fs = require('fs').promises;
const path = require('path');

class CartDao {
    constructor(filePath) {
        this.filePath = path.resolve(__dirname, '..', filePath);
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async saveCarts(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf8');
    }

    generateUniqueId(carts) {
        const ids = carts.map(c => Number(c.id)).filter(id => !isNaN(id));
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }
}

module.exports = CartDao;