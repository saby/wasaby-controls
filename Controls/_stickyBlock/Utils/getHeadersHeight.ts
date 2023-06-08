/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { goUpByControlTree } from 'UI/NodeCollector';
import { IControl } from 'UICommon/interfaces';
import { StickyPosition, TypeFixedBlocks } from 'Controls/_stickyBlock/types';

const STICKY_CONTROLLER_SELECTOR: string = '.controls-Scroll';
const STICKY_CONTROLLER_MODULE_NAME: string = 'Controls/scroll:Container';
const STICKY_CONTROLLER_HORIZONTAL_MODULE_NAME: string = 'Controls/_scroll/Container';

export function getHeadersHeight(
    element: HTMLElement,
    position: StickyPosition,
    type: TypeFixedBlocks = TypeFixedBlocks.InitialFixed
): number {
    const header = getHeader(element, STICKY_CONTROLLER_MODULE_NAME);
    if (!header) {
        return 0;
    }
    return header.getHeadersHeight(position, type);
}

export function getHeadersWidth(
    element: HTMLElement,
    position: StickyPosition,
    type: TypeFixedBlocks = TypeFixedBlocks.InitialFixed
): number {
    const header = getHeader(element, STICKY_CONTROLLER_HORIZONTAL_MODULE_NAME);
    if (!header) {
        return 0;
    }
    return header.getHeadersWidth(position, type);
}

function getHeader(element: HTMLElement, moduleName: string): IControl {
    const controlsElement: HTMLElement = element.closest(STICKY_CONTROLLER_SELECTOR);
    if (!controlsElement) {
        return null;
    }
    const controls = goUpByControlTree(controlsElement);
    return controls.find((control: IControl) => {
        return control._moduleName === moduleName;
    });
}
