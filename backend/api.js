const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { addUser, getPasswordByEmail, saveJwtForEmail, saveCvForEmail, getUserProfileByEmail, updateUsernameForEmail, updatePasswordForEmail, deleteUserByEmail} = require('./supabase');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = multer();
const jwtToken = process.env.JWT_SECRET;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const nodemailer = require('nodemailer');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],

    credentials: false,
}));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing fields!' });
    }
    try {
        const existing = await getPasswordByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered!' });
        }
        const data = await addUser(username, email, password);
        return res.json({ message: 'User added!', data });
    } catch (error) {
        console.log('Error adding user:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing fields!' });
    }
    try {
        const hashedPassword = await getPasswordByEmail(email);
        if (!hashedPassword) {
            return res.status(401).json({ error: 'Invalid credentials!' });
        }
        const valid = await bcrypt.compare(password, hashedPassword);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid password!' });
        }
        const token = jwt.sign({ email }, jwtToken, { expiresIn: '7d' });
        await saveJwtForEmail(email, token);

        return res.json({ message: 'Login successful!', token });
    } catch (error) {
        console.log('Error logging in:', error);
        res.status(500).json({ error: 'Server error!' });
    }
});

app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, jwtToken);
    const email = decoded.email;
    // console.log("File received:", req.file);
    // console.log("Decoded email:", email);

    const data = await pdfParse(req.file.buffer);
    const fileName = req.file.originalname;
    const fileText = data.text;

    // console.log("pdfParse result:", data);
    // console.log("Extracted text:", fileText);

    await saveCvForEmail(email, fileName, fileText);

    res.json({ text: fileText, fileName });
  } catch (err) {
    console.error("Eroare la upload-pdf:", err);
    res.status(500).json({ error: "Eroare la extragerea textului din PDF!" });
  }
});

app.get("/user-profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, jwtToken);
    const email = decoded.email;

    const data = await getUserProfileByEmail(email);

    res.json(data);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/update-username", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, jwtToken);
    const email = decoded.email;
    const { newUsername } = req.body;
    await updateUsernameForEmail(email, newUsername);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Could not update username!" });
  }
});

app.post("/update-password", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, jwtToken);
    const email = decoded.email;
    const { newPassword } = req.body;
    await updatePasswordForEmail(email, newPassword);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Could not update password!" });
  }
});

app.post("/delete-account", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, jwtToken);
    const email = decoded.email;
    deleteUserByEmail(email);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Could not delete account!" });
  }
});

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    console.log('Received email:', email);
    if (!email) {
        return res.status(400).json({ error: 'Missing email!' });
    }
    try {
        const hashedPassword = await getPasswordByEmail(email);
        console.log('Hashed password:', hashedPassword);
        if (hashedPassword) {
            console.log('Email exists, sending reset link...');
            const resetToken = jwt.sign({ email }, jwtToken, { expiresIn: '15m' });
            const resetLink = `http://localhost:5173/reset-password?reset-token=${resetToken}`;
            await transporter.sendMail({
                from: emailUser,
                to: email,
                subject: "Password Reset",
                text: `Click the following link to reset your password: ${resetLink}`
            });
            console.log('Finished sending email');
        }
        return res.json({ message: 'If the email exists, you will receive a recovery email.' });
    } catch (error) {
        console.log('Error sending password reset link:', error);
        res.status(500).json({ error: 'Server error!' });
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});