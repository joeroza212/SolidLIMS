import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import MainLayout from './components/Layout/MainLayout.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import CrudPage from './pages/Crud/CrudPage.jsx';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="page-loader">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<DashboardPage />} />

                                {/* User & Access Management */}
                                <Route path="/users" element={<CrudPage entity="users" title="Users" />} />
                                <Route path="/roles" element={<CrudPage entity="roles" title="Roles" />} />
                                <Route path="/role-users" element={<CrudPage entity="role-users" title="Role Users" />} />
                                <Route path="/menus" element={<CrudPage entity="menus" title="Menus" />} />
                                <Route path="/menu-permissions" element={<CrudPage entity="menu-permissions" title="Menu Permissions" />} />

                                {/* Lab */}
                                <Route path="/test-categories" element={<CrudPage entity="test-categories" title="Test Categories" />} />
                                <Route path="/user-tests" element={<CrudPage entity="user-tests" title="Patient Tests" />} />
                                <Route path="/widal-tests" element={<CrudPage entity="widal-tests" title="Widal Tests" />} />

                                {/* Patient */}
                                <Route path="/patients" element={<CrudPage entity="patients" title="Patients" />} />
                                <Route path="/permanent-patients" element={<CrudPage entity="permanent-patients" title="Permanent Patients" />} />
                                <Route path="/patient-amounts" element={<CrudPage entity="patient-amounts" title="Patient Amounts" />} />
                                <Route path="/patient-histories" element={<CrudPage entity="patient-histories" title="Patient History" />} />

                                {/* Finance */}
                                <Route path="/account-types" element={<CrudPage entity="account-types" title="Account Types" />} />
                                <Route path="/ledger-accounts" element={<CrudPage entity="ledger-accounts" title="Ledger Accounts" />} />
                                <Route path="/transactions" element={<CrudPage entity="transactions" title="Transactions" />} />
                                <Route path="/payment-methods" element={<CrudPage entity="payment-methods" title="Payment Methods" />} />

                                {/* Inventory */}
                                <Route path="/products" element={<CrudPage entity="products" title="Products" />} />
                                <Route path="/vendors" element={<CrudPage entity="vendors" title="Vendors" />} />
                                <Route path="/stocks" element={<CrudPage entity="stocks" title="Stock" />} />
                                <Route path="/stock-in-outs" element={<CrudPage entity="stock-in-outs" title="Stock In/Out" />} />

                                {/* System */}
                                <Route path="/genders" element={<CrudPage entity="genders" title="Genders" />} />
                                <Route path="/gender-prefixes" element={<CrudPage entity="gender-prefixes" title="Gender Prefixes" />} />
                                <Route path="/given-methods" element={<CrudPage entity="given-methods" title="Given Methods" />} />
                                <Route path="/statuses" element={<CrudPage entity="statuses" title="Statuses" />} />
                                <Route path="/app-settings" element={<CrudPage entity="app-settings" title="App Settings" />} />
                                <Route path="/general-settings" element={<CrudPage entity="general-settings" title="General Settings" />} />
                                <Route path="/notifications" element={<CrudPage entity="notifications" title="Notifications" />} />
                                <Route path="/report-formats" element={<CrudPage entity="report-formats" title="Report Formats" />} />
                            </Routes>
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
