import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Broadcast from '@/models/Broadcast';
import { sendEmail, isSmtpConfigured } from '@/lib/nodemailer';

export async function GET() {
  try {
    await connectToDatabase();

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAllUsers = await User.countDocuments();
    const subscribedUsers = await User.countDocuments({ newsletterSubscribed: true });
    
    const broadcasts = await Broadcast.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalAllUsers || totalUsers,
        subscribedUsers,
        totalBroadcasts: broadcasts.length
      },
      broadcasts,
      isSmtpConfigured: isSmtpConfigured()
    });
  } catch (error: any) {
    console.error('Error fetching broadcast data:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch broadcast data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { subject, title, discountCode, message, targetAudience = 'all' } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email subject is required' },
        { status: 400 }
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Offer title is required' },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Offer details message is required' },
        { status: 400 }
      );
    }

    // Build filter based on target audience
    const filter: any = {};
    if (targetAudience === 'subscribers_only') {
      filter.newsletterSubscribed = true;
    }

    const users = await User.find(filter, 'email name').lean();
    const recipientEmails = Array.from(
      new Set(users.map((u: any) => u.email).filter(Boolean))
    );

    if (recipientEmails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No registered users found matching the selected audience criteria.' },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // HTML Email Template
    const htmlEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
          .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
          .header { background-color: #000000; color: #ffffff; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; tracking: 1px; letter-spacing: 1px; text-transform: uppercase; }
          .content { padding: 35px 30px; text-color: #18181b; }
          .title { font-size: 22px; font-weight: 700; color: #000000; margin-top: 0; margin-bottom: 15px; }
          .message-body { font-size: 15px; line-height: 1.6; color: #3f3f46; margin-bottom: 25px; white-space: pre-line; }
          .coupon-box { background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 8px; padding: 18px; text-align: center; margin: 25px 0; }
          .coupon-label { font-size: 12px; text-transform: uppercase; color: #15803d; font-weight: 700; letter-spacing: 1px; margin-bottom: 5px; }
          .coupon-code { font-size: 26px; font-weight: 800; color: #166534; letter-spacing: 2px; }
          .cta-btn { display: inline-block; background-color: #000000; color: #ffffff !important; padding: 14px 32px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; text-align: center; margin-top: 10px; }
          .footer { background: #fafafa; border-top: 1px solid #f4f4f5; padding: 20px; text-align: center; font-size: 12px; color: #71717a; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>GOLF STORE EXCLUSIVE OFFER</h1>
          </div>
          <div class="content">
            <div class="title">${title}</div>
            <div class="message-body">${message}</div>

            ${discountCode ? `
              <div class="coupon-box">
                <div class="coupon-label">Special Promo Code</div>
                <div class="coupon-code">${discountCode.toUpperCase()}</div>
              </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <a href="${baseUrl}/products" class="cta-btn">Shop Special Offers Now</a>
            </div>
          </div>
          <div class="footer">
            <p>You received this email because you are a valued member of Golf Store.</p>
            <p>© ${new Date().getFullYear()} Golf Store. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using nodemailer wrapper
    await sendEmail({
      to: recipientEmails,
      subject: subject.trim(),
      html: htmlEmailContent
    });

    // Save broadcast record in MongoDB
    const newBroadcast = await Broadcast.create({
      subject: subject.trim(),
      title: title.trim(),
      discountCode: (discountCode || '').trim(),
      message: message.trim(),
      targetAudience,
      recipientCount: recipientEmails.length,
      recipientEmails,
      status: 'sent',
      sentBy: 'Admin'
    });

    return NextResponse.json({
      success: true,
      message: `Broadcast offer successfully sent to ${recipientEmails.length} user(s)!`,
      recipientCount: recipientEmails.length,
      broadcast: newBroadcast
    });
  } catch (error: any) {
    console.error('Error sending broadcast email offer:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send broadcast offer' },
      { status: 500 }
    );
  }
}
