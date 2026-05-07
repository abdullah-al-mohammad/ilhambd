import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { credential } = await req.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    const { sub: googleId, email, name, picture } = payload;

    // 🔍 Find or Create User
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        role: 'user',
      });
    } else if (!user.googleId) {
      // Link Google ID if user already existed via email
      user.googleId = googleId;
      await user.save();
    }

    // ✅ JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: picture,
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
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
