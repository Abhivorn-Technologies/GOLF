import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || (process.env.SMTP_USER ? `"LORVEN GOLF" <${process.env.SMTP_USER}>` : '"LORVEN GOLF" <info@lorvengolf.com>');

export const isSmtpConfigured = (): boolean => {
  return Boolean(host && user && pass);
};

export const getTransporter = () => {
  if (isSmtpConfigured()) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
};

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const transporter = getTransporter();

  if (transporter) {
    return await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]+>/g, '')
    });
  } else {
    // Development / fallback mode when SMTP env vars are not set
    console.log('----------------------------------------------------');
    console.log('[BROADCAST EMAIL SIMULATION (SMTP Not Configured)]');
    console.log(`From: ${from}`);
    console.log(`To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log('----------------------------------------------------');
    return { messageId: `simulated-${Date.now()}` };
  }
}
