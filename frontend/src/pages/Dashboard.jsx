import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Dashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchDashboardStats = async () => {
        try {
            const response = await API.get("/dashboard");
            setStats(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            {error && <div className="error-message">{error}</div>}

            <div className="bento-grid">
                <div className="bento-card header-card">
                    <div>
                        <h1>CRM Dashboard</h1>
                        <p>Welcome, {user?.name || "Admin User"}</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/leads" className="primary-link">
                            Manage Leads
                        </Link>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bento-card main-metric">
                    <h3>Total Won Deal Value</h3>
                    <p>Rs. {(stats?.totalWonDealValue || 0).toLocaleString()}</p>
                </div>

                <div className="bento-card financial-card">
                    <h3>Estimated Deal Value</h3>
                    <p>Rs. {(stats?.totalEstimatedDealValue || 0).toLocaleString()}</p>
                </div>

                <div className="bento-card small-stat">
                    <h3>Total Leads</h3>
                    <p>{stats?.totalLeads || 0}</p>
                </div>

                <div className="bento-card small-stat">
                    <h3>New Leads</h3>
                    <p>{stats?.newLeads || 0}</p>
                </div>

                <div className="bento-card small-stat">
                    <h3>Qualified</h3>
                    <p>{stats?.qualifiedLeads || 0}</p>
                </div>

                <div className="bento-card small-stat">
                    <h3>Won Leads</h3>
                    <p>{stats?.wonLeads || 0}</p>
                </div>

                <div className="bento-card small-stat lost-card">
                    <h3>Lost Leads</h3>
                    <p>{stats?.lostLeads || 0}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;