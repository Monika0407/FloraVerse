const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const deleteUser = async () => {
    const userId = process.argv[2];

    if (!userId) {
        console.error('Please provide a User ID. Usage: node delete_user.js <UserID>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Connected to Database ---\n');

        const result = await User.findByIdAndDelete(userId);

        if (result) {
            console.log(`Successfully deleted user: ${result.name} (${result.email})`);
        } else {
            console.error(`User with ID ${userId} not found.`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error deleting user:', err.message);
        process.exit(1);
    }
};

deleteUser();
