import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    const {name, email, password} = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }   
        if (password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: 'Invalid email format'});
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({message: 'Email already exists'});
        }

        const newUser = await User.create({ name, email, password });
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });

    } catch (error) {
        
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({
            message: 'Login successful',
            user
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout successful" });
}