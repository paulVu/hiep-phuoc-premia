// Cloudflare Worker — Lead Form Backend
// Deploy: wrangler deploy (or paste into Cloudflare Workers dashboard)
// Set secrets: wrangler secret put TG_BOT_TOKEN / TG_CHAT_ID / TG_TOPIC_ID

export default {
  async fetch(request, env) {
    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();
      const { name, phone, email, interest } = data;

      if (!name || !phone) {
        return new Response(JSON.stringify({ error: 'Name and phone required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      const interestMap = {
        'an-cu': '🏠 An cư',
        'dau-tu': '📈 Đầu tư',
        'kinh-doanh': '🏪 Shophouse',
        'tim-hieu': '🔍 Tìm hiểu',
      };

      const msg = `🔔 *LEAD MỚI — Hiệp Phước Premia*\n\n👤 Họ tên: ${name}\n📞 SĐT: \`${phone}\`\n📧 Email: ${email || 'N/A'}\n🎯 Quan tâm: ${interestMap[interest] || '❓ Chưa chọn'}\n⏰ ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Saigon' })}\n🌐 Landing Page`;

      // Send to Telegram group topic
      const tgRes = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TG_CHAT_ID,
          message_thread_id: parseInt(env.TG_TOPIC_ID),
          text: msg,
          parse_mode: 'Markdown'
        })
      });

      const tgData = await tgRes.json();

      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};
