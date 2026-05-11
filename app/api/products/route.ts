import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

// export async function GET(req: Request) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
//     const featured = searchParams.get('featured');
//     const flashSaleActive = searchParams.get('flashSaleActive');
//     const category = searchParams.get('category');

//     const query: Record<string, any> = {};
//     if (featured === 'true') query.isFeatured = true;
//     if (flashSaleActive === 'true') {
//       query.flashSaleEndsAt = { $gt: new Date() };
//       query.flashSalePrice = { $gt: 0 };
//     }
//     if (category) {
//       // Make it case-insensitive and replace hyphens with optional spaces or hyphens
//       const regexPattern = category.replace(/-/g, '[-\\s&]*');
//       query.category = { $regex: new RegExp(regexPattern, 'i') };
//     }

//     const products = await Product.find(query).sort({ createdAt: -1 });
//     return NextResponse.json(products);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const flashSaleActive = searchParams.get('flashSaleActive');
    const category = searchParams.get('category');
    const weekly = searchParams.get('weekly');
    const cycloneActive = searchParams.get('cycloneActive');
    const all = searchParams.get('all');

    const query: Record<string, any> = {};

    if (all !== 'true') {
      query.isDisabled = { $ne: true };
    }

    if (featured === 'true') query.isFeatured = true;
    if (cycloneActive === 'true') query.isCycloneOffer = true;

    if (flashSaleActive === 'true') {
      query.flashSaleEndsAt = { $gt: new Date() };
      query.flashSalePrice = { $gt: 0 };
    }

    if (category) {
      const regexPattern = category.replace(/-/g, '[-\\s&]*');
      query.category = { $regex: new RegExp(regexPattern, 'i') };
    }

    if (weekly === 'true') {
      // Instead of limiting to products created in the last 7 days, 
      // we sort by soldPercentage which the admin can control.
    }

    let sortOption: any = { createdAt: -1 };

    if (weekly === 'true') {
      sortOption = { soldPercentage: -1 }; // best sellers first
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .limit(weekly === 'true' ? 6 : 0); // 0 means no limit

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
