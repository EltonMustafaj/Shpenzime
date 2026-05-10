import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory } from '../store';
import { Plus, Trash2 } from 'lucide-react';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');

  const loadData = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      await addCategory(name, type);
      setName('');
      loadData();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('A jeni të sigurt? Shpenzimet e kësaj kategorie nuk do të fshihen, por do të mbeten pa kategori.')) {
      await deleteCategory(id);
      loadData();
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Kategoritë</h1>
          <p>Menaxhoni kategoritë për shpenzimet dhe të hyrat tuaja.</p>
        </div>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="glass-panel" style={{ alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Shto Kategori të re</h2>
          <form onSubmit={handleAdd} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Emri i kategorisë</label>
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="psh. Karburant" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tipi</label>
              <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
                <option value="expense">Shpenzim</option>
                <option value="income">Të Hyra</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Plus size={18} /> Shto Kategorinë
            </button>
          </form>
        </div>

        <div className="glass-panel table-container">
          <table>
            <thead>
              <tr>
                <th>Emri</th>
                <th>Tipi</th>
                <th style={{ textAlign: 'right' }}>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td className="font-bold">{cat.name}</td>
                  <td>
                    <span className={`badge ${cat.type === 'expense' ? 'badge-expense' : 'badge-income'}`}>
                      {cat.type === 'expense' ? 'Shpenzim' : 'Të Hyra'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDelete(cat.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nuk ka kategori të regjistruara.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Categories;
