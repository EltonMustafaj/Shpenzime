import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ezqcwwetwnlkhdryxdus.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cWN3d2V0d25sa2hkcnl4ZHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTczMzYsImV4cCI6MjA5MzQ3MzMzNn0.v_mld3Kr7EChsnX75uZ1yJsSEKWC68l8DCFi9NAB4So';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('incomes').insert([{
    user_id: 1,
    amount: 500,
    description: 'Buxheti global',
    income_date: '2026-05-10'
  }]).select();
  console.log('Error:', error?.message);
  console.log('Data:', data);
}
test();
