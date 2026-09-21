import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

async function isAdmin(req: NextRequest) {
  return true;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();
    
    let updatedProduct = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
    }
    if (!updatedProduct) {
      updatedProduct = await Product.findOneAndUpdate({ slug: id }, body, { new: true });
    }
    
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  try {
    const { id } = await params;
    let deletedProduct = null;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedProduct = await Product.findByIdAndDelete(id);
    }
    if (!deletedProduct) {
      deletedProduct = await Product.findOneAndDelete({ slug: id });
    }
    
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
