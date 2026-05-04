// Ky është një mock store për të simuluar Supabase
// Në një aplikacion real, këto të dhëna do të vinin nga Supabase (psh: supabase.from('expenses').select('*'))

const initialCategories = [
  { id: '1', name: 'Ushqim', type: 'expense' },
  { id: '2', name: 'Transport', type: 'expense' },
  { id: '3', name: 'Qira', type: 'expense' },
  { id: '4', name: 'Paga', type: 'income' },
];

const initialExpenses = [
  { id: '101', category_id: '1', amount: 45.50, description: 'Blerje në supermarket', date: '2026-05-01' },
  { id: '102', category_id: '2', amount: 30.00, description: 'Naftë për veturë', date: '2026-05-04' },
];

export const getCategories = () => {
  const data = localStorage.getItem('financa_categories');
  return data ? JSON.parse(data) : initialCategories;
};

export const getExpenses = () => {
  const data = localStorage.getItem('financa_expenses');
  return data ? JSON.parse(data) : initialExpenses;
};

export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    ...expense,
    id: Math.random().toString(36).substr(2, 9),
  };
  expenses.push(newExpense);
  localStorage.setItem('financa_expenses', JSON.stringify(expenses));
  return newExpense;
};

export const updateExpense = (id, updatedData) => {
  let expenses = getExpenses();
  expenses = expenses.map(exp => exp.id === id ? { ...exp, ...updatedData } : exp);
  localStorage.setItem('financa_expenses', JSON.stringify(expenses));
};

export const deleteExpense = (id) => {
  let expenses = getExpenses();
  expenses = expenses.filter(exp => exp.id !== id);
  localStorage.setItem('financa_expenses', JSON.stringify(expenses));
};
