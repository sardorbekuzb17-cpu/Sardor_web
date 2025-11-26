// Heartbeat - foydalanuvchi hali online ekanligini bildiradi
let visitors = [];

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false })
        };
    }

    try {
        const { sessionId } = JSON.parse(event.body);

        // Foydalanuvchini topish va lastSeen ni yangilash
        const visitor = visitors.find(v => v.id === sessionId);
        if (visitor) {
            visitor.lastSeen = new Date().toISOString();
            visitor.active = true;
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false })
        };
    }
};

exports.visitors = visitors;
