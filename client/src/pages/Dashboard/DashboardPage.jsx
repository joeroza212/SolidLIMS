import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/index.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaFlask, FaCubes, FaExclamationTriangle } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

function StatCard({ icon: Icon, label, value, color, sub }) {
    return (
        <div className="stat-card" style={{ borderLeftColor: color }}>
            <div className="stat-icon" style={{ backgroundColor: color + '20', color }}><Icon /></div>
            <div className="stat-info">
                <span className="stat-value">{value ?? '—'}</span>
                <span className="stat-label">{label}</span>
                {sub && <span className="stat-sub">{sub}</span>}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: dashboardApi.getStats });
    const { data: chartData } = useQuery({ queryKey: ['patient-chart'], queryFn: () => dashboardApi.getPatientChart(new Date().getFullYear()) });
    const { data: testData } = useQuery({ queryKey: ['test-count'], queryFn: dashboardApi.getTestCount });
    const { data: amountData } = useQuery({ queryKey: ['patient-amounts'], queryFn: dashboardApi.getPatientAmounts });

    const s = stats?.data || {};

    const patientChartConfig = {
        labels: chartData?.data?.map(d => MONTHS[d.month - 1]) || [],
        datasets: [{
            label: 'Patients Registered',
            data: chartData?.data?.map(d => d.count) || [],
            backgroundColor: '#3b82f6',
            borderRadius: 6,
        }],
    };

    const testChartConfig = {
        labels: testData?.data?.map(d => d.name) || [],
        datasets: [{
            data: testData?.data?.map(d => d.count) || [],
            backgroundColor: COLORS,
            borderWidth: 0,
        }],
    };

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1><i className="fa fa-dashboard"></i> Dashboard</h1>
            </div>

            <div className="stats-grid">
                <StatCard icon={FaUsers} label="Total Patients" value={s.totalPatients} color="#3b82f6" sub={`${s.todayPatients || 0} today`} />
                <StatCard icon={FaFlask} label="Total Tests" value={s.totalTests} color="#10b981" sub={`${s.todayTests || 0} today`} />
                <StatCard icon={FaCubes} label="Products" value={s.totalProducts} color="#f59e0b" />
                <StatCard icon={FaExclamationTriangle} label="Low Stock" value={s.lowStockProducts} color="#ef4444" />
            </div>

            {amountData?.data && (
                <div className="amount-cards">
                    <div className="amount-card total">
                        <span className="amount-label">Total Billed</span>
                        <span className="amount-value">{Number(amountData.data.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="amount-card paid">
                        <span className="amount-label">Total Received</span>
                        <span className="amount-value">{Number(amountData.data.paidAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="amount-card due">
                        <span className="amount-label">Total Due</span>
                        <span className="amount-value">{Number(amountData.data.dueAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="amount-card discount">
                        <span className="amount-label">Total Discount</span>
                        <span className="amount-value">{Number(amountData.data.totalDiscount || 0).toLocaleString()}</span>
                    </div>
                </div>
            )}

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Patient Registrations ({new Date().getFullYear()})</h3>
                    <Bar data={patientChartConfig} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                </div>
                <div className="chart-card">
                    <h3>Tests by Category</h3>
                    <Doughnut data={testChartConfig} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>
            </div>
        </div>
    );
}
