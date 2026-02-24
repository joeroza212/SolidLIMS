import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up from server/)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import roleRoutes from './routes/role.routes.js';
import genderRoutes from './routes/gender.routes.js';
import genderPrefixRoutes from './routes/genderPrefix.routes.js';
import menuRoutes from './routes/menu.routes.js';
import menuPermissionRoutes from './routes/menuPermission.routes.js';
import testCategoryRoutes from './routes/testCategory.routes.js';
import userTestRoutes from './routes/userTest.routes.js';
import widalTestRoutes from './routes/widalTest.routes.js';
import patientAmountRoutes from './routes/patientAmount.routes.js';
import permanentPatientRoutes from './routes/permanentPatient.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import reportRoutes from './routes/report.routes.js';
import appSettingRoutes from './routes/appSetting.routes.js';
import generalSettingRoutes from './routes/generalSetting.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import reportFormatRoutes from './routes/reportFormat.routes.js';
import accountTypeRoutes from './routes/accountType.routes.js';
import ledgerAccountRoutes from './routes/ledgerAccount.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import paymentMethodRoutes from './routes/paymentMethod.routes.js';
import statusRoutes from './routes/status.routes.js';
import givenMethodRoutes from './routes/givenMethod.routes.js';
import productRoutes from './routes/product.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import stockRoutes from './routes/stock.routes.js';
import stockInOutRoutes from './routes/stockInOut.routes.js';
import roleUserRoutes from './routes/roleUser.routes.js';
import patientHistoryRoutes from './routes/patientHistory.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();

// ─── Middleware ─────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/genders', genderRoutes);
app.use('/api/gender-prefixes', genderPrefixRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/menu-permissions', menuPermissionRoutes);
app.use('/api/test-categories', testCategoryRoutes);
app.use('/api/user-tests', userTestRoutes);
app.use('/api/widal-tests', widalTestRoutes);
app.use('/api/patient-amounts', patientAmountRoutes);
app.use('/api/permanent-patients', permanentPatientRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/app-settings', appSettingRoutes);
app.use('/api/general-settings', generalSettingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/report-formats', reportFormatRoutes);
app.use('/api/account-types', accountTypeRoutes);
app.use('/api/ledger-accounts', ledgerAccountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/given-methods', givenMethodRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/stock-in-outs', stockInOutRoutes);
app.use('/api/role-users', roleUserRoutes);
app.use('/api/patient-histories', patientHistoryRoutes);
app.use('/api/upload', uploadRoutes);

// ─── Health Check ──────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ──────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SolidLIMS API running on http://localhost:${PORT}`);
});

export default app;
