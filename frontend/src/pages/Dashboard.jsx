import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
            <div className="dashboard-header">
                <div>
                    <h1>CRM Dashboard</h1>
                    <p>Welcome, {user?.name || "Admin User"}</p>
                </div>

                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Leads</h3>
                    <p>{stats?.totalLeads || 0}</p>
                </div>

                <div className="stat-card">
                    <h3>New Leads</h3>
                    <p>{stats?.newLeads || 0}</p>
                </div>

                <div className="stat-card">
                    <h3>Qualified Leads</h3>
                    <p>{stats?.qualifiedLeads || 0}</p>
                </div>

                <div className="stat-card">
                    <h3>Won Leads</h3>
                    <p>{stats?.wonLeads || 0}</p>
                </div>

                <div className="stat-card">
                    <h3>Lost Leads</h3>
                    <p>{stats?.lostLeads || 0}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Estimated Deal Value</h3>
                    <p>Rs. {(stats?.totalEstimatedDealValue || 0).toLocaleString()}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Won Deal Value</h3>
                    <p>Rs. {(stats?.totalWonDealValue || 0).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;