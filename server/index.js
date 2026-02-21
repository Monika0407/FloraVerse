const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log("Loading config from:", path.join(__dirname, '.env'));
console.log("MONGODB_URI is:", process.env.MONGODB_URI ? "DEFINED" : "UNDEFINED");

const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not defined in .env file.');
    console.log('Please add MONGODB_URI=mongodb://localhost:27017/floraverse to your .env file or provide a remote MongoDB URI.');
    // In a test/dev environment, we might want to continue or exit. 
    // For now, let's just log and try to connect if it's there.
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB Successfully'))
        .catch(err => {
            console.error('Could not connect to MongoDB. Ensure your local MongoDB server is running.');
            console.error('Error details:', err.message);
        });
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User({
            name,
            email,
            password,
            role: role || 'buyer'
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const productData = { ...req.body };

        // If an image was uploaded, store its permanent URL
        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            productData.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        }

        console.log('POST /api/products - Final Data:', productData);
        const product = new Product(productData);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error saving product:', err.message);
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If a new image was uploaded, update the imageUrl
        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            updateData.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Order Routes
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/orders/:sellerId', async (req, res) => {
    try {
        const orders = await Order.find({ sellerId: req.params.sellerId });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
