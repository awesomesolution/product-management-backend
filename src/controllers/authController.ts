import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

// Signup
export const signup = async (req: Request, res: Response) => {
    console.log("signup called...");
    
  const { fullName, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully...' });
  } catch (error) {
    res.status(500).json({ message: 'Error while registering user: ', error });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    
    const userDetails: any = await User.findOne({ email});
    if (!userDetails) res.status(404).json({ message: 'User not found...' });
    else if (userDetails?.status !== 'active') {
      res.status(403).json({ message: 'Please connect to Admin to active...' });
    }
    const isPasswordValid = await bcrypt.compare(password, userDetails?.password);
    if (!isPasswordValid) res.status(401).json({ message: 'Invalid credentials...' });
    else res.status(200).json({ message: 'Login successful...', userDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error while logging in: ', error });
  }
};