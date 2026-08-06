import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
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

    // Dynamically resolution of Cloudflare Worker bindings
    let db: any = null;
    let emailBinding: any = null;

    try {
      const cfEnv = (globalThis as any).__env__ || (process as any).env;
      db = cfEnv?.DB;
      emailBinding = cfEnv?.EMAIL;
    } catch {}

    if (!db && (locals as any)?.DB) {
      db = (locals as any).DB;
    }

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

    // Send email notification via Cloudflare Email Routing if available
    const notificationRecipients = ['hello@bethjordanproductions.com', 'jasonperkins77@gmail.com'];
    
    if (emailBinding && typeof emailBinding.send === 'function') {
      const emailText = `New Contact Form Submission:

Name: ${name}
Email: ${email}
Service Needed: ${service || 'Not specified'}
Submitted At: ${timestamp}

Message:
${message}
`;

      for (const toRecipient of notificationRecipients) {
        try {
          await emailBinding.send({
            from: 'hello@bethjordanproductions.com',
            to: toRecipient,
            subject: `New Contact Inquiry from ${name}`,
            text: emailText,
          });
        } catch (emailErr) {
          console.error(`Failed sending email to ${toRecipient}:`, emailErr);
        }
      }
    } else {
      console.log(`[CONTACT FORM SUBMISSION] From: ${name} <${email}> | Service: ${service} | Message: ${message}`);
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
