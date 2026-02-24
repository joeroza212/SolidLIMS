import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/reports/patients
router.get('/patients', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo, genderId, roleId } = req.query;
        const where = { isActive: true };
        if (dateFrom || dateTo) {
            where.dateAdded = {};
            if (dateFrom) where.dateAdded.gte = new Date(dateFrom);
            if (dateTo) where.dateAdded.lte = new Date(dateTo);
        }
        if (genderId) where.genderId = parseInt(genderId);
        if (roleId) where.roleId = parseInt(roleId);

        const data = await prisma.user.findMany({
            where,
            include: { gender: true, role: true, prefix: true },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/doctor-report
router.get('/doctor-report', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo, doctorId } = req.query;
        const where = { isActive: true, referredByDoctorUserId: { not: null } };
        if (dateFrom || dateTo) {
            where.dateAdded = {};
            if (dateFrom) where.dateAdded.gte = new Date(dateFrom);
            if (dateTo) where.dateAdded.lte = new Date(dateTo);
        }
        if (doctorId) where.referredByDoctorUserId = parseInt(doctorId);

        const data = await prisma.user.findMany({
            where,
            include: { gender: true, referredByDoctor: true },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/patient-test
router.get('/patient-test', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo, testCategoryId, patientId } = req.query;
        const where = { isActive: true };
        if (dateFrom || dateTo) {
            where.dateAdded = {};
            if (dateFrom) where.dateAdded.gte = new Date(dateFrom);
            if (dateTo) where.dateAdded.lte = new Date(dateTo);
        }
        if (testCategoryId) where.testCategoryId = parseInt(testCategoryId);
        if (patientId) where.patientUserId = parseInt(patientId);

        const data = await prisma.userTest.findMany({
            where,
            include: { patient: { include: { gender: true, prefix: true } }, testCategory: true },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/widal-report
router.get('/widal-report', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo, patientId } = req.query;
        const where = { isActive: true };
        if (dateFrom || dateTo) {
            where.dateAdded = {};
            if (dateFrom) where.dateAdded.gte = new Date(dateFrom);
            if (dateTo) where.dateAdded.lte = new Date(dateTo);
        }
        if (patientId) where.patientUserId = parseInt(patientId);

        const data = await prisma.widalTest.findMany({
            where,
            include: { patient: { include: { gender: true, prefix: true } } },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/patient-received-amount
router.get('/patient-received-amount', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const where = { isActive: true, paidAmount: { gt: 0 } };
        if (dateFrom || dateTo) {
            where.dateAdded = {};
            if (dateFrom) where.dateAdded.gte = new Date(dateFrom);
            if (dateTo) where.dateAdded.lte = new Date(dateTo);
        }

        const data = await prisma.patientAmount.findMany({
            where,
            include: { user: { include: { gender: true, prefix: true } } },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/patient-outstanding-amount
router.get('/patient-outstanding-amount', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const where = { isActive: true, dueAmount: { gt: 0 } };
        if (dateFrom || dateTo) {
            where.dateAdded = {};
            if (dateFrom) where.dateAdded.gte = new Date(dateFrom);
            if (dateTo) where.dateAdded.lte = new Date(dateTo);
        }

        const data = await prisma.patientAmount.findMany({
            where,
            include: { user: { include: { gender: true, prefix: true } } },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/patient-cash-collection
router.get('/patient-cash-collection', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo } = req.query;
        const where = { isActive: true };
        if (dateFrom || dateTo) {
            where.dateAdded = {};
            if (dateFrom) where.dateAdded.gte = new Date(dateFrom);
            if (dateTo) where.dateAdded.lte = new Date(dateTo);
        }

        const data = await prisma.patientAmount.findMany({
            where,
            include: { user: { include: { gender: true, prefix: true } } },
            orderBy: { dateAdded: 'desc' },
        });

        // Calculate totals
        const totals = data.reduce((acc, item) => ({
            totalAmount: acc.totalAmount + (Number(item.totalAmount) || 0),
            paidAmount: acc.paidAmount + (Number(item.paidAmount) || 0),
            dueAmount: acc.dueAmount + (Number(item.dueAmount) || 0),
            discount: acc.discount + (Number(item.discount) || 0),
        }), { totalAmount: 0, paidAmount: 0, dueAmount: 0, discount: 0 });

        res.json({ success: true, data, totals });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/ledger-accounts
router.get('/ledger-accounts', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo, accountTypeId } = req.query;
        const where = { isActive: true };
        if (accountTypeId) where.accountTypeId = parseInt(accountTypeId);

        const data = await prisma.ledgerAccount.findMany({
            where,
            include: {
                accountType: true,
                transactions: {
                    where: {
                        isActive: true,
                        ...(dateFrom || dateTo ? {
                            transactionDate: {
                                ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
                                ...(dateTo ? { lte: new Date(dateTo) } : {}),
                            },
                        } : {}),
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/accounts-transaction
router.get('/accounts-transaction', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo, ledgerAccountId } = req.query;
        const where = { isActive: true };
        if (ledgerAccountId) where.ledgerAccountId = parseInt(ledgerAccountId);
        if (dateFrom || dateTo) {
            where.transactionDate = {};
            if (dateFrom) where.transactionDate.gte = new Date(dateFrom);
            if (dateTo) where.transactionDate.lte = new Date(dateTo);
        }

        const data = await prisma.transaction.findMany({
            where,
            include: { ledgerAccount: { include: { accountType: true } } },
            orderBy: { transactionDate: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/products
router.get('/products', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.product.findMany({
            where: { isActive: true },
            include: { stocks: { where: { isActive: true } } },
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/vendors
router.get('/vendors', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.vendor.findMany({
            where: { isActive: true },
            include: { stocks: { where: { isActive: true }, include: { product: true } } },
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/stock-in
router.get('/stock-in', authenticate, async (req, res, next) => {
    try {
        const { dateFrom, dateTo, productId } = req.query;
        const where = { isActive: true };
        if (productId) where.productId = parseInt(productId);
        if (dateFrom || dateTo) {
            where.dateAdded = {};
            if (dateFrom) where.dateAdded.gte = new Date(dateFrom);
            if (dateTo) where.dateAdded.lte = new Date(dateTo);
        }

        const data = await prisma.stock.findMany({
            where,
            include: { product: true, vendor: true },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/stock-finished
router.get('/stock-finished', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.stock.findMany({
            where: { isActive: true, quantity: { lte: 0 } },
            include: { product: true, vendor: true },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/permanent-patients
router.get('/permanent-patients', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.permanentPatient.findMany({
            where: { isActive: true },
            include: { patient: { include: { gender: true, prefix: true } } },
            orderBy: { dateAdded: 'desc' },
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/reports/test-price-list
router.get('/test-price-list', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.testCategory.findMany({
            where: { isActive: true },
            orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }],
        });
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

export default router;
