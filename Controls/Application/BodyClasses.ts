import { detection, constants } from 'Env/Env';

const classMap: Record<string, string> = {
    isIE: 'ws-is-ie',
    isIE10: 'ws-is-ie10',
    isRealIE10: 'ws-is-real-ie10',
    isIE11: 'ws-is-ie11',
    isIE12: 'ws-is-ie12',
    firefox: 'ws-is-firefox',
    opera: 'ws-is-opera',
    chrome: 'ws-is-chrome',
    isNotFullGridSupport: 'ws-is-not-full-grid-support',
    safari11: 'ws-is-safari11',
    isMobileAndroid: 'ws-is-mobile-android',
    isMobileSafari: 'ws-is-mobile-safari',
    isOldWebKit: 'ws-is-old-webkit',
    isWin10: 'ws-is-windows-10',
    isWin8: 'ws-is-windows-8',
    isWin7: 'ws-is-windows-7',
    isWinVista: 'ws-is-windows-vista',
    isWinXP: 'ws-is-windows-xp',
    isUnix: 'ws-is-unix',
    isMac: 'ws-is-mac',
    isDesktop: 'ws-is-sbis-desktop',
};

export default function bodyClasses(): string[] {
    const classes: string[] = [];

    // Map the list of detection properties to corresponding classes
    for (const prop in classMap) {
        // @ts-ignore
        if (detection[prop]) {
            classes.push(classMap[prop]);
        }
    }

    // Manually add different combinations of detection properties
    // to the list of classes
    if (detection.chrome && detection.isMobileIOS) {
        classes.push('ws-is-mobile-chrome-ios');
    }
    if (detection.isMobileSafari) {
        if ((detection.IOSVersion || 0) < 8) {
            classes.push('ws-is-mobile-safari-ios-below-8');
        }
    }

    classes.push(detection.isMobilePlatform ? 'ws-is-mobile-platform' : 'ws-is-desktop-platform');

    if (detection.isPhone) {
        classes.push('ws-is-phone');
    }

    if (detection.isMacOSDesktop && detection.safari) {
        classes.push('ws-is-desktop-safari');
    }

    if (detection.isWinXP && detection.chrome) {
        classes.push('ws-is-chrome-xp');
    }

    if (
        ((detection.isWin7 || detection.isWinVista || detection.isWinXP) && !detection.firefox) ||
        (detection.isUnix && !detection.isMobilePlatform) ||
        (detection.isWin10 && detection.isIE && !detection.isIE12)
    ) {
        classes.push('ws-fix-emoji');
    }

    if (detection.webkit && !constants.isServerSide) {
        // On the server Chrome is detected as webkit, because it has 'AppleWebKit' in its
        // user agent. We can't check if the browser is Chrome on the server, because a lot
        // of other browsers have 'Chrome' in their user agent string. Only add 'ws-is-webkit'
        // class on the client-side, where we can be sure that it is not Chrome
        classes.push('ws-is-webkit');
    }

    classes.push('zIndex-context');

    return classes;
}
