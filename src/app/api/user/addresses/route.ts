import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET all addresses
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST new address
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, phone, houseNumber, street, area, landmark, city, state, zip, country, isDefaultBilling, isDefaultShipping } = body;

    // Validate inputs
    if (!name || !phone || !street || !city || !state || !zip) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.addresses && user.addresses.length >= 5) {
      return NextResponse.json({ error: 'Maximum of 5 addresses allowed' }, { status: 400 });
    }

    const newAddress = {
      name: name.substring(0, 50),
      phone: phone.substring(0, 20),
      houseNumber: houseNumber ? houseNumber.substring(0, 100) : '',
      street: street.substring(0, 100),
      area: area ? area.substring(0, 100) : '',
      landmark: landmark ? landmark.substring(0, 100) : '',
      city: city.substring(0, 50),
      state: state.substring(0, 50),
      zip: zip.substring(0, 20),
      country: (country || 'India').substring(0, 50),
      isDefaultBilling: Boolean(isDefaultBilling),
      isDefaultShipping: Boolean(isDefaultShipping)
    };

    if (newAddress.isDefaultShipping) {
      user.addresses.forEach((a: any) => { a.isDefaultShipping = false; });
    }
    if (newAddress.isDefaultBilling) {
      user.addresses.forEach((a: any) => { a.isDefaultBilling = false; });
    }

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

// PUT edit address
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { _id, name, phone, houseNumber, street, area, landmark, city, state, zip, country, isDefaultBilling, isDefaultShipping } = body;

    if (!_id) return NextResponse.json({ error: 'Address ID required' }, { status: 400 });

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const address = user.addresses.id(_id);
    if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 404 });

    if (isDefaultShipping) {
      user.addresses.forEach((a: any) => { a.isDefaultShipping = false; });
    }
    if (isDefaultBilling) {
      user.addresses.forEach((a: any) => { a.isDefaultBilling = false; });
    }

    if (name) address.name = name.substring(0, 50);
    if (phone) address.phone = phone.substring(0, 20);
    if (houseNumber !== undefined) address.houseNumber = houseNumber.substring(0, 100);
    if (street) address.street = street.substring(0, 100);
    if (area !== undefined) address.area = area.substring(0, 100);
    if (landmark !== undefined) address.landmark = landmark.substring(0, 100);
    if (city) address.city = city.substring(0, 50);
    if (state) address.state = state.substring(0, 50);
    if (zip) address.zip = zip.substring(0, 20);
    if (country) address.country = country.substring(0, 50);
    
    if (isDefaultBilling !== undefined) address.isDefaultBilling = isDefaultBilling;
    if (isDefaultShipping !== undefined) address.isDefaultShipping = isDefaultShipping;

    await user.save();

    return NextResponse.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE address
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const addressId = url.searchParams.get('id');

    if (!addressId) return NextResponse.json({ error: 'Address ID required' }, { status: 400 });

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.addresses.pull({ _id: addressId });
    await user.save();

    return NextResponse.json({ success: true, addresses: user.addresses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
