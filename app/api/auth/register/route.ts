import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await dbConnect();

  const { name, email, phone, password } = await req.json();

  if (!email && !phone) {
    return NextResponse.json({ message: 'Email or Phone is required' }, { status: 400 });
  }

  const query = email ? { email } : { phone };
  const existingUser = await User.findOne(query);

  const hashedPassword = await bcrypt.hash(password, 10);
  let user;

  if (existingUser) {
    // If the user exists but has no password (e.g. Google-only account), allow them to set one.
    if (!existingUser.password) {
      existingUser.password = hashedPassword;
      if (name) existingUser.name = name;
      await existingUser.save();
      user = existingUser;
    } else {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }
  } else {
    user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  // ✅ JWT TOKEN (Auto-login)
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  const res = NextResponse.json({
    message: existingUser ? 'Password set successfully' : 'User registered successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });

  // ✅ Secure cookie
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return res;
}
