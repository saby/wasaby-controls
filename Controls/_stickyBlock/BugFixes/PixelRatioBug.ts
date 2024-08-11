/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { detection } from 'Env/Env';

const DESKTOP_PIXEL_RATIOS_BUG = [0.75, 0.9, 1.25, 1.75];

function _getDevicePixelRatio(): number {
    return window ? Math.round(window.devicePixelRatio * 1e2) / 1e2 : 1;
}

export function isPixelRatioBugPossible(): boolean {
    let result = false;
    if (detection.isMobilePlatform) {
        if (!detection.isMobileAndroid) {
            result = true;
        }
    } else {
        // Щель над прилипающим заголовком появляется на десктопах на масштабе 75%, 125% и 175%
        if (DESKTOP_PIXEL_RATIOS_BUG.indexOf(_getDevicePixelRatio()) !== -1) {
            result = true;
        }
    }
    return result;
}

/**
 * Над StickyBlock может лежать контент, у которого рисуется border-bottom. В таком случае, border будут
 * перекрыты box-shadow. Вводим возможность отключить box-shadow через навешивание класса.
 * Этот способ отключения будет описан в статье отладке скролла и стикиблоков:
 * https://wi.sbis.ru/doc/platform/developmentapl/interface-development/debug/scroll-container/ после
 * https://online.sbis.ru/opendoc.html?guid=9e7f5914-3b96-4799-9e1d-9390944b4ab3
 *
 * @param backgroundStyle
 */
export function getPixelRatioBugFixClass(backgroundStyle: string = 'default'): string {
    let result = '';

    if (isPixelRatioBugPossible()) {
        result = `controls-StickyBlock__topGapFix-${backgroundStyle}`;
    }
    return result;
}

export function updatePixelRatioBugFixClass(
    instance: { _pixelRatioBugFixClass: string },
    backgroundStyle: string = 'default',
    pixelRatioBugFix: boolean = true
): void {
    if (pixelRatioBugFix) {
        const newClass = getPixelRatioBugFixClass(backgroundStyle);
        if (instance._pixelRatioBugFixClass !== newClass) {
            instance._pixelRatioBugFixClass = newClass;
        }
    }
}
