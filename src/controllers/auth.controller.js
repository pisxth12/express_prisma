import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export const login = async (req, res, next) => {
    try {
        const { email, password} = req.body;
        const result = await authService.login({ email, password });
         if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        if(!req.user){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(req.user);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const result = await authService.logout(token);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    try{
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        const result = await authService.changePassword(userId, currentPassword, newPassword);
        res.json(result);
    } catch (error) {
          if (error.message.includes('required') || error.message.includes('at least')) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message.includes('incorrect')) {
            return res.status(401).json({ error: error.message });
        }
        next(error);
    }
    }

  

