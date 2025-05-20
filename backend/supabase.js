require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_TABLE = process.env.TABLE_NAME;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function addUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
        .from(SUPABASE_TABLE)
        .insert([{ username, email, password: hashedPassword }]);
    if (error) throw error;
    return data;
}

async function getPasswordByEmail(email) {
    const { data, error } = await supabase
        .from(SUPABASE_TABLE)
        .select('password')
        .eq('email', email)
        .single();
    if (error) throw error;
    return data ? data.password : null;
}

module.exports = { supabase, addUser, getPasswordByEmail };