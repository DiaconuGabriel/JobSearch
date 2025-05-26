
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const GeminiApi = require('./GeminiApi');
const JoobleApi = require('./JoobleApi');
const multer = require("multer");
const pdfParse = require("pdf-parse");
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('./supabase');
const cors = require('cors');
const upload = multer();
const LogoApi = require('./LogoApi');
const Clearbit = require('./ClearBit');
const ClearbitApi = new Clearbit();
const logoApi = new LogoApi(process.env.LOGO_API_KEY);
const joobleApi = new JoobleApi(process.env.JOOBLE_API_KEY);
const jwtToken = process.env.JWT_SECRET;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const gemini = new GeminiApi(process.env.AI_API_KEY);

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],

    credentials: false,
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing fields!' });
    }
    try {
        const existing = await supabase.getPasswordByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'Email already registered!' });
        }
        const data = await supabase.addUser(username, email, password);
        return res.json({ message: 'User added!', data });
    } catch (error) {
        // console.log('Error adding user:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing fields!' });
    }
    try {
        const hashedPassword = await supabase.getPasswordByEmail(email);
        if (!hashedPassword) {
            return res.status(401).json({ error: 'Invalid credentials!' });
        }
        const valid = await bcrypt.compare(password, hashedPassword);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid password!' });
        }
        const token = jwt.sign({ email }, jwtToken, { expiresIn: '7d' });
        await supabase.saveJwtForEmail(email, token);

        return res.json({ message: 'Login successful!', token });
    } catch (error) {
        // console.log('Error logging in:', error);
        res.status(500).json({ error: 'Server error!' });
    }
});

app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Missing token!" });
  }
  let email;
  try {
    const decoded = jwt.verify(token, jwtToken);
    email = decoded.email;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const decoded = jwt.decode(token);
      email = decoded?.email;
      if (!email) {
        return res.status(401).json({ error: "Invalid token!" });
      }
    } else {
      return res.status(401).json({ error: "Invalid token!" });
    }
  }

  try {
    const data = await pdfParse(req.file.buffer);
    const fileName = req.file.originalname;
    const fileText = data.text;

    // console.log("File text length:", fileText);

    let keywords;
    try {
      keywords = await gemini.extractKeywords(fileText);
      if (!keywords) throw new Error("Gemini extraction failed");
    } catch (err) {
      return res.status(500).json({ error: "Could not extract keywords!" });
    }

    // console.log("Extracted keywords:", keywords);

    await supabase.saveCvForEmail(email, fileName, fileText);
    await supabase.saveCvKeysForEmail(email, keywords);

    res.json({ text: fileText, fileName, keywords, email });
  } catch (err) {
    res.status(500).json({ error: "Error on CV read!" });
  }
});

app.get("/user-profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, jwtToken);
    const email = decoded.email;

    const data = await supabase.getUserProfileByEmail(email);

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
    await supabase.updateUsernameForEmail(email, newUsername);
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
    if (!newPassword) {
      return res.status(400).json({ error: "Missing new password!" });
    }
    await supabase.updatePasswordForEmail(email, newPassword);
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
    await supabase.deleteUserByEmail(email);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Could not delete account!" });
  }
});

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    // console.log('Received email:', email);
    if (!email) {
        return res.status(400).json({ error: 'Missing email!' });
    }
    try {
        const hashedPassword = await supabase.getPasswordByEmail(email);
        // console.log('Hashed password:', hashedPassword);
        if (hashedPassword) {
            // console.log('Email exists, sending reset link...');
            const resetToken = jwt.sign({ email }, jwtToken, { expiresIn: '15m' });
            await supabase.saveJwtForResetPassword(email, resetToken);
            const resetLink = `https://jobsearch-n4zw.onrender.com/reset-password?reset-token=${resetToken}`;
            await transporter.sendMail({
                from: emailUser,
                to: email,
                subject: "Password Reset",
                text: `Click the following link to reset your password: ${resetLink}`
            });
            // console.log('Finished sending email');
        }
        return res.json({ message: 'If the email exists, you will receive a recovery email.' });
    } catch (error) {
        // console.log('Error sending password reset link:', error);
        res.status(500).json({ error: 'Server error!' });
    }
});

app.post("/delete-reset-token", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: 'Missing token!' });
    }
    try {
        const decoded = jwt.verify(token, jwtToken);
        const email = decoded.email;
        await supabase.deleteJwtForResetPassword(email);
        return res.json({ message: 'Reset token deleted!' });
    } catch (error) {
        // console.log('Error deleting reset token:', error);
        res.status(500).json({ error: 'Server error!' });
    }
});

app.get("/validate-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    jwt.verify(token, jwtToken);
    res.json({ valid: true });
  } catch {
    res.json({ valid: false });
  }
});

