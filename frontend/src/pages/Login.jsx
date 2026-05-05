import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("password123");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>CRM Login</h1>
                <p>Login to manage sales leads</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            placeholder="admin@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            placeholder="password123"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="test-credentials">
                    <strong>Test Login</strong>
                    <p>Email: admin@example.com</p>
                    <p>Password: password123</p>
                </div>
            </div>
        </div>
    );
}

export default Login;