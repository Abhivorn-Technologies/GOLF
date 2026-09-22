import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    await dbConnect();

    const user = await User.findOne({ email: cleanEmail });

    // For security reasons, don't reveal if user doesn't exist, but return success
    if (!user) {
      return NextResponse.json({ 
        message: 'If an account exists with that email, a password reset link has been sent.',
        success: true 
      });
    }

    // Generate secure reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await User.updateOne(
      { email: cleanEmail },
      { 
        $set: { 
          resetPasswordToken: resetToken, 
          resetPasswordExpires: resetExpires 
        } 
      }
    );

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(cleanEmail)}`;

    console.log(`\n========================================`);
    console.log(`🔑 PASSWORD RESET REQUESTED FOR: ${cleanEmail}`);
    console.log(`🔗 RESET LINK: ${resetUrl}`);
    console.log(`========================================\n`);

    // If SMTP credentials are configured, send email via nodemailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"LORVEN GOLF" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: cleanEmail,
          subject: 'Reset Your LORVEN GOLF Password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; rounded: 12px;">
              <h2 style="color: #111; text-transform: uppercase; margin-bottom: 16px;">Password Reset Request</h2>
              <p style="color: #555; line-height: 1.6;">Hello ${user.name || 'Golfer'},</p>
              <p style="color: #555; line-height: 1.6;">You recently requested to reset your password for your LORVEN GOLF account. Click the button below to choose a new password. This link is valid for <strong>1 hour</strong>.</p>
              <div style="margin: 32px 0; text-align: center;">
                <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Reset Password</a>
              </div>
              <p style="color: #777; font-size: 13px; line-height: 1.5;">If you did not request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
              <p style="color: #999; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} LORVEN GOLF. All rights reserved.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to send reset email via SMTP:", emailErr);
      }
    }

    return NextResponse.json({ 
      message: 'If an account exists with that email, a password reset link has been sent.',
      success: true,
      // Include devResetUrl in non-production for instant development convenience
      devResetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });

  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: 'Failed to process request. Please try again.' }, { status: 500 });
  }
}
