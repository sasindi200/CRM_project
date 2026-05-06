import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

function LeadDetail() {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await API.get(`/leads/${id}`);
                setLead(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load lead details.");
            } finally {
                setLoading(false);
            }
        };

        fetchLead();
    }, [id]);

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading lead details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="error-message">{error}</div>
                <Link to="/leads" className="secondary-link" style={{ marginTop: '16px', display: 'inline-block' }}>
                    Back to Leads
                </Link>
            </div>
        );
    }

    if (!lead) return null;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>{lead.lead_name}</h1>
                    <p>{lead.company_name}</p>
                </div>
                <div className="header-actions">
                    <Link to="/leads" className="secondary-link">
                        Back to Leads
                    </Link>
                    <Link to={`/leads/${lead.id}/edit`} className="primary-link">
                        Edit Lead
                    </Link>
                </div>
            </div>

            <div className="detail-grid">
                <div className="card">
                    <h3 style={{ marginTop: 0, color: '#06b6d4', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>Lead Information</h3>
                    
                    <div className="detail-row">
                        <strong>Status</strong>
                        <span className={`status-badge status-${lead.status?.replaceAll(" ", "-").toLowerCase()}`}>
                            {lead.status}
                        </span>
                    </div>
                    <div className="detail-row">
                        <strong>Email</strong>
                        <span>{lead.email}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Phone</strong>
                        <span>{lead.phone || "N/A"}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Source</strong>
                        <span>{lead.lead_source}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Salesperson</strong>
                        <span>{lead.assigned_salesperson}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Deal Value</strong>
                        <span>Rs. {Number(lead.estimated_deal_value || 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="card notes-card" style={{ marginTop: 0 }}>
                    <h3 style={{ marginTop: 0, color: '#06b6d4', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>Notes & Activity</h3>
                    
                    {lead.notes && lead.notes.length > 0 ? (
                        <div className="notes-list">
                            {lead.notes.map((note, index) => (
                                <div key={index} className="note-item">
                                    <p>{note.text}</p>
                                    <div className="note-meta">
                                        <span>{note.author || "System"}</span>
                                        <span>{new Date(note.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="note-item">
                            <p>No notes or activity recorded for this lead yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LeadDetail;
