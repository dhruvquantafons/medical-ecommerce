import { site } from "@/config/site";

export function getPartnerInquiryAdminEmail({
  name,
  email,
  pharmacyName,
  message,
}: {
  name: string;
  email: string;
  pharmacyName: string;
  message?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; padding: 24px; color: #ffffff; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .badge { display: inline-block; background: #06b6d4; color: #082f49; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px; }
    .content { padding: 24px; }
    .row { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
    .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .message-box { background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 16px; margin-top: 8px; font-size: 14px; line-height: 1.6; color: #334155; }
    .footer { padding: 16px 24px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">New Partner Lead</div>
      <h2>${site.name} — Pharmacy Digitization Request</h2>
    </div>
    <div class="content">
      <div class="row">
        <div class="label">Contact Name</div>
        <div class="value">${name}</div>
      </div>
      <div class="row">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></div>
      </div>
      <div class="row">
        <div class="label">Pharmacy / Brand</div>
        <div class="value">${pharmacyName}</div>
      </div>
      ${
        message
          ? `<div class="row" style="border-bottom: none;">
              <div class="label">Integration Requirements / Message</div>
              <div class="message-box">${message.replace(/\n/g, "<br/>")}</div>
            </div>`
          : ""
      }
    </div>
    <div class="footer">
      Automated inquiry notification from ${site.name} Connect & Partner Portal.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getPartnerInquiryUserConfirmationEmail({ name }: { name: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; padding: 28px 24px; text-align: center; color: #ffffff; }
    .content { padding: 32px 24px; font-size: 15px; line-height: 1.6; color: #334155; }
    .footer { padding: 16px 24px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
    .btn { display: inline-block; background: #0284c7; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 22px;">Inquiry Received</h2>
      <p style="margin: 6px 0 0; color: #94a3b8; font-size: 14px;">${site.name} Digital Pharmacy Architecture</p>
    </div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for reaching out to partner with <strong>${site.name}</strong>. We have received your inquiry and our pharmaceutical integration team is reviewing your requirements.</p>
      <p>A specialist will reach out to you within 24 business hours to discuss digitizing your medicine inventory and API catalog integration.</p>
      <p>Best regards,<br/><strong>${site.name} Team</strong></p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} ${site.name}. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getPasswordResetEmail({ url, userEmail }: { url: string; userEmail: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; padding: 24px; text-align: center; color: #ffffff; }
    .content { padding: 32px 24px; font-size: 15px; line-height: 1.6; color: #334155; }
    .btn-container { text-align: center; margin: 28px 0; }
    .btn { display: inline-block; background: #0284c7; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; }
    .footer { padding: 16px 24px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
    .subtext { font-size: 12px; color: #64748b; margin-top: 20px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px;">Password Reset Request</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset the password for your account associated with <strong>${userEmail}</strong>.</p>
      <div class="btn-container">
        <a href="${url}" class="btn">Reset Password</a>
      </div>
      <p>If you didn't request this change, you can safely ignore this email.</p>
      <p class="subtext">If the button above does not work, copy and paste this URL into your browser:<br/><a href="${url}">${url}</a></p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} ${site.name}. All rights reserved.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getOrderConfirmationCustomerEmail({
  orderId,
  customerName,
  items,
  total,
  paymentMethod,
  address,
}: {
  orderId: string;
  customerName: string;
  items: Array<{ name: string; qty: number; price: number }>;
  total: number;
  paymentMethod: string;
  address: { name: string; line1: string; line2?: string; city: string; state: string; pincode: string; phone?: string };
}) {
  const itemRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 0; font-size: 14px; color: #1e293b;">
          <strong>${item.name}</strong> × ${item.qty}
        </td>
        <td style="padding: 12px 0; text-align: right; font-size: 14px; font-weight: 600; color: #0f172a;">
          ₹${item.price.toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; padding: 28px 24px; text-align: center; color: #ffffff; }
    .content { padding: 32px 24px; }
    .order-badge { display: inline-block; background: #10b981; color: #ffffff; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 8px; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .total-row { font-size: 16px; font-weight: 700; color: #0f172a; border-top: 2px solid #e2e8f0; }
    .address-box { background: #f8fafc; border-radius: 8px; padding: 14px; border: 1px solid #e2e8f0; font-size: 13px; line-height: 1.5; color: #475569; margin-top: 16px; }
    .footer { padding: 16px 24px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="order-badge">Order Confirmed</div>
      <h2 style="margin: 0; font-size: 22px;">Thank You For Your Order!</h2>
      <p style="margin: 6px 0 0; color: #94a3b8; font-size: 14px;">Order #${orderId}</p>
    </div>
    <div class="content">
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>We've received your order and our pharmacy fulfillment team is preparing it for shipment.</p>
      
      <table class="table">
        <thead>
          <tr style="text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">
            <th style="padding-bottom: 8px;">Medicine / Item</th>
            <th style="padding-bottom: 8px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr class="total-row">
            <td style="padding: 14px 0;">Total Paid (${paymentMethod})</td>
            <td style="padding: 14px 0; text-align: right;">₹${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="address-box">
        <strong>Delivery Address:</strong><br/>
        ${address.name}<br/>
        ${address.line1}${address.line2 ? `, ${address.line2}` : ""}<br/>
        ${address.city}, ${address.state} - ${address.pincode}
      </div>
    </div>
    <div class="footer">
      Questions about your prescription or order? Reply to this email or contact us at ${site.supportEmail}.<br/>
      © ${new Date().getFullYear()} ${site.name}.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getOrderNotificationAdminEmail({
  orderId,
  customerName,
  customerEmail,
  itemCount,
  total,
  paymentMethod,
  address,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  total: number;
  paymentMethod: string;
  address: { name: string; line1: string; line2?: string; city: string; state: string; pincode: string; phone?: string };
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; padding: 20px 24px; color: #ffffff; }
    .content { padding: 24px; font-size: 14px; line-height: 1.6; }
    .row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
    .label { color: #64748b; font-weight: 600; }
    .val { color: #0f172a; font-weight: 700; }
    .footer { padding: 14px 24px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h3 style="margin: 0; font-size: 18px;">🛒 New Order Received: #${orderId}</h3>
    </div>
    <div class="content">
      <p style="margin-top: 0;">A new order has been placed on <strong>${site.name}</strong>.</p>
      
      <div style="margin: 16px 0;">
        <div class="row"><span class="label">Customer:</span><span class="val">${customerName} (${customerEmail})</span></div>
        <div class="row"><span class="label">Items:</span><span class="val">${itemCount} items</span></div>
        <div class="row"><span class="label">Total Amount:</span><span class="val">₹${total.toFixed(2)}</span></div>
        <div class="row"><span class="label">Payment Method:</span><span class="val">${paymentMethod}</span></div>
        <div class="row"><span class="label">Destination Pincode:</span><span class="val">${address.pincode} (${address.city})</span></div>
      </div>
      <p style="margin-bottom: 0;">Please review the order in the Admin Dashboard to approve prescriptions and arrange Shiprocket dispatch.</p>
    </div>
    <div class="footer">
      Automated Store Order Notification &bull; ${site.name}
    </div>
  </div>
</body>
</html>
  `.trim();
}

