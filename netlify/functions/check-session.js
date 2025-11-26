// Cookie dan ma'lumot olish
function getCookie(cookieString, name) {
    if (!cookieString) return null;
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return null;
}

exports.handler = async (event, context) => {
    try {
        const sessionToken = getCookie(event.headers.cookie, 'sessionToken');
        const userId = getCookie(event.headers.cookie, 'userId');
        const username = getCookie(event.headers.cookie, 'username');

        if (sessionToken && userId && username) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    authenticated: true,
                    user: {
                        id: userId,
                        username: username
                    }
                })
            };
        } else {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    authenticated: false
                })
            };
        }
    } catch (error) {
        console.error('Session xatosi:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Server xatosi'
            })
        };
    }
};
