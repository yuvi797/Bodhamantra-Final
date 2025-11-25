import mongoose from 'mongoose';
import Admin from '../models/admin.model.js';
import dotenv from 'dotenv';
import readline from 'readline';
// import DB_NAME from '../constants.js';

// Load environment variables
dotenv.config({ path: './.env' });

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        const DB_NAME = "Bodhamantraa";
        await mongoose.connect(`mongodb+srv://raman123:W8D4McPGH4tEiiyl@bodhamantraa.urh4cnm.mongodb.net/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@bodhamantraa.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👤 Name:', existingAdmin.name);

            // Ask if they want to update password
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Do you want to reset the password? (yes/no): ', async (answer) => {
                if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                    existingAdmin.password = 'admin123'; // Will be hashed by pre-save hook
                    await existingAdmin.save();
                    console.log('✅ Admin password reset successfully!');
                    console.log('📧 Email: admins432@gmail.com');
                    console.log('🔑 Password: admin123');
                }
                rl.close();
                await mongoose.connection.close();
                process.exit(0);
            });
        } else {
            // Create new admin user
            const admin = new Admin({
                name: 'Admin',
                email: 'admin@bodhamantraa.com',
                password: 'admin123', // Will be hashed by pre-save hook
                role: 'admin'
            });

            await admin.save();

            console.log('✅ Admin user created successfully!');
            console.log('\n📋 Admin Credentials:');
            console.log('────────────────────────────');
            console.log('📧 Email: admin@bodhamantraa.com');
            console.log('🔑 Password: admin123');
            console.log('👤 Name: Admin');
            console.log('🎭 Role: admin');
            console.log('────────────────────────────');
            console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
            console.log('\n🌐 Login at: http://localhost:5174/login');

            await mongoose.connection.close();
            console.log('\n✅ Database connection closed');
            process.exit(0);
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run the seed function
seedAdmin();
