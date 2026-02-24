import { Router } from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/dashboard — Main dashboard stats
router.get('/', authenticate, async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalPatients,
            todayPatients,
            totalTests,
            todayTests,
            totalProducts,
            lowStockProducts,
        ] = await Promise.all([
            prisma.user.count({ where: { canLogin: false, isActive: true } }),
            prisma.user.count({ where: { canLogin: false, isActive: true, dateAdded: { gte: today } } }),
            prisma.userTest.count({ where: { isActive: true } }),
            prisma.userTest.count({ where: { isActive: true, dateAdded: { gte: today } } }),
            prisma.product.count({ where: { isActive: true } }),
            prisma.stock.count({ where: { isActive: true, quantity: { lte: 5 } } }),
        ]);

        res.json({
            success: true,
            data: { totalPatients, todayPatients, totalTests, todayTests, totalProducts, lowStockProducts },
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/dashboard/patient-chart — Patient registration by month
router.get('/patient-chart', authenticate, async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const data = await prisma.$queryRaw`
      SELECT
        EXTRACT(MONTH FROM "dateAdded") as month,
        COUNT(*)::int as count
      FROM users
      WHERE "canLogin" = false
        AND EXTRACT(YEAR FROM "dateAdded") = ${year}
      GROUP BY EXTRACT(MONTH FROM "dateAdded")
      ORDER BY month
    `;
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/dashboard/test-count — Tests per category
router.get('/test-count', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.$queryRaw`
      SELECT tc.name, COUNT(ut.id)::int as count
      FROM user_tests ut
      JOIN test_categories tc ON ut."testCategoryId" = tc.id
      WHERE ut."isActive" = true
      GROUP BY tc.name
      ORDER BY count DESC
      LIMIT 10
    `;
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/dashboard/patient-amounts — Payment overview
router.get('/patient-amounts', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.$queryRaw`
      SELECT
        COALESCE(SUM("totalAmount"), 0)::float as "totalAmount",
        COALESCE(SUM("paidAmount"), 0)::float as "paidAmount",
        COALESCE(SUM("dueAmount"), 0)::float as "dueAmount",
        COALESCE(SUM("discount"), 0)::float as "totalDiscount"
      FROM patient_amounts
      WHERE "isActive" = true
    `;
        res.json({ success: true, data: data[0] || {} });
    } catch (error) {
        next(error);
    }
});

// GET /api/dashboard/ledger-transactions — Ledger summary
router.get('/ledger-transactions', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.$queryRaw`
      SELECT
        la.name as "accountName",
        COALESCE(SUM(t.debit), 0)::float as "totalDebit",
        COALESCE(SUM(t.credit), 0)::float as "totalCredit"
      FROM transactions t
      JOIN ledger_accounts la ON t."ledgerAccountId" = la.id
      WHERE t."isActive" = true
      GROUP BY la.name
      ORDER BY la.name
    `;
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

// GET /api/dashboard/stock-summary — Stock in/out summary
router.get('/stock-summary', authenticate, async (req, res, next) => {
    try {
        const data = await prisma.$queryRaw`
      SELECT
        p.name as "productName",
        COALESCE(SUM(s.quantity), 0)::int as "totalQuantity",
        COALESCE(SUM(s."totalPrice"), 0)::float as "totalValue"
      FROM stocks s
      JOIN products p ON s."productId" = p.id
      WHERE s."isActive" = true
      GROUP BY p.name
      ORDER BY "totalQuantity" DESC
      LIMIT 10
    `;
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
});

export default router;
