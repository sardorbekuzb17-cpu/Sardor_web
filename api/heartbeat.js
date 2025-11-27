import clientPromise from './_mongodb.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false });
    }

    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID kerak' });
        }

        // MongoDB ga ulanish
        const client = await clientPromise;
        const db = client.db('loginSystem');
        const visitorsCollection = db.collection('visitors');

        // Session ni yangilash
        await visitorsCollection.updateOne(
            { sessionId: sessionId },
            {
                $set: {
                    lastSeen: new Date(),
                    active: true
                }
            }
        );

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Heartbeat xatosi:', error);
        return res.status(500).json({ success: false });
    }
}
