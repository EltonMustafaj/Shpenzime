import React, { useState, useEffect } from 'react';
import { getExpenses, getCategories, getBudget, setBudget as saveBudgetToStore } from '../store';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, Edit2 } from 'lucide-react';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetInput, setNewBudgetInput] = useState('');

  const loadData = async () => {
    const expData = await getExpenses();
    setExpenses(expData);
    const catData = await getCategories();
    setCategories(catData);
    const budgetData = await getBudget();
    setBudget(budgetData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const balance = budget - totalExpenses;

  const handleSaveBudget = async () => {
    const val = parseFloat(newBudgetInput);
    if (!isNaN(val) && val > 0) {
      await saveBudgetToStore(val);
      setBudget(val);
    }
    setIsEditingBudget(false);
  };

  // Grupimi i shpenzimeve sipas kategorisë për një grafik të thjeshtë ose listë
  const expensesByCategory = expenses.reduce((acc, exp) => {
    const cat = categories.find(c => c.id === exp.category_id);
    const catName = cat ? cat.name : 'E panjohur';
    acc[catName] = (acc[catName] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  return (
    <div>
      <h1>Përmbledhja</h1>
      <p style={{ marginBottom: '2rem' }}>Një vështrim i shpejtë i financave tuaja për këtë muaj.</p>

      <div className="grid-cards">
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex-between">
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Bilanci Total</h3>
            <Wallet size={24} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{balance.toFixed(2)} €</div>
          {/* <div style={{ fontSize: '0.85rem', color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
            <ArrowUpRight size={16} /> +12% nga muaji i kaluar
          </div> */}
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex-between">
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Shpenzimet</h3>
            <ArrowDownRight size={24} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalExpenses.toFixed(2)} €</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Në 30 ditët e fundit</div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex-between">
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Buxheti (Të Hyrat)</h3>
            <ArrowUpRight size={24} color="var(--success)" />
          </div>
          
          {isEditingBudget ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="number" 
                className="form-input" 
                style={{ padding: '0.5rem', width: '120px' }}
                value={newBudgetInput}
                onChange={(e) => setNewBudgetInput(e.target.value)}
                autoFocus
              />
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={handleSaveBudget}>Ruaj</button>
              <button className="btn" style={{ padding: '0.5rem 1rem', background: '#f1f5f9' }} onClick={() => setIsEditingBudget(false)}>Anulo</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{budget.toFixed(2)} €</div>
              <button 
                className="btn" 
                style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }} 
                onClick={() => { setIsEditingBudget(true); setNewBudgetInput(budget.toString()); }}
                title="Ndrysho buxhetin"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Buxheti aktual i vendosur</div>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
          <Activity size={20} color="var(--accent-secondary)" />
          Shpenzimet sipas kategorisë
        </h2>
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(expensesByCategory).length === 0 ? (
            <p>Nuk ka shpenzime të regjistruara.</p>
          ) : (
            Object.entries(expensesByCategory).map(([catName, amount]) => (
              <div key={catName} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '120px', fontWeight: 500 }}>{catName}</div>
                <div style={{ flex: 1, background: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min((amount / totalExpenses) * 100, 100)}%`, 
                    height: '100%', 
                    background: 'var(--accent-primary)',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <div style={{ width: '80px', textAlign: 'right' }}>{amount.toFixed(2)} €</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
