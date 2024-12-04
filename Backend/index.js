import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import autoIncrement from 'mongoose-sequence';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'https://talent-portal-seven.vercel.app',
    'https://talent-apply.vercel.app',
    'http://localhost:5174',
    'https://talent-apply-f7xb.vercel.app' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Access-Control-Allow-Origin', 
    'Access-Control-Allow-Headers'
  ],
  credentials: true
}));

const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, "Frontend", "New", "dist")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "New", "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const AutoIncrement = autoIncrement(mongoose);

// JWT token generation function

function generateTokenForUser(userEmail) {
    const token = jwt.sign({ email: userEmail }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
    return token;
}

// Define Mongoose schemas and models
const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

const User = mongoose.model('User', userSchema);

// Endpoint for user login
app.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        // Find user by either email or username
        const user = await User.findOne({
            $or: [
                { email: usernameOrEmail },
                { username: usernameOrEmail }
            ],
            password: password
        });

        if (user) {
            const token = generateTokenForUser(user.email); // Or use user.username if needed
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'Login failed. Invalid username, email, or password.' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});


// Endpoint to fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'An error occurred while fetching users.' });
    }
});

// Endpoint to add a new user
app.post('/users', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User added successfully', newUser });
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ message: 'An error occurred while adding the user.' });
    }
});

// Endpoint to edit user details
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, password }, { new: true });
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'An error occurred while updating the user.' });
    }
});

// Endpoint to delete a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'An error occurred while deleting the user.' });
    }
});

const detailsSchema = new mongoose.Schema({
    id: Number,
    name: String,
    technology: String,
    client: String,
    email: String,
    contactNo: { type: String, unique: true },
    feedback: String,
    blocked: String,
    source: String,
    linkedinProfile: String,
    comment: String,
    resume: String,
}, { timestamps: true });

detailsSchema.plugin(AutoIncrement, { inc_field: 'id' });

const Details = mongoose.model('Details', detailsSchema);

const storage = multer.memoryStorage();

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

app.post('/api/talent', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Resume file is required' });
        }

        // Check if contactNo already exists
        const existingTalent = await Details.findOne({ contactNo: req.body.contactNo });
        if (existingTalent) {
            return res.status(400).json({ error: 'A talent with this phone number already exists.' });
        }

        const resumeBase64 = req.file.buffer.toString('base64');
        const talent = new Details({
            ...req.body,
            resume: resumeBase64,
        });
        await talent.save();
        res.status(201).json(talent);
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            res.status(400).json({ error: 'A talent with this phone number already exists.' });
        } else {
            console.error('Error saving talent details:', error);
            res.status(400).json({ error: error.message });
        }
    }
});




app.get('/api/talent/resume/:id', async (req, res) => {
    try {
        const talent = await Details.findOne({ id: req.params.id });
        if (!talent) {
            return res.status(404).json({ error: 'Talent not found' });
        }
        const resumeBuffer = Buffer.from(talent.resume, 'base64');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=resume_${req.params.id}.pdf`);
        res.send(resumeBuffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/talent', async (req, res) => {
    try {
        const talents = await Details.find();
        res.status(200).json(talents);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.patch('/api/talent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;
        const talent = await Details.findOneAndUpdate({ id }, { feedback }, { new: true });
        res.status(200).json(talent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Talent Details

app.get('/api/talent/:id', async (req, res) => {
    try {
        const talent = await Details.findOne({ id: req.params.id });
        if (!talent) {
            return res.status(404).json({ error: 'Talent not found' });
        }
        res.status(200).json(talent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//2. Update Talent Details

app.put('/api/talent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const talent = await Details.findOneAndUpdate({ id }, updateData, { new: true });
        if (!talent) {
            return res.status(404).json({ error: 'Talent not found' });
        }
        res.status(200).json(talent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


//3. Delete Talent

app.delete('/api/talent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Details.deleteOne({ id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Talent not found' });
        }
        res.status(200).json({ message: 'Talent deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/talent/search', async (req, res) => {
    try {
        const { query } = req.query;
        const talents = await Details.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { contactNo: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(talents);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// endpoint to filter

const normalizeText = (text) => text.trim().toLowerCase();

app.get('/filter', async (req, res) => {
    const { technology, comment } = req.query;

    let filter = {};
    if (technology) {
        filter.technology = new RegExp(normalizeText(technology), 'i'); // Case-insensitive match
    }
    if (comment) {
        filter.comment = new RegExp(normalizeText(comment), 'i'); // Case-insensitive match
    }


    try {
        const results = await Details.find(filter);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
