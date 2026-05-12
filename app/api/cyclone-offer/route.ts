import dbConnect from '@/lib/mongodb';
import CycloneOffer from '@/models/CycloneOffer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const sale = await CycloneOffer.findOne().sort({ createdAt: -1 });
  return NextResponse.json(sale || {});
}

export async function PATCH(req: NextRequest) {
  await dbConnect();
  const { isActive, endTime } = await req.json();
  const sale = await CycloneOffer.findOneAndUpdate(
    {},
    { isActive, endTime },
    { new: true, upsert: true, sort: { createdAt: -1 } }
  );
  return NextResponse.json(sale);
}
