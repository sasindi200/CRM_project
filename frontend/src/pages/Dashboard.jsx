import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Dashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [target, setTarget] = useState(0);
    const [editingTarget, setEditingTarget] = useState(false);
    const [targetInput, setTargetInput] = useState("");
    const [targetError, setTargetError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchAll = async () => {
        try {
            const [dashRes, targetRes] = await Promise.all([
                API.get("/dashboard"),
                API.get("/settings/target"),
            ]);
            setStats(dashRes.data);
            setTarget(targetRes.data.target || 0);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleTargetSave = async () => {
        setTargetError("");
        const value = Number(targetInput);
        if (!targetInput || isNaN(value) || value < 0) {
            setTargetError("Enter a valid positive number.");
            return;
        }
        try {
            await API.put("/settings/target", { target: value });
            setTarget(value);
            setEditingTarget(false);
        } catch (err) {
            setTargetError(err.response?.data?.message || "Failed to save target.");
        }
    };

    const startEditTarget = () => {
        setTargetInput(target === 0 ? "" : String(target));
        setTargetError("");
        setEditingTarget(true);
    };

    const cancelEditTarget = () => {
        setEditingTarget(false);
        setTargetError("");
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    const wonThisMonth = stats?.wonThisMonth || 0;
    const progressPercent = target > 0 ? Math.min((wonThisMonth / target) * 100, 100) : 0;
    const isAchieved = target > 0 && wonThisMonth >= target;

    const now = new Date();
    const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

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
                        <Link to="/leads" className="primary-link">Manage Leads</Link>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>

                {/* Sales Target Tracker */}
                <div className="bento-card target-card">
                    <div className="target-header">
                        <div>
                            <h3>Monthly Sales Target</h3>
                            <p className="target-month">{monthLabel}</p>
                        </div>
                        {!editingTarget && (
                            <button className="target-edit-btn" onClick={startEditTarget}>
                                {target === 0 ? "Set Target" : "Edit"}
                            </button>
                        )}
                    </div>

                    {editingTarget ? (
                        <div className="target-edit-form">
                            <input
                                type="number"
                                className="target-input"
                                placeholder="Enter target amount"
                                value={targetInput}
                                onChange={(e) => setTargetInput(e.target.value)}
                                min="0"
                                autoFocus
                            />
                            {targetError && <p className="target-error">{targetError}</p>}
                            <div className="target-edit-actions">
                                <button className="primary-btn" onClick={handleTargetSave}>Save</button>
                                <button className="secondary-btn" onClick={cancelEditTarget}>Cancel</button>
                            </div>
                        </div>
                    ) : target === 0 ? (
                        <p className="target-empty">No target set for this month.</p>
                    ) : (
                        <>
                            <div className="target-amounts">
                                <span className="target-won">Rs. {wonThisMonth.toLocaleString()}</span>
                                <span className="target-divider">of</span>
                                <span className="target-goal">Rs. {target.toLocaleString()}</span>
                            </div>
                            <div className="progress-bar-track">
                                <div
                                    className="progress-bar-fill"
                                    style={{
                                        width: `${progressPercent}%`,
                                        background: isAchieved
                                            ? "linear-gradient(90deg, #10b981, #34d399)"
                                            : "linear-gradient(90deg, #06b6d4, #0891b2)",
                                    }}
                                />
                            </div>
                            <div className="target-footer">
                                <span className={`target-percent ${isAchieved ? "target-achieved" : ""}`}>
                                    {isAchieved ? "Target achieved!" : `${progressPercent.toFixed(1)}% reached`}
                                </span>
                                {!isAchieved && (
                                    <span className="target-remaining">
                                        Rs. {(target - wonThisMonth).toLocaleString()} remaining
                                    </span>
                                )}
                            </div>
                        </>
                    )}
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