app.post("/validate-reset-token", async (req, res) => {
  const reset_token = req.headers.authorization?.split(" ")[1];
  // console.log('Received reset token:', reset_token);
  // if (!reset_token) return res.json({ valid: false });
  try {
    const decoded = jwt.verify(reset_token, jwtToken);
    const email = decoded.email;
    // console.log('Decoded email:', email);
    const exists = await supabase.checkResetTokenInDB(email);
    // console.log('Token exists in DB:', exists);
    res.json({ valid: !!exists });
  } catch {
    res.json({ valid: false });
  }
});

app.post("/get-jobs", async (req, res) => {
    // console.log('Received request to get jobs');
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.decode(token);
    const params = req.body;
    let keywords = await supabase.getKeyWordsForEmail(decoded.email);
    if (typeof keywords === "string") {
      keywords = keywords.trim();
        if (keywords.startsWith("```json")) {
            keywords = keywords.replace(/^```json/, '').replace(/```$/, '').trim();
        }
    }
    let keywordsObj = JSON.parse(keywords);
    let keywordsStr = Object.keys(keywordsObj).join(" ");

    // console.log('Keywords from DB:', keywordsStr);
    // console.log('Typeof keywords:', typeof keywords);

    params.companysearch = "false";
    const maxjobs = 1000;
    const pageSize = 50;
    const maxpage = (maxjobs / pageSize);
    let allJobs = [];
    let page = 0;
    let totalCount = 0;

    let seniorityKeywords = "";
    let seniorityKeywordsObj = {};
    // console.log(('Params for seniority:', params.seniority)); 
    if (params.seniority) {
        switch (params.seniority) {
            case "Junior":
                seniorityKeywords = "Junior Entry-level Graduate Intern Internship Trainee No experience New Grad Starter Early career Associate Student Recent graduate Beginner Fără experiență";
                seniorityKeywordsObj = { "Junior": 100,
                                        "Entry-level": 95,
                                        "Graduate": 90,
                                        "Intern": 85,
                                        "Internship": 85,
                                        "Trainee": 80,
                                        "No experience": 70,
                                        "New Grad": 70,
                                        "Starter": 65,
                                        "Early career": 65,
                                        "Associate": 60,
                                        "Student": 55,
                                        "Recent graduate": 55,
                                        "Beginner": 50,
                                        "Fără experiență": 50 };
                break;
            case "Mid":
                seniorityKeywords = "Mid Middle Intermediate";
                seniorityKeywordsObj = { "Mid": 80, "Middle": 75, "Intermediate": 70 };
                break;
            case "Senior":
                seniorityKeywords = "Senior Lead Expert";
                seniorityKeywordsObj = { "Senior": 80, "Lead": 75, "Expert": 70 };
                break;
            default:
                break;
        }
        keywordsStr = seniorityKeywords + " " + keywordsStr;
    }

    delete params.seniority;
    // console.log('Final keywords for search:', keywordsStr);
    try {
        do {
            params.page = page;
            params.ResultOnPage = pageSize;
            params.keywords = keywords;
            const jobsPage = await joobleApi.searchJobs(params);
            if (jobsPage.jobs && jobsPage.jobs.length > 0) {
                allJobs = allJobs.concat(jobsPage.jobs);
            }
            totalCount = jobsPage.totalCount || allJobs.length;
            page++;
        } while (allJobs.length < Math.min(maxjobs, totalCount) && page <= maxpage);

        const count = allJobs.length;
        // console.log('Keywords', keywords);
        // console.log('Seniority Keywords', seniorityKeywords);
        console.log(`Found ${count} jobs (max: ${maxjobs}, totalCount: ${totalCount})`);
        console.log('Params:', params.location);
        return res.json({ jobs: allJobs, keywordsObj, count, totalCount, seniorityKeywordsObj, location: params.location});
    } catch (error) {
        // console.log('Error fetching jobs:', error);
        res.status(500).json({ error: 'Server error!' });
    }
});

app.get("/get-logo", async (req, res) => {
    const { company, source } = req.query;
    // console.log('Received request for logo with company:', company, 'and source:', source);
    if (!company) {
        return res.redirect('https://placehold.co/40x40?text=?');
    }
    // console.log('Company:', company);
    let domain = company.trim();
      domain = domain
      .replace(/\b(inc|inc\.|ltd|ltd\.|s\.a\.|sa|srl|corp|corporation|co|llc|plc|gmbh|bv|ag|spa|sas|limited|company|group)\b/gi, '')
      .replace(/[,\'\"\.\s&]/g, '')
      .replace(/\s+/g, '')
      + '.com';

    // console.log('Final domain for logo (company):', domain);

    try {
        const logoBuffer = await logoApi.getLogo(domain);
        res.set('Content-Type', 'image/png');
        return res.send(logoBuffer);
    } catch (err) {
        try {
            // console.log(`Incerc cu Clearbit pentru domeniul: ${domain}`);
            const logoBuffer = await logoApi.getLogo(source);
            res.set('Content-Type', 'image/png');
            return res.send(logoBuffer);
        } catch (err2) {
            // console.log(`Nu am găsit logo pentru domeniul: ${domain}`);
            return res.redirect('https://logo.clearbit.com/' + source);
        }
        
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});