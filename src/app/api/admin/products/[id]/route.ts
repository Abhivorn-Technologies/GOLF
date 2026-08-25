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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  try {
    const { id } = await params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
