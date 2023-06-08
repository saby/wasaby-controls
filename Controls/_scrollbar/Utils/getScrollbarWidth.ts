/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { constants } from 'Env/Env';

const position: string = `position: absolute;
   width: 100px;
   height: 100px;
   overflow: scroll;
   top: -9999px;`;

export function getScrollbarWidth(detection): number {
    if (detection.webkit || detection.chrome) {
        return 0;
    } else if (detection.isIE12) {
        return detection.IEVersion < 17 ? 12 : 16;
    } else if (detection.isIE10 || detection.isIE11) {
        return 17;
    } else if (constants.isBrowserPlatform) {
        return getScrollbarWidthByMeasuredBlock();
    }
}

export function getScrollbarWidthByMeasuredBlock(): number {
    const measuredBlock: HTMLDivElement = document.createElement('div');
    measuredBlock.setAttribute('style', position);
    document.body.appendChild(measuredBlock);
    const scrollbarWidth =
        measuredBlock.offsetWidth - measuredBlock.clientWidth;
    document.body.removeChild(measuredBlock);

    return scrollbarWidth;
}
