const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const tableName = process.env.TABLE_NAME;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function addUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
        .from(tableName)
        .insert([{ username: username, email: email, password: hashedPassword }]);
    if (error) throw error;
    return data;
}

async function getPasswordByEmail(email) {
    const { data, error } = await supabase
        .from(tableName)
        .select('password')
        .eq('email', email)
        .single();
    if (error) return null;
    return data ? data.password : null;
}

async function saveJwtForEmail(email, jwtToken) {
    const { data, error } = await supabase
        .from(tableName)
        .update({ jwt_token: jwtToken })
        .eq('email', email);
    if (error) throw error;
    return data;
}

async function saveJwtForResetPassword(email, reset_token) {
    const { data, error } = await supabase
        .from(tableName)
        .update({ reset_token: reset_token })
        .eq('email', email);
    if (error) throw error;
    return data;
}

async function deleteJwtForResetPassword(email) {
    const { data, error } = await supabase
        .from(tableName)
        .update({ reset_token: null })
        .eq('email', email);
    if (error) throw error;
    return data;
}

async function checkResetTokenInDB(email) {
    const { data, error } = await supabase
        .from(tableName)
        .select('reset_token')
        .eq('email', email)
        .single();
    if (error) return null;
    return data ? data.reset_token : null;
}

async function saveCvForEmail(email, fileName, fileText) {
    const { data, error } = await supabase
        .from(tableName)
        .update({ cv_name: fileName, cv: fileText })
        .eq('email', email);
    if (error) throw error;
    return data;
}

async function getCvForEmail(email) {
    const { data, error } = await supabase
        .from(tableName)
        .select('cv')
        .eq('email', email)
        .single();
    if (error) throw error;
    return data ? data.cv : null;
}

async function getUserProfileByEmail(email) {
    const { data, error } = await supabase
        .from(tableName)
        .select('username, cv_name')
        .eq('email', email)
        .single();
    if (error) throw error;
    return {
        username: data?.username || "",
        cv_name: data?.cv_name || ""
    };
}

async function updateUsernameForEmail(email, newUsername) {
  const { data, error } = await supabase
    .from(tableName)
    .update({ username: newUsername })
    .eq('email', email);
  if (error) throw error;
  return data;
}

async function updatePasswordForEmail(email, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { data, error } = await supabase
        .from(tableName)
        .update({ password: hashedPassword })
        .eq('email', email);
    if (error) throw error;
    return data;
}

async function deleteUserByEmail(email) {
    const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('email', email);
    if (error) throw error;
    return data;
}

async function saveCvKeysForEmail(email, cvKeys) {
    const { data, error } = await supabase
        .from(tableName)
        .update({ keywords: cvKeys })
        .eq('email', email);
    if (error) throw error;
    return data;
}

async function getKeyWordsForEmail(email) {
    const { data, error } = await supabase
        .from(tableName)
        .select('keywords')
        .eq('email', email)
        .single();
    if (error) throw error;
    return data ? data.keywords : null;
}

module.exports = {
    addUser,
    getPasswordByEmail,
    saveJwtForEmail,
    saveCvForEmail,
    getCvForEmail,
    saveCvKeysForEmail,
    getUserProfileByEmail,
    updateUsernameForEmail,
    updatePasswordForEmail,
    deleteUserByEmail,
    saveJwtForResetPassword,
    deleteJwtForResetPassword,
    checkResetTokenInDB,
    getKeyWordsForEmail
};