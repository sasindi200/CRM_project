import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../api";

function LeadForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        lead_name: "",
        company_name: "",
        email: "",
        phone: "",
        lead_source: "Website",
        assigned_salesperson: "Admin User",
        status: "New",
        estimated_deal_value: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchLead = async () => {
        try {
            setLoading(true);

            const response = await API.get(`/leads/${id}`);

            setFormData({
                lead_name: response.data.lead_name || "",
                company_name: response.data.company_name || "",
                email: response.data.email || "",
                phone: response.data.phone || "",
                lead_source: response.data.lead_source || "Website",
                assigned_salesperson: response.data.assigned_salesperson || "Admin User",
                status: response.data.status || "New",
                estimated_deal_value: response.data.estimated_deal_value || "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load lead.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditMode) {
            fetchLead();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.lead_name || !formData.company_name || !formData.email) {
            setError("Lead name, company name, and email are required.");
            return;
        }

        try {
            const payload = {
                ...formData,
                estimated_deal_value: Number(formData.estimated_deal_value || 0),
            };

            if (isEditMode) {
                await API.put(`/leads/${id}`, payload);
            } else {
                await API.post("/leads", payload);
            }

            navigate("/leads");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save lead.");
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading lead...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>{isEditMode ? "Edit Lead" : "Add Lead"}</h1>
                    <p>{isEditMode ? "Update lead information" : "Create a new CRM lead"}</p>
                </div>

                <Link to="/leads" className="secondary-link">
                    Back to Leads
                </Link>
            </div>

            <div className="card form-card">
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Lead Name *</label>
                            <input
                                type="text"
                                name="lead_name"
                                value={formData.lead_name}
                                onChange={handleChange}
                                placeholder="Example: Nimal Perera"
                            />
                        </div>

                        <div className="form-group">
                            <label>Company Name *</label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder="Example: ABC Holdings"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0771234567"
                            />
                        </div>

                        <div className="form-group">
                            <label>Lead Source</label>
                            <select
                                name="lead_source"
                                value={formData.lead_source}
                                onChange={handleChange}
                            >
                                <option value="Website">Website</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Referral">Referral</option>
                                <option value="Cold Email">Cold Email</option>
                                <option value="Event">Event</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Assigned Salesperson</label>
                            <select
                                name="assigned_salesperson"
                                value={formData.assigned_salesperson}
                                onChange={handleChange}
                            >
                                <option value="Admin User">Admin User</option>
                                <option value="Salesperson 1">Salesperson 1</option>
                                <option value="Salesperson 2">Salesperson 2</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Proposal Sent">Proposal Sent</option>
                                <option value="Won">Won</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estimated Deal Value</label>
                            <input
                                type="number"
                                name="estimated_deal_value"
                                value={formData.estimated_deal_value}
                                onChange={handleChange}
                                placeholder="250000"
                            />
                        </div>
                    </div>

                    <button type="submit">
                        {isEditMode ? "Update Lead" : "Create Lead"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LeadForm;