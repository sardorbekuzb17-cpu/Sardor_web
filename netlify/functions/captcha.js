exports.handler = async (event, context) => {
    // CAPTCHA yaratish
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Session cookie orqali CAPTCHA saqlash
    const sessionId = Date.now().toString(36) + Math.random().toString(36);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `captcha=${captcha}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=300`,
            'Set-Cookie': `sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`
        },
        body: JSON.stringify({ captcha })
    };
};
