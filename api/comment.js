export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // コメント取得（GET）
    if (req.method === 'GET') {
        const { card_id } = req.query;
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/comments?card_id=eq.${card_id}&order=created_at.asc`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );
        const data = await response.json();
        return res.status(200).json(data);
    }

    // コメント投稿（POST）
    if (req.method === 'POST') {
        const { card_id, card_title, author, content } = req.body;

        if (!card_id || !author || !content) {
            return res.status(400).json({ error: '必須項目が不足しています' });
        }

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/comments`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ card_id, card_title, author, content })
            }
        );
        const data = await response.json();
        return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}