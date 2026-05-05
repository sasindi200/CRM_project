import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>CRM Dashboard</h1>
                    <p>Welcome, {user?.name || "Admin User"}</p>
                </div>

                <button onClick={handleLogout}>Logout</button>
            </div>

            <div className="placeholder-card">
                <h2>Dashboard page loaded successfully</h2>
                <p>Login and protected route are working.</p>
            </div>
        </div>
    );
}

export default Dashboard;