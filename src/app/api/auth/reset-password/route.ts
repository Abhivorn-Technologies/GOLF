import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { validatePassword } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const { email, token, newPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Email, token, and new password are required.' }, { status: 400 });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.errorMessage }, { status: 400 });
    }

    await dbConnect();

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'Password reset link is invalid or has expired. Please request a new one.' 
      }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email: cleanEmail },
      { 
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 }
      }
    );

    console.log(`\n✅ Password successfully updated for: ${cleanEmail}\n`);

    return NextResponse.json({
      message: 'Password has been reset successfully! You can now sign in with your new password.',
      success: true
    });

  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: 'Failed to reset password. Please try again.' }, { status: 500 });
  }
}
