import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const coupon = await Coupon.create({
      ...body,
      code: String(body.code || '').toUpperCase(),
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
