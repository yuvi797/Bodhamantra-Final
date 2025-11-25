import mongoose from 'mongoose';
import Admin from '../models/admin.model.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config({ path: './.env' });

const seedAdmin = async () => {
    try {
        const DB_NAME = "Bodhamantraa";

        await mongoose.connect(`mongodb+srv://raman123:W8D4McPGH4tEiiyl@bodhamantraa.urh4cnm.mongodb.net/${DB_NAME}`);

        console.log('✅ Connected to MongoDB');

        const ADMIN_EMAIL = "admin@bodhamantraa.com";

        // Check if exists
        const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('⚠️ Admin already exists:', existingAdmin.email);

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Reset password? (yes/no): ', async (ans) => {
                if (ans.toLowerCase() === "yes" || ans.toLowerCase() === "y") {
                    existingAdmin.password = "admin123";
                    await existingAdmin.save();

                    console.log('✅ Password reset successfully');
                    console.log('📧 Email:', ADMIN_EMAIL);
                    console.log('🔑 Password: admin123');
                }

                rl.close();
                mongoose.connection.close();
                process.exit(0);
            });

            return;
        }

        // Create NEW admin
        const admin = new Admin({
            name: "Admin",
            email: ADMIN_EMAIL,
            password: "admin123",
            role: "admin"
        });

        await admin.save();

        console.log('✅ New Admin Created');
        console.log("📧 Email:", ADMIN_EMAIL);
        console.log("🔑 Password: admin123");
        console.log("🌐 Login at: http://localhost:5174/login");

        mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedAdmin();
