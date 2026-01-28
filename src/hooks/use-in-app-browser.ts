import { useEffect, useState } from 'react';

export function useInAppBrowser() {
    const [isInAppBrowser, setIsInAppBrowser] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;

        // Rules for finding in-app browsers:
        // Instagram, Messenger, Facebook app (FBAN/FBAV), Twitter, LinkedIn, TikTok, Snapchat, Line, Pinterest
        const rules = [
            /Instagram/i,
            /FBAN/i,
            /FBAV/i,
            /Twitter/i,
            /LinkedIn/i,
            /TikTok/i,
            /Musical_ly/i,
            /Snapchat/i,
            /Line/i,
            /Pinterest/i,
        ];

        const isMatch = rules.some((rule) => rule.test(userAgent));
        setIsInAppBrowser(isMatch);
    }, []);

    return isInAppBrowser;
}
