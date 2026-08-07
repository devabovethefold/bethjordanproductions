export default {
  async fetch(request, env) {
    // Standard CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Check authorization header
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${env.SECRET_TOKEN || 'bjp_secret_email_proxy_2026_key'}`;
    if (authHeader !== expectedAuth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    try {
      const payload = await request.json();
      const { from = 'hiya@bethjordanproductions.com', to, subject, text } = payload;

      if (!env.EMAIL || typeof env.EMAIL.send !== 'function') {
        return new Response(JSON.stringify({ error: 'EMAIL binding not configured on destination worker' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const recipients = Array.isArray(to) ? to : [to || 'jasonperkins77@gmail.com'];

      for (const recipient of recipients) {
        await env.EMAIL.send({
          from,
          to: recipient,
          subject: subject || 'New Website Contact Inquiry',
          text: text || '',
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'Email dispatched' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || 'Error processing email send' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};
