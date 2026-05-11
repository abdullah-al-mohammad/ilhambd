import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json({ message: 'Google credential is required' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID is missing in environment variables');
      return NextResponse.json({ message: 'Internal Server Error: Missing Google Client ID' }, { status: 500 });
    }

    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ message: 'Invalid Google token' }, { status: 400 });
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
        id: user._id.toString(),
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

    // ✅ Set cookie using headers for better compatibility with Next.js 15/16
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error: any) {
    console.error('Google Auth Error:', error.message || error);
    return NextResponse.json({ 
      message: 'Authentication failed', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}
