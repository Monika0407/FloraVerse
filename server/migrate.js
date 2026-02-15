const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/floraverse';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find();
        console.log(`Found ${products.length} products to migrate`);

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.tags = {
                isIndoor: i % 2 === 0,
                isOutdoor: i % 2 !== 0,
                sunlight: i % 3 === 0 ? 'High' : (i % 3 === 1 ? 'Medium' : 'Low'),
                maintenance: i % 2 === 0 ? 'Low' : 'Medium',
                season: 'All'
            };
            await product.save();
        }

        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
