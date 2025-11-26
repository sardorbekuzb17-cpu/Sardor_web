exports.handler = async (event, context) => {
    // CAPTCHA yaratish - raqamlar ko'proq
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Session cookie orqali CAPTCHA saqlash
    const sessionId = Date.now().toString(36) + Math.random().toString(36);

    console.log('CAPTCHA yaratildi:', captcha);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `captcha=${captcha}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=300; sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1800`
        },
        body: JSON.stringify({ captcha })
    };
};
