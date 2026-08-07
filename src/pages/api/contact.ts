import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, service, message, _hp } = body;

    // Honeypot spam check
    if (_hp) {
      return new Response(JSON.stringify({ success: true, message: 'Message Received!' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ success: false, error: 'Name, email, and message are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Resolution of Cloudflare Worker bindings in Astro
    const cfEnv: any = env || (globalThis as any).__env__ || (process as any).env || {};
    const db = cfEnv.DB;
    const emailBinding = cfEnv.EMAIL;

    const timestamp = new Date().toISOString();
    const submissionId = 'sub_' + Math.random().toString(36).substring(2, 11);

    // Save to D1 database if DB binding exists
    if (db) {
      try {
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS contact_submissions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            service TEXT,
            message TEXT NOT NULL,
            created_at TEXT NOT NULL
          )
        `).run();

        await db.prepare(`
          INSERT INTO contact_submissions (id, name, email, service, message, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(submissionId, name, email, service || 'General', message, timestamp).run();
      } catch (dbErr) {
        console.error('Error saving contact submission to D1:', dbErr);
      }
    }

    // Send email notification via Cloudflare Email Proxy Webhook or Direct Email Binding
    const notificationRecipients = ['hiya@bethjordanproductions.com', 'hello@bethjordanproductions.com'];
    const emailText = `New Contact Form Submission:

Name: ${name}
Email: ${email}
Service Needed: ${service || 'Not specified'}
Submitted At: ${timestamp}

Message:
${message}
`;

    const emailProxyUrl = cfEnv.EMAIL_PROXY_URL || 'https://email-proxy.bethjordanproductions.workers.dev';
    const emailProxySecret = cfEnv.EMAIL_PROXY_SECRET || 'bjp_secret_email_proxy_2026_key';

    let emailSent = false;

    // 1. Try sending via Cloudflare Email Proxy Webhook (Cross-Account solution)
    if (emailProxyUrl) {
      try {
        const proxyResp = await fetch(emailProxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${emailProxySecret}`,
          },
          body: JSON.stringify({
            from: 'hiya@bethjordanproductions.com',
            to: notificationRecipients,
            subject: `New Contact Inquiry from ${name}`,
            text: emailText,
          }),
        });

        if (proxyResp.ok) {
          console.log('Successfully dispatched email via Cloudflare Email Proxy Webhook');
          emailSent = true;
        } else {
          console.error('Email proxy responded with error status:', proxyResp.status, await proxyResp.text());
        }
      } catch (proxyErr) {
        console.error('Failed calling email proxy webhook:', proxyErr);
      }
    }

    // 2. Fallback to direct email binding if available and proxy didn't succeed
    if (!emailSent && emailBinding && typeof emailBinding.send === 'function') {
      for (const toRecipient of notificationRecipients) {
        try {
          await emailBinding.send({
            from: 'hiya@bethjordanproductions.com',
            to: toRecipient,
            subject: `New Contact Inquiry from ${name}`,
            text: emailText,
          });
          console.log(`Successfully sent email notification directly to ${toRecipient}`);
        } catch (emailErr) {
          console.error(`Failed sending direct email to ${toRecipient}:`, emailErr);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Message Received!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Contact form API error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Server error processing request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
