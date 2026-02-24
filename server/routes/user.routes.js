import { createCrudRouter } from './_factory.js';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { hashPassword } from '../utils/password.js';

const router = createCrudRouter('user', {
    include: {
        role: true,
        gender: true,
        prefix: true,
        givenMethod: true,
    },
    searchField: 'userName',
    beforeCreate: async (data) => {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        data.dateAdded = new Date();
        return data;
    },
    beforeUpdate: async (data) => {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        data.dateModified = new Date();
        return data;
    },
    customRoutes: (r) => {
        // GET patients only (role-based)
        r.get('/patients/list', authenticate, async (req, res, next) => {
            try {
                const { search, page = 1, limit = 50 } = req.query;
                const where = { canLogin: false, isActive: true };
                if (search) {
                    where.userName = { contains: search, mode: 'insensitive' };
                }

                const [data, total] = await Promise.all([
                    prisma.user.findMany({
                        where,
                        include: { gender: true, prefix: true },
                        skip: (parseInt(page) - 1) * parseInt(limit),
                        take: parseInt(limit),
                        orderBy: { id: 'desc' },
                    }),
                    prisma.user.count({ where }),
                ]);

                res.json({ success: true, data, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
            } catch (error) {
                next(error);
            }
        });

        // GET doctors only
        r.get('/doctors/list', authenticate, async (req, res, next) => {
            try {
                const data = await prisma.user.findMany({
                    where: { role: { name: { contains: 'doctor', mode: 'insensitive' } }, isActive: true },
                    include: { role: true },
                    orderBy: { userName: 'asc' },
                });
                res.json({ success: true, data });
            } catch (error) {
                next(error);
            }
        });
    },
});

export default router;
