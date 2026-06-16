import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [taskRes, attRes] = await Promise.all([
        api.get(`/api/tasks/${id}`),
        api.get(`/api/tasks/${id}/attachments`),
      ]);
      setTask(taskRes.data.task);
      setAttachments(attRes.data.attachments);
    } catch (err) {
      toast.error('Failed to load task');
      navigate('/tasks');
    } finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { load(); }, [load]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post(`/api/tasks/${id}/comments`, { content: comment });
      setComment('');
      load();
    } catch { toast.error('Failed to add comment'); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post(`/api/tasks/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = async (attId, fileName) => {
    try {
      const res = await api.get(`/api/attachments/${attId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch { toast.error('Download failed'); }
  };

  const handleDeleteAttachment = async (attId) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await api.delete(`/api/attachments/${attId}`);
      toast.success('File deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (!task) return null;

  const priorityColor = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' }[task.priority];
  const statusColor = { 'To Do': '#6366f1', 'In Progress': '#f59e0b', 'Completed': '#10b981' }[task.status];

  return (
    <div className="page">
      <button className="btn btn-outline btn-sm" onClick={() => navigate('/tasks')} style={{ marginBottom: 16 }}>
        ← Back to Tasks
      </button>

      <div className="task-detail-card">
        <h2>{task.title}</h2>
        <div className="task-meta" style={{ margin: '12px 0' }}>
          <span className="tag" style={{ background: statusColor }}>{task.status}</span>
          <span className="tag" style={{ background: priorityColor }}>{task.priority}</span>
          {task.dueDate && <span>📅 Due: {task.dueDate}</span>}
          {task.assignee && <span>👤 Assigned to: {task.assignee.name}</span>}
        </div>
        {task.description && <p style={{ marginBottom: 16 }}>{task.description}</p>}
        <p style={{ fontSize: 12, color: '#94a3b8' }}>Created by {task.creator?.name}</p>
      </div>

      {/* Attachments section */}
      <div className="task-detail-card">
        <h3 style={{ marginBottom: 12 }}>📎 Attachments</h3>
        <div style={{ marginBottom: 12 }}>
          <input type="file" onChange={handleFileUpload} disabled={uploading} />
          {uploading && <span style={{ marginLeft: 8, fontSize: 12 }}>Uploading...</span>}
        </div>
        {attachments.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>No files attached yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {attachments.map(att => (
              <li key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
                <div>
                  <strong>{att.fileName}</strong>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    {formatSize(att.fileSize)} · uploaded by {att.uploader?.name}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-outline" onClick={() => handleDownload(att.id, att.fileName)}>Download</button>
                  {(att.uploadedBy === user.id || ['Admin', 'Project Manager'].includes(user.role)) && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAttachment(att.id)}>Delete</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Comments section */}
      <div className="task-detail-card">
        <h3 style={{ marginBottom: 12 }}>💬 Comments ({task.Comments?.length || 0})</h3>
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write a comment..."
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8 }}
          />
          <button type="submit" className="btn btn-primary">Post</button>
        </form>
        {(task.Comments || []).length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>No comments yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {task.Comments.map(c => (
              <div key={c.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8 }}>
                <strong style={{ fontSize: 13 }}>{c.User?.name}</strong>
                <p style={{ fontSize: 13, marginTop: 4 }}>{c.content}</p>
                <small style={{ color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
