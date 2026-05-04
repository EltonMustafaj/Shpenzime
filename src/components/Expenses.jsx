import React, { useState, useEffect } from 'react';
import { getExpenses, getCategories, addExpense, deleteExpense, updateExpense } from '../store';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { format } from 'date-fns';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    category_id: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadData = () => {
    setExpenses(getExpenses());
    setCategories(getCategories().filter(c => c.type === 'expense'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setEditingId(expense.id);
      setFormData({
        amount: expense.amount,
        category_id: expense.category_id,
        description: expense.description,
        date: expense.date
      });
    } else {
      setEditingId(null);
      setFormData({
        amount: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateExpense(editingId, { ...formData, amount: parseFloat(formData.amount) });
    } else {
      addExpense({ ...formData, amount: parseFloat(formData.amount) });
    }
    loadData();
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('A jeni të sigurt që dëshironi ta fshini këtë shpenzim?')) {
      deleteExpense(id);
      loadData();
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : 'E panjohur';
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Shpenzimet</h1>
          <p>Menaxhoni dhe regjistroni shpenzimet tuaja (CRUD).</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Shto Shpenzim
        </button>
      </div>

      <div className="glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Kategoria</th>
              <th>Përshkrimi</th>
              <th>Shuma</th>
              <th style={{ textAlign: 'right' }}>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nuk ka shpenzime të regjistruara.</td>
              </tr>
            ) : (
              expenses.map(expense => (
                <tr key={expense.id}>
                  <td>{format(new Date(expense.date), 'dd/MM/yyyy')}</td>
                  <td>
                    <span className="badge badge-expense">{getCategoryName(expense.category_id)}</span>
                  </td>
                  <td>{expense.description}</td>
                  <td className="font-bold">{parseFloat(expense.amount).toFixed(2)} €</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--accent-primary)' }} onClick={() => handleOpenModal(expense)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDelete(expense.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between mb-6">
              <h2>{editingId ? 'Ndrysho Shpenzimin' : 'Shto Shpenzim të Ri'}</h2>
              <button className="btn" style={{ background: 'transparent', padding: 0 }} onClick={handleCloseModal}>
                <X size={24} color="var(--text-secondary)" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Shuma (€)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  className="form-input" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                  placeholder="30.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kategoria</label>
                <select 
                  className="form-input" 
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                >
                  <option value="" disabled>Zgjidh kategorinë</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Data</label>
                <input 
                  type="date" 
                  required 
                  className="form-input" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Përshkrimi</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="psh. Naftë për veturë"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }} onClick={handleCloseModal}>Anulo</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Ruaj Ndryshimet' : 'Ruaj'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;
