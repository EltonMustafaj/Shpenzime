import { supabase } from './lib/supabase';

export const getLoggedInUser = () => {
  const user = localStorage.getItem('financa_user');
  return user ? JSON.parse(user) : null;
};

export const setLoggedInUser = (user) => {
  if (user) {
    localStorage.setItem('financa_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('financa_user');
  }
};

export const getCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*').eq('user_id', getLoggedInUser()?.id).order('id', { ascending: true });
  if (error) console.error('Error fetching categories:', error);
  return data || [];
};

export const addCategory = async (name, type) => {
  const { data, error } = await supabase.from('categories').insert([{ user_id: getLoggedInUser()?.id, name, type }]).select();
  if (error) console.error('Error adding category:', error);
  return data ? data[0] : null;
};

export const deleteCategory = async (id) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) console.error('Error deleting category:', error);
};

export const getExpenses = async () => {
  const { data, error } = await supabase.from('expenses').select('*').eq('user_id', getLoggedInUser()?.id).order('expense_date', { ascending: false });
  if (error) console.error('Error fetching expenses:', error);
  return data || [];
};

export const addExpense = async (expense) => {
  const { data, error } = await supabase.from('expenses').insert([{ 
    user_id: getLoggedInUser()?.id,
    category_id: parseInt(expense.category_id),
    amount: expense.amount,
    description: expense.description,
    expense_date: expense.date
  }]).select();
  if (error) console.error('Error adding expense:', error);
  return data ? data[0] : null;
};

export const updateExpense = async (id, updatedData) => {
  const { error } = await supabase.from('expenses').update({
    category_id: parseInt(updatedData.category_id),
    amount: updatedData.amount,
    description: updatedData.description,
    expense_date: updatedData.date
  }).eq('id', id);
  if (error) console.error('Error updating expense:', error);
};

export const deleteExpense = async (id) => {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) console.error('Error deleting expense:', error);
};

export const getBudget = async () => {
  // Ruajmë buxhetin global si një rresht në tabelën incomes për thjeshtësi
  const { data, error } = await supabase.from('incomes').select('amount').eq('user_id', getLoggedInUser()?.id).limit(1);
  if (error) console.error('Error fetching budget:', error);
  return data && data.length > 0 ? parseFloat(data[0].amount) : 0;
};

export const setBudget = async (amount) => {
  // Nëse ka një të hyrë e përditësojmë, përndryshe e krijojmë të re
  const { data: existing } = await supabase.from('incomes').select('id').eq('user_id', USER_ID).limit(1);
  
  if (existing && existing.length > 0) {
    const { error } = await supabase.from('incomes').update({ amount }).eq('id', existing[0].id);
    if (error) console.error('Error updating budget:', error);
  } else {
    const { error } = await supabase.from('incomes').insert([{
      user_id: USER_ID,
      amount: amount,
      description: 'Buxheti global',
      income_date: new Date().toISOString().split('T')[0]
    }]);
    if (error) console.error('Error inserting budget:', error);
  }
};
