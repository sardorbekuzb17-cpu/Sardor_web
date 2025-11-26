// Login loglarini saqlash (xotirada - production da database kerak)
const loginLogs = [];

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
        // Session tekshirish
        const sessionToken = getCookie(event.headers.cookie, 'sessionToken');
        const username = getCookie(event.headers.cookie, 'username');

        if (!sessionToken || !username) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    message: 'Avtorizatsiya talab qilinadi'
                })
            };
        }

        // Statistika hisoblash
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const stats = {
            total: loginLogs.length,
            today: loginLogs.filter(log => new Date(log.timestamp) >= todayStart).length,
            active: loginLogs.filter(log => log.active).length,
            devices: new Set(loginLogs.map(log => log.device)).size
        };

        // Loglarni qaytarish (oxirgi 50 ta)
        const recentLogs = loginLogs.slice(-50).reverse();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                stats: stats,
                logs: recentLogs
            })
        };

    } catch (error) {
        console.error('Logs xatosi:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Server xatosi'
            })
        };
    }
};
