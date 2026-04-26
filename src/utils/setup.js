import { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import prisma from "../config/database.js";



const userRepository = new UserRepository();

export const initializeAdmin = async () => {
    try{
        const adminExists = await userRepository.findByEmail(process.env.ADMIN_EMAIL);
        if(!adminExists){
              const hashedPassword = await  bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
              await prisma.user.upsert({
                where: { email: process.env.ADMIN_EMAIL },
                update: {},
                create: {
                    username: process.env.ADMIN_USERNAME,
                    email: process.env.ADMIN_EMAIL,
                    password: hashedPassword,
                }
              });
              console.log('✅ Default admin user created');
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
    }
}