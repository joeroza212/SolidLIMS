import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { FaBars, FaSignOutAlt, FaGlobe } from 'react-icons/fa';

const menuItems = [
    { key: 'nav.dashboard', icon: 'fa-dashboard', path: '/dashboard' },
    { key: 'nav.patients', icon: 'fa-users', path: '/patients' },
    {
        key: 'nav.laboratory', icon: 'fa-flask', children: [
            { key: 'nav.testCategories', path: '/test-categories' },
            { key: 'nav.patientTests', path: '/user-tests' },
            { key: 'nav.widalTests', path: '/widal-tests' },
        ],
    },
    {
        key: 'nav.finance', icon: 'fa-money', children: [
            { key: 'nav.accountTypes', path: '/account-types' },
            { key: 'nav.ledgerAccounts', path: '/ledger-accounts' },
            { key: 'nav.transactions', path: '/transactions' },
            { key: 'nav.paymentMethods', path: '/payment-methods' },
            { key: 'nav.patientAmounts', path: '/patient-amounts' },
        ],
    },
    {
        key: 'nav.inventory', icon: 'fa-cubes', children: [
            { key: 'nav.products', path: '/products' },
            { key: 'nav.vendors', path: '/vendors' },
            { key: 'nav.stock', path: '/stocks' },
            { key: 'nav.stockInOut', path: '/stock-in-outs' },
        ],
    },
    {
        key: 'nav.userManagement', icon: 'fa-user-circle', children: [
            { key: 'nav.users', path: '/users' },
            { key: 'nav.roles', path: '/roles' },
            { key: 'nav.roleUsers', path: '/role-users' },
            { key: 'nav.menus', path: '/menus' },
            { key: 'nav.menuPermissions', path: '/menu-permissions' },
        ],
    },
    {
        key: 'nav.settings', icon: 'fa-cog', children: [
            { key: 'nav.appSettings', path: '/app-settings' },
            { key: 'nav.generalSettings', path: '/general-settings' },
            { key: 'nav.reportFormats', path: '/report-formats' },
            { key: 'nav.genders', path: '/genders' },
            { key: 'nav.genderPrefixes', path: '/gender-prefixes' },
            { key: 'nav.givenMethods', path: '/given-methods' },
            { key: 'nav.statuses', path: '/statuses' },
            { key: 'nav.notifications', path: '/notifications' },
        ],
    },
];

export default function MainLayout({ children }) {
    const { user, appSetting, logout } = useAuth();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState({});

    const toggleSubmenu = (label) => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const langCycle = ['en', 'id', 'ar'];
    const langLabels = { en: 'EN', id: 'ID', ar: 'AR' };

    const toggleLanguage = () => {
        const currentIdx = langCycle.indexOf(i18n.language);
        const newLang = langCycle[(currentIdx + 1) % langCycle.length];
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <div className={`layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">🧪</span>
                        <span className="logo-text">{appSetting?.appName || 'SolidLIMS'}</span>
                    </div>
                </div>

                <div className="sidebar-user">
                    <div className="user-avatar">{user?.userName?.[0]?.toUpperCase() || 'U'}</div>
                    <div className="user-info">
                        <span className="user-name">{user?.userName}</span>
                        <span className="user-role">{user?.role?.name}</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <div key={item.key} className="nav-group">
                            {item.children ? (
                                <>
                                    <button
                                        className={`nav-item nav-toggle ${openMenus[item.key] ? 'open' : ''}`}
                                        onClick={() => toggleSubmenu(item.key)}
                                    >
                                        <i className={`fa ${item.icon}`}></i>
                                        <span>{t(item.key)}</span>
                                        <i className={`fa fa-angle-${openMenus[item.key] ? 'down' : 'right'} arrow`}></i>
                                    </button>
                                    <div className={`nav-submenu ${openMenus[item.key] ? 'open' : ''}`}>
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.path}
                                                to={child.path}
                                                className={`nav-item sub ${location.pathname === child.path ? 'active' : ''}`}
                                            >
                                                <i className="fa fa-circle-o"></i>
                                                <span>{t(child.key)}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <i className={`fa ${item.icon}`}></i>
                                    <span>{t(item.key)}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-wrapper">
                <header className="topbar">
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FaBars />
                    </button>
                    <div className="topbar-right">
                        <button className="topbar-btn" onClick={toggleLanguage} title="Toggle Language">
                            <FaGlobe /> <span>{langLabels[i18n.language] || 'EN'}</span>
                        </button>
                        <div className="topbar-user">
                            <span>{user?.userName}</span>
                            <button className="topbar-btn logout-btn" onClick={handleLogout} title="Logout">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="main-content">
                    {children}
                </main>

                <footer className="main-footer">
                    <span>© {new Date().getFullYear()} {appSetting?.appName || 'SolidLIMS'}. All rights reserved.</span>
                    <span className="footer-version">{appSetting?.appVersion || 'v2.0.0'}</span>
                </footer>
            </div>
        </div>
    );
}
