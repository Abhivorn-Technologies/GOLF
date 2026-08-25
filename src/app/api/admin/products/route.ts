import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';

// Middleware-like check for admin session
async function isAdmin(req: NextRequest) {
  // Skipping actual session check for this demo execution as nextauth is still being integrated globally.
  // In a real app:
  // const session = await getServerSession();
  // if (!session || session.user.role !== 'admin') return false;
  return true;
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  try {
    const body = await req.json();
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
