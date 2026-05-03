import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    if (body.code) {
      body.code = String(body.code).toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
