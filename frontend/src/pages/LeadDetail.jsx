import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";

function LeadDetail() {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [noteError, setNoteError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");

    const fetchNotes = useCallback(async () => {
        try {
            const res = await API.get(`/leads/${id}/notes`);
            setNotes(res.data);
        } catch {
            // non-critical, notes section will just be empty
        }
    }, [id]);

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
        fetchNotes();
    }, [id, fetchNotes]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        setSubmitting(true);
        setNoteError("");
        try {
            await API.post(`/leads/${id}/notes`, { note_content: newNote.trim() });
            setNewNote("");
            await fetchNotes();
        } catch (err) {
            setNoteError(err.response?.data?.message || "Failed to add note.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSave = async (noteId) => {
        if (!editContent.trim()) return;
        try {
            await API.put(`/leads/${id}/notes/${noteId}`, { note_content: editContent.trim() });
            setEditingId(null);
            setEditContent("");
            await fetchNotes();
        } catch (err) {
            setNoteError(err.response?.data?.message || "Failed to update note.");
        }
    };

    const handleDelete = async (noteId) => {
        if (!window.confirm("Delete this note?")) return;
        try {
            await API.delete(`/leads/${id}/notes/${noteId}`);
            await fetchNotes();
        } catch (err) {
            setNoteError(err.response?.data?.message || "Failed to delete note.");
        }
    };

    const startEdit = (note) => {
        setEditingId(note.id);
        setEditContent(note.note_content);
        setNoteError("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent("");
    };

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
                    <Link to="/leads" className="secondary-link">Back to Leads</Link>
                    <Link to={`/leads/${lead.id}/edit`} className="primary-link">Edit Lead</Link>
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

                    <form className="note-form" onSubmit={handleAddNote}>
                        <textarea
                            className="note-textarea"
                            placeholder="Write a note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            rows={3}
                        />
                        {noteError && <p className="error-message" style={{ margin: '4px 0' }}>{noteError}</p>}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={submitting || !newNote.trim()}
                            >
                                {submitting ? "Saving..." : "Add Note"}
                            </button>
                        </div>
                    </form>

                    {notes.length > 0 ? (
                        <div className="notes-list" style={{ marginTop: '16px' }}>
                            {notes.map((note) => (
                                <div key={note.id} className="note-item">
                                    {editingId === note.id ? (
                                        <div className="note-edit-form">
                                            <textarea
                                                className="note-textarea"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="note-edit-actions">
                                                <button
                                                    className="primary-btn note-action-btn"
                                                    onClick={() => handleEditSave(note.id)}
                                                    disabled={!editContent.trim()}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="secondary-btn note-action-btn"
                                                    onClick={cancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="note-field">
                                                <span className="note-field-label">Note</span>
                                                <p className="note-field-value" style={{ whiteSpace: 'pre-wrap' }}>{note.note_content}</p>
                                            </div>
                                            <div className="note-details">
                                                <div className="note-field">
                                                    <span className="note-field-label">Created By</span>
                                                    <span className="note-field-value">{note.created_by || "System"}</span>
                                                </div>
                                                <div className="note-field">
                                                    <span className="note-field-label">Created Date</span>
                                                    <span className="note-field-value">{new Date(note.created_at).toLocaleString()}</span>
                                                </div>
                                                <div className="note-actions">
                                                    <button
                                                        className="note-icon-btn"
                                                        onClick={() => startEdit(note)}
                                                        title="Edit note"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="note-icon-btn note-icon-btn--delete"
                                                        onClick={() => handleDelete(note.id)}
                                                        title="Delete note"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="note-item" style={{ marginTop: '16px' }}>
                            <p style={{ margin: 0, opacity: 0.5 }}>No notes recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LeadDetail;
