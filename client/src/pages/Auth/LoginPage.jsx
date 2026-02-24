import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userName || !password) {
            toast.error('Please enter username and password');
            return;
        }
        setLoading(true);
        try {
            const res = await login(userName, password);
            if (res.success) {
                toast.success('Login successful!');
                navigate('/dashboard', { replace: true });
            } else {
                toast.error(res.message || 'Login failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg"></div>
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-logo">🧪</div>
                        <h1>SolidLIMS</h1>
                        <p>Laboratory Information Management System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="userName">
                                <i className="fa fa-user"></i> {t('auth.username')}
                            </label>
                            <input
                                id="userName"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Enter your username"
                                autoFocus
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <i className="fa fa-lock"></i> {t('auth.password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>{t('auth.login')} <i className="fa fa-arrow-right"></i></>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Default: <strong>admin</strong> / <strong>admin123</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
