const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const viewUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Connected to Database ---\n');

        const users = await User.find().sort({ role: 1 });

        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.log(`Total Users: ${users.length}\n`);
            console.table(users.map(user => ({
                ID: user._id.toString().slice(-6),
                FullID: user._id.toString(),
                Name: user.name,
                Email: user.email,
                Role: user.role
            })));
            console.log('\nTo delete a user, use: node delete_user.js <FullID>');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        process.exit(1);
    }
};

viewUsers();
