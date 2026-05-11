import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const bestSelling = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          totalSold: 1,
          totalRevenue: 1,
          price: { $ifNull: ['$productDetails.price', 0] },
          image: '$productDetails.image',
          images: '$productDetails.images',
          category: '$productDetails.category',
        },
      },
    ]);

    return NextResponse.json(bestSelling);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
