const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const deleteMultipleUsers = async () => {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Usage:');
        console.error('  Delete specific IDs: node delete_multiple_users.js ID1 ID2 ID3');
        console.error('  Delete by role:      node delete_multiple_users.js --role buyer');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Connected to Database ---\n');

        let result;
        if (args[0] === '--role') {
            const role = args[1];
            if (!role || !['buyer', 'seller'].includes(role)) {
                console.error('Please specify a valid role: buyer or seller');
                await mongoose.connection.close();
                process.exit(1);
            }
            const count = await User.countDocuments({ role });
            if (count === 0) {
                console.log(`No users found with role: ${role}`);
            } else {
                result = await User.deleteMany({ role });
                console.log(`Successfully deleted ${result.deletedCount} users with role: ${role}`);
            }
        } else {
            // Delete by a list of IDs
            result = await User.deleteMany({ _id: { $in: args } });
            console.log(`Successfully deleted ${result.deletedCount} users from the list provided.`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error deleting users:', err.message);
        process.exit(1);
    }
};

deleteMultipleUsers();
