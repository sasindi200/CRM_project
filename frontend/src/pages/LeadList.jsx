import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function LeadList() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        status: "",
        source: "",
        salesperson: "",
        search: "",
    });

    const fetchLeads = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/leads", {
                params: {
                    status: filters.status || undefined,
                    source: filters.source || undefined,
                    salesperson: filters.salesperson || undefined,
                    search: filters.search || undefined,
                },
            });

            setLeads(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load leads.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleApplyFilters = () => {
        fetchLeads();
    };

    const handleClearFilters = () => {
        setFilters({
            status: "",
            source: "",
            salesperson: "",
            search: "",
        });

        setTimeout(() => {
            fetchLeads();
        }, 0);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this lead?");

        if (!confirmDelete) return;

        try {
            await API.delete(`/leads/${id}`);
            fetchLeads();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete lead.");
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Leads</h1>
                    <p>Manage CRM sales leads</p>
                </div>

                <div className="header-actions">
                    <Link to="/dashboard" className="secondary-link">
                        Dashboard
                    </Link>

                    <Link to="/leads/new" className="primary-link">
                        Add Lead
                    </Link>
                </div>
            </div>

            <div className="card filter-card">
                <div className="filter-grid">
                    <div className="form-group">
                        <label>Search</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            placeholder="Search name, company, or email"
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">All Statuses</option>
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Lead Source</label>
                        <select name="source" value={filters.source} onChange={handleFilterChange}>
                            <option value="">All Sources</option>
                            <option value="Website">Website</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Referral">Referral</option>
                            <option value="Cold Email">Cold Email</option>
                            <option value="Event">Event</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Salesperson</label>
                        <select
                            name="salesperson"
                            value={filters.salesperson}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Salespeople</option>
                            <option value="Admin User">Admin User</option>
                            <option value="Salesperson 1">Salesperson 1</option>
                            <option value="Salesperson 2">Salesperson 2</option>
                        </select>
                    </div>
                </div>

                <div className="filter-buttons">
                    <button onClick={handleApplyFilters}>Apply Filters</button>
                    <button className="secondary-button" onClick={handleClearFilters}>
                        Clear
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="card">
                    <p>Loading leads...</p>
                </div>
            ) : (
                <div className="card">
                    {leads.length === 0 ? (
                        <p>No leads found.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Company</th>
                                        <th>Email</th>
                                        <th>Source</th>
                                        <th>Salesperson</th>
                                        <th>Status</th>
                                        <th>Deal Value</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {leads.map((lead) => (
                                        <tr key={lead.id}>
                                            <td>{lead.lead_name}</td>
                                            <td>{lead.company_name}</td>
                                            <td>{lead.email}</td>
                                            <td>{lead.lead_source}</td>
                                            <td>{lead.assigned_salesperson}</td>
                                            <td>
                                                <span className={`status-badge status-${lead.status.replaceAll(" ", "-").toLowerCase()}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td>Rs. {Number(lead.estimated_deal_value || 0).toLocaleString()}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <Link to={`/leads/${lead.id}`} className="small-link">
                                                        View
                                                    </Link>

                                                    <Link to={`/leads/${lead.id}/edit`} className="small-link">
                                                        Edit
                                                    </Link>

                                                    <button
                                                        className="danger-small-button"
                                                        onClick={() => handleDelete(lead.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default LeadList;