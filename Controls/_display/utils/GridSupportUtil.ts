/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { detection } from 'Env/Env';

const FULL_GRID_IOS_VERSION = 12;
const FULL_GRID_MAC_SAFARI_VERSION = 13;

function _isFullGridSafari(): boolean {
    return (
        detection.safari &&
        (detection.IOSVersion >= FULL_GRID_IOS_VERSION ||
            (detection.isMacOSDesktop && detection.safariVersion >= FULL_GRID_MAC_SAFARI_VERSION))
    );
}

export default function isFullGridSupport(): boolean {
    return (
        (!detection.isWinXP || detection.yandex) &&
        (!detection.isNotFullGridSupport || _isFullGridSafari())
    );
}
