exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': [
                'sessionToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
                'userId=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
                'username=; Path=/; Secure; SameSite=Strict; Max-Age=0',
                'captcha=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
            ].join(', ')
        },
        body: JSON.stringify({
            success: true,
            message: 'Muvaffaqiyatli chiqdingiz'
        })
    };
};
