const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function findByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) return null;
  return data;
}

async function findById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

async function create({ username, email, password }) {
  const { data, error } = await supabase
    .from('users')
    .insert({ username, email, password })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

async function updatePassword(userId, hashedPassword) {
  const { error } = await supabase
    .from('users')
    .update({ password: hashedPassword })
    .eq('id', userId);
  if (error) throw new Error(error.message);
}

module.exports = { findByEmail, findById, create, updatePassword };
