import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { setLoggedInUser } from '../store';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      // Regjistrimi
      const { data, error } = await supabase.from('users').insert([{ email, name }]).select();
      if (error) {
        setError('Ky email mund të jetë i zënë ose ka një problem.');
      } else if (data && data.length > 0) {
        const newUser = data[0];
        
        // Shtojmë disa kategori bazë për përdoruesin e ri
        await supabase.from('categories').insert([
          { user_id: newUser.id, name: 'Ushqim', type: 'expense' },
          { user_id: newUser.id, name: 'Transport', type: 'expense' },
          { user_id: newUser.id, name: 'Qira', type: 'expense' },
          { user_id: newUser.id, name: 'Paga', type: 'income' },
        ]);

        setLoggedInUser(newUser);
        onLogin(newUser);
      }
    } else {
      // Kyçja (Login)
      const { data, error } = await supabase.from('users').select('*').eq('email', email);
      if (error) {
        setError('Gabim në lidhjen me databazën.');
      } else if (data && data.length > 0) {
        setLoggedInUser(data[0]);
        onLogin(data[0]);
      } else {
        setError('Përdoruesi nuk u gjet me këtë email. Ju lutem regjistrohuni.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
          {isRegistering ? 'Krijo Llogari' : 'Kyçuni'}
        </h1>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label className="form-label">Emri juaj</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="psh. Agim" />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email adresa</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="test@financaime.com" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isRegistering ? 'Regjistrohu' : 'Hyr në llogari'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button className="btn" style={{ background: 'transparent', color: 'var(--accent-primary)', padding: 0, fontSize: '0.9rem' }} onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
            {isRegistering ? 'Keni tashmë llogari? Kyçuni këtu.' : 'Nuk keni llogari? Regjistrohuni.'}
          </button>
        </div>
      </div>
    </div>
  );
}
