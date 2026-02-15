const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/floraverse';

const plants = [
    {
        name: "Snake Plant (Sansevieria)",
        category: "Indoor Plants",
        description: "One of the toughest indoor plants. It can tolerate low light and irregular watering, making it perfect for beginners.",
        price: 450,
        quantityAvailable: 25,
        imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: false, sunlight: 'Low', maintenance: 'Low', season: 'All' }
    },
    {
        name: "ZZ Plant",
        category: "Indoor Plants",
        description: "Highly dependable indoor plant with waxy green leaves. Thrives on neglect and does well in dark corners.",
        price: 550,
        quantityAvailable: 15,
        imageUrl: "https://images.unsplash.com/photo-1632205301051-24701a5dc4cc?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: false, sunlight: 'Low', maintenance: 'Low', season: 'All' }
    },
    {
        name: "Monstera Deliciosa",
        category: "Indoor Plants",
        description: "The iconic 'Swiss Cheese Plant'. Its stunning split leaves add a tropical feel to any bright room.",
        price: 1200,
        quantityAvailable: 10,
        imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: false, sunlight: 'Medium', maintenance: 'Medium', season: 'All' }
    },
    {
        name: "Fiddle Leaf Fig",
        category: "Indoor Plants",
        description: "A popular statement plant with large, violin-shaped leaves. Requires bright indirect light and consistent care.",
        price: 1800,
        quantityAvailable: 5,
        imageUrl: "https://images.unsplash.com/photo-1597055181300-e3633a907f0a?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: false, sunlight: 'High', maintenance: 'High', season: 'All' }
    },
    {
        name: "Lavender",
        category: "Seeds & Bulbs",
        description: "Fragrant and beautiful, lavender attracts pollinators and thrives in full sun with well-drained soil.",
        price: 150,
        quantityAvailable: 100,
        imageUrl: "https://images.unsplash.com/photo-1591017403986-ed870ec27aa5?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: false, isOutdoor: true, sunlight: 'High', maintenance: 'Medium', season: 'Spring' }
    },
    {
        name: "Marigold Seeds",
        category: "Seeds & Bulbs",
        description: "Bright golden flowers that are easy to grow. Great for pest control in vegetable gardens.",
        price: 80,
        quantityAvailable: 200,
        imageUrl: "https://images.unsplash.com/photo-1599148400620-8e1ff0bf28d8?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: false, isOutdoor: true, sunlight: 'High', maintenance: 'Low', season: 'Summer' }
    },
    {
        name: "Aloe Vera",
        category: "Indoor Plants",
        description: "A succulent known for its medicinal properties. Easy to care for and loves bright light.",
        price: 350,
        quantityAvailable: 40,
        imageUrl: "https://images.unsplash.com/photo-1596547609939-2ce32863777f?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: true, sunlight: 'High', maintenance: 'Low', season: 'All' }
    },
    {
        name: "Spider Plant",
        category: "Indoor Plants",
        description: "Air-purifying plant that produces 'babies'. Very adaptable and survives varied light conditions.",
        price: 300,
        quantityAvailable: 30,
        imageUrl: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: false, sunlight: 'Medium', maintenance: 'Low', season: 'All' }
    },
    {
        name: "Peace Lily",
        category: "Indoor Plants",
        description: "Elegant white blooms that filter indoor air. Tells you when it's thirsty by drooping its leaves.",
        price: 650,
        quantityAvailable: 12,
        imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: false, sunlight: 'Low', maintenance: 'Medium', season: 'All' }
    },
    {
        name: "Boston Fern",
        category: "Indoor Plants",
        description: "Lush, feathery fronds that love humidity. Best for bathrooms or shaded outdoor porches.",
        price: 480,
        quantityAvailable: 10,
        imageUrl: "https://images.unsplash.com/photo-1509121669460-705886d26780?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: true, sunlight: 'Medium', maintenance: 'High', season: 'All' }
    },
    {
        name: "Rubber Plant (Burgundy)",
        category: "Indoor Plants",
        description: "Dramatic dark leaves that grow into a beautiful indoor tree. Requires bright indirect light.",
        price: 950,
        quantityAvailable: 8,
        imageUrl: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: true, isOutdoor: false, sunlight: 'Medium', maintenance: 'Medium', season: 'All' }
    },
    {
        name: "Red Rose Plant",
        category: "Indoor Plants",
        description: "Classic garden favorite. Requires full sun and regular pruning to produce stunning red blooms.",
        price: 400,
        quantityAvailable: 20,
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
        tags: { isIndoor: false, isOutdoor: true, sunlight: 'High', maintenance: 'High', season: 'Spring' }
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Delete existing products (Cleanup demo data)
        await Product.deleteMany({});
        console.log('Cleared existing product catalog.');

        // Insert new curated plants
        const sellerId = "66f1e2a3b4c5d6e7f8a91011"; // Placeholder seller ID
        const plantsWithSeller = plants.map(p => ({ ...p, sellerId }));

        await Product.insertMany(plantsWithSeller);
        console.log(`Successfully seeded ${plants.length} curated plants!`);

        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
