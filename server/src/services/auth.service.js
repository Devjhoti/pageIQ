const { supabase } = require('../config/supabase');

const createProfile = async (userId, name) => {
  const { data, error } = await supabase
    .from('users')
    .insert({ id: userId, name, plan: 'Free' })
    .select()
    .single();

  if (error) throw { status: 400, message: error.message };
  return data;
};

const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw { status: 404, message: 'User not found' };
  return data;
};

const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw { status: 400, message: error.message };
  return data;
};

const deleteAccount = async (userId) => {
  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (deleteError) throw { status: 400, message: deleteError.message };

  const { error: adminError } = await supabase.auth.admin.deleteUser(userId);
  if (adminError) throw { status: 400, message: adminError.message };

  return { message: 'Account deleted successfully' };
};

module.exports = { createProfile, getProfile, updateProfile, deleteAccount };
