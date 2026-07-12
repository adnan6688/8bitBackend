import { UserRole } from "../../generated/prisma/enums"
import config from "../config"
import { prisma } from "../lib/prisma"
import bcrypt from 'bcrypt'

export const seedAdmin = async () => {

    const adminEmail = config.admin_email || 'admin@gmail.com';
    const adminPhone = config.admin_phone || '01700000000';
    const adminPass = config.admin_pass || 'Admin@123';
    const saltRounds = Number(config.bcrypt_salt_rounds) || 10;


    const ckadmin = await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    });

    if (ckadmin) {
        console.log('ℹ️ Admin account already exists. Skipping seed.');
        return;
    }


    const hashPass = await bcrypt.hash(adminPass, saltRounds);


    await prisma.user.create({
        data: {
            firstName: 'Golam Faruk',
            lastName: 'Adnan',
            password: hashPass,
            role: UserRole.ADMIN,
            email: adminEmail,
            phone: adminPhone,
            isVerified: true
        }
    });

    console.log('✅ Admin account seeded successfully');
};