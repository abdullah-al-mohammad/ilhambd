import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { code, orderAmount } = body;

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const couponCode = String(code).toUpperCase();
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'Coupon is not active' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit exceeded' }, { status: 400 });
    }

    if (
      coupon.minOrderAmount &&
      (orderAmount === undefined || orderAmount < coupon.minOrderAmount)
    ) {
      return NextResponse.json(
        { error: `Minimum order amount of $${coupon.minOrderAmount} required` },
        { status: 400 }
      );
    }

    // Return the discount details
    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
