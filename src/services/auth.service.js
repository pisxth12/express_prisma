import { UserRepository } from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import prisma from "../config/database.js";
import jwt from "jsonwebtoken";
export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async login(credentials) {
    const { email, password } = credentials;

    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const token = this.generateToken(user.id);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    };
  }

  async currentUser(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    const { password, createdAt, updatedAt, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }


  async logout(token) {
    if(!token)  return null;

    const decoded = jwt.decode(token);
    if(decoded && decoded.exp) {
        await prisma.BlacklistToken.create({
            data: {
                token,
                expiresAt: new Date(decoded.exp * 1000)
            }
        });
    }
        return { message: 'Logged out successfully' };
  }


    async changePassword(userId, currentPassword, newPassword){
        if(!currentPassword || !newPassword) {
            throw new Error('Current password and new password are required');
        }

        
        if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters');
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if(!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) {
            throw new Error('Current password is incorrect');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        return { message: 'Password changed successfully' };
    }
}


