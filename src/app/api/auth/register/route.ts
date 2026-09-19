import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

import { validatePassword } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const { name, email, password, newsletterSubscribed = true } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.errorMessage }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default to normal user
      newsletterSubscribed: Boolean(newsletterSubscribed),
    });

    return NextResponse.json(
      { message: 'User registered successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Fallback for local development if MongoDB is blocked
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { message: 'Local DB Offline: Mock Registration Successful', userId: 'mock-user-123' },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
