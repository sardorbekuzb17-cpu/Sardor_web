// Real-time Visitor Tracking Script
(function () {
    'use strict';

    // Tashrif ma'lumotlarini to'plash
    function getVisitorInfo() {
        const ua = navigator.userAgent.toLowerCase();

        // Qurilma aniqlash
        let device = 'Desktop';
        let deviceIcon = '💻';
        if (/mobile|android|iphone|ipod/.test(ua)) {
            device = 'Mobile';
            deviceIcon = '📱';
        } else if (/ipad|tablet/.test(ua)) {
            device = 'Tablet';
            deviceIcon = '📱';
        }

        // Brauzer aniqlash
        let browser = 'Unknown';
        if (/chrome/.test(ua) && !/edge/.test(ua)) browser = 'Chrome';
        else if (/firefox/.test(ua)) browser = 'Firefox';
        else if (/safari/.test(ua) && !/chrome/.test(ua)) browser = 'Safari';
        else if (/edge/.test(ua)) browser = 'Edge';
        else if (/opera|opr/.test(ua)) browser = 'Opera';

        // OS aniqlash
        let os = 'Unknown';
        if (/windows/.test(ua)) os = 'Windows';
        else if (/mac/.test(ua)) os = 'MacOS';
        else if (/linux/.test(ua)) os = 'Linux';
        else if (/android/.test(ua)) os = 'Android';
        else if (/iphone|ipad|ipod/.test(ua)) os = 'iOS';

        return {
            device,
            deviceIcon,
            browser,
            os,
            page: window.location.pathname,
            referrer: document.referrer || 'Direct',
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            language: navigator.language,
            timestamp: new Date().toISOString()
        };
    }

    // Serverga yuborish
    async function trackVisit() {
        try {
            const visitorInfo = getVisitorInfo();

            const response = await fetch('/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(visitorInfo)
            });

            const data = await response.json();

            if (data.success) {
                console.log('✅ Tashrif qayd qilindi');

                // Session ID ni saqlash
                if (data.sessionId) {
                    sessionStorage.setItem('visitorSessionId', data.sessionId);
                }
            }
        } catch (error) {
            console.error('Tracking xatosi:', error);
        }
    }

    // Sahifa yuklanganda
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackVisit);
    } else {
        trackVisit();
    }

    // Sahifadan chiqishda
    window.addEventListener('beforeunload', function () {
        const sessionId = sessionStorage.getItem('visitorSessionId');
        if (sessionId) {
            navigator.sendBeacon('/api/track-exit', JSON.stringify({ sessionId }));
        }
    });

    // Har 30 soniyada "heartbeat" yuborish (online ekanligini bildirish)
    setInterval(() => {
        const sessionId = sessionStorage.getItem('visitorSessionId');
        if (sessionId) {
            fetch('/api/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            }).catch(() => { });
        }
    }, 30000);

})();
