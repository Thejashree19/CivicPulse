import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProjectManagement.css';

const initialFormState = {
  id: null,
  title: '',
  description: '',
  district: '',
  municipality: '',
  start_date: '',
  end_date: '',
  status: 'Pending',
  budget: ''
};

const statusOptions = ['Pending', 'Ongoing', 'Completed'];
const districts = [
  "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
  "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
  "Nagapattinam", "Namakkal", "Perambalur", "Pudukottai", "Ramanathapuram",
  "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi",
  "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
  "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
];

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5500/api/projects');
      setProjects(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setForm(initialFormState);
    setIsEditMode(false);
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setForm({
      ...project,
      start_date: project.start_date ? project.start_date.slice(0, 10) : '',
      end_date: project.end_date ? project.end_date.slice(0, 10) : ''
    });
    setIsEditMode(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      title: form.title,
      description: form.description,
      district: form.district,
      municipality: form.municipality,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status,
      budget: form.budget ? parseFloat(form.budget) : null
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5500/api/projects/${form.id}`, projectData);
      } else {
        await axios.post('http://localhost:5500/api/projects', projectData);
      }
      closeForm();
      fetchProjects();
    } catch (err) {
      alert('Error saving project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`http://localhost:5500/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  return (
    <div className="project-management-container">
      <h2>Project Management</h2>
      <button onClick={openAddForm} className="btn-add">Add New Project</button>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table className="project-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>District</th>
              <th>Municipality</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Budget (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(proj => (
              <tr key={proj.id}>
                <td>{proj.title}</td>
                <td>{proj.district}</td>
                <td>{proj.municipality}</td>
                <td>{proj.start_date ? new Date(proj.start_date).toLocaleDateString() : '-'}</td>
                <td>{proj.end_date ? new Date(proj.end_date).toLocaleDateString() : '-'}</td>
                <td>{proj.status}</td>
                <td>{proj.budget !== null && proj.budget !== undefined && !isNaN(Number(proj.budget)) ? Number(proj.budget).toFixed(2) : '-'}</td>

                <td>
                  <button onClick={() => openEditForm(proj)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(proj.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEditMode ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleSubmit} className="project-form">
              <label>
                Title*:
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Description:
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                District:
                <select name="district" value={form.district} onChange={handleInputChange}>
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>

              <label>
                Municipality:
                <input
                  type="text"
                  name="municipality"
                  value={form.municipality}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Start Date:
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                End Date:
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Status:
                <select name="status" value={form.status} onChange={handleInputChange}>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label>
                Budget (₹):
                <input
                  type="number"
                  name="budget"
                  min="0"
                  step="0.01"
                  value={form.budget}
                  onChange={handleInputChange}
                />
              </label>

              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  {isEditMode ? 'Update' : 'Add'}
                </button>
                <button type="button" className="btn-cancel" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
