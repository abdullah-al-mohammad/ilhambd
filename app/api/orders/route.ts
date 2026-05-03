import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // If a coupon code was provided, validate and increment usedCount
    if (body.couponCode) {
      const coupon = await Coupon.findOne({ code: String(body.couponCode).toUpperCase(), isActive: true });
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const order = await Order.create(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
