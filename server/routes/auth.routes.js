import { Router } from 'express';
import * as authService from '../services/auth.service.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        const result = await authService.login(userName, password);

        // Set HTTP-only cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
    try {
        const { default: prisma } = await import('../config/database.js');
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { role: true, prefix: true, gender: true },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { password, changePasswordCode, ...safeUser } = user;

        // Get app settings
        const appSetting = await prisma.appSetting.findFirst({ where: { isActive: true } });

        res.json({ success: true, data: { user: safeUser, appSetting } });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const result = await authService.changePassword(req.user.id, oldPassword, newPassword);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

export default router;
