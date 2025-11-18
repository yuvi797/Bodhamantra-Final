import mongoose from 'mongoose';
import Admin from '../models/admin.model.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const testAdmin = async () => {
    try {
        await mongoose.connect('mongodb+srv://raman123:W8D4McPGH4tEiiyl@bodhamantraa.urh4cnm.mongodb.net/test');
        console.log('✅ Connected to MongoDB');

        const admin = await Admin.findOne({ email: 'admin@bodhamantraa.com' });

        if (!admin) {
            console.log('❌ Admin not found!');
        } else {
            console.log('✅ Admin found:', {
                email: admin.email,
                name: admin.name,
                hasPassword: !!admin.password
            });

            // Test password
            const testPass = 'admin123';
            console.log('\nTesting password:', testPass);
            const match = await admin.comparePassword(testPass);
            console.log('Password match:', match);

            // Also test direct bcrypt compare
            const directMatch = await bcrypt.compare(testPass, admin.password);
            console.log('Direct bcrypt match:', directMatch);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testAdmin();
