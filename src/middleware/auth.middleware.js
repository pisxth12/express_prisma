import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import prisma from '../config/database.js';

const userRepository = new UserRepository();

 
export const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const blacklistToken = await prisma.BlacklistToken.findUnique({
        where: { token }
    });

    if (blacklistToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userRepository.findById(decoded.id);
        if(!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

}


