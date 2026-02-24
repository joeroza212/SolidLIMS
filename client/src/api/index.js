import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || '';
            // Don't redirect for auth-check requests (prevents login loop)
            // and don't redirect if already on the login page
            const isAuthCheck = requestUrl.includes('/auth/me');
            const isLoginPage = window.location.pathname === '/login';
            if (!isAuthCheck && !isLoginPage) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// ─── Generic CRUD API helpers ──────────────
export const createCrudApi = (resource) => ({
    getAll: (params) => api.get(`/${resource}`, { params }).then(r => r.data),
    getById: (id) => api.get(`/${resource}/${id}`).then(r => r.data),
    create: (data) => api.post(`/${resource}`, data).then(r => r.data),
    update: (id, data) => api.put(`/${resource}/${id}`, data).then(r => r.data),
    delete: (id) => api.delete(`/${resource}/${id}`).then(r => r.data),
});

// ─── Auth API ──────────────────────────────
export const authApi = {
    login: (data) => api.post('/auth/login', data).then(r => r.data),
    logout: () => api.post('/auth/logout').then(r => r.data),
    me: () => api.get('/auth/me').then(r => r.data),
};

// ─── Dashboard API ─────────────────────────
export const dashboardApi = {
    getStats: () => api.get('/dashboard').then(r => r.data),
    getPatientChart: (year) => api.get('/dashboard/patient-chart', { params: { year } }).then(r => r.data),
    getTestCount: () => api.get('/dashboard/test-count').then(r => r.data),
    getPatientAmounts: () => api.get('/dashboard/patient-amounts').then(r => r.data),
    getLedgerTransactions: () => api.get('/dashboard/ledger-transactions').then(r => r.data),
    getStockSummary: () => api.get('/dashboard/stock-summary').then(r => r.data),
};

// ─── Reports API ───────────────────────────
export const reportApi = {
    patients: (params) => api.get('/reports/patients', { params }).then(r => r.data),
    doctorReport: (params) => api.get('/reports/doctor-report', { params }).then(r => r.data),
    patientTest: (params) => api.get('/reports/patient-test', { params }).then(r => r.data),
    widalReport: (params) => api.get('/reports/widal-report', { params }).then(r => r.data),
    receivedAmount: (params) => api.get('/reports/patient-received-amount', { params }).then(r => r.data),
    outstandingAmount: (params) => api.get('/reports/patient-outstanding-amount', { params }).then(r => r.data),
    cashCollection: (params) => api.get('/reports/patient-cash-collection', { params }).then(r => r.data),
    ledgerAccounts: (params) => api.get('/reports/ledger-accounts', { params }).then(r => r.data),
    accountsTransaction: (params) => api.get('/reports/accounts-transaction', { params }).then(r => r.data),
    products: () => api.get('/reports/products').then(r => r.data),
    vendors: () => api.get('/reports/vendors').then(r => r.data),
    stockIn: (params) => api.get('/reports/stock-in', { params }).then(r => r.data),
    stockFinished: () => api.get('/reports/stock-finished').then(r => r.data),
    permanentPatients: () => api.get('/reports/permanent-patients').then(r => r.data),
    testPriceList: () => api.get('/reports/test-price-list').then(r => r.data),
};
