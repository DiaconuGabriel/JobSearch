const express = require('express');
const bodyParser = require('body-parser');
const { addUser, getPasswordByEmail } = require('./supabase');

const app = express();
const cors = require('cors');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Received data:', req.body);
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing fields!' });
    }
    try {
        const data = await addUser(username, email, password);
        res.json({ message: 'User added!', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/get-password', async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: 'No email!' });
    }
    try {
        const password = await getPasswordByEmail(email);
        if (!password) {
            return res.status(404).json({ error: 'User not found!' });
        }
        res.json({ password });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});