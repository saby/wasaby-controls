/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { StickyPosition } from 'Controls/_stickyBlock/types';
import { getOffset, isHidden } from 'Controls/_stickyBlock/Utils/Utils';
import { detection } from 'Env/Env';
import { getDimensions } from 'Controls/sizeUtils';

export function getGeneralParentNode(block0: HTMLElement, block1: HTMLElement): Node {
    const getGeneralParentNodeFunc = (container0, container1) => {
        let parentElementOfContainer0 = container0.parentElement;
        const parentElementOfContainer1 = container1.parentElement;
        while (
            parentElementOfContainer0 !== parentElementOfContainer1 &&
            parentElementOfContainer0 !== document.body
        ) {
            parentElementOfContainer0 = parentElementOfContainer0.parentElement;
        }

        if (parentElementOfContainer0 === document.body) {
            const group0 = container0.closest('.controls-StickyHeader__isolatedGroup');
            const group1 = container1.closest('.controls-StickyHeader__isolatedGroup');
            if (group0 !== null && group1 !== null && group0 === group1) {
                parentElementOfContainer0 = group0 as HTMLElement;
            }
        }
        return parentElementOfContainer0;
    };

    let parentElement = getGeneralParentNodeFunc(block0, block1);
    // Если общий родитель body, то пройдемся вверх по дереву от второго заголовка, может оказаться что заголовок1
    // лежит ниже заголовка0.
    if (parentElement === document.body) {
        parentElement = getGeneralParentNodeFunc(block1, block0);
    }
    return parentElement;
}

export function getOppositePosition(position: StickyPosition): StickyPosition {
    switch (position) {
        case StickyPosition.Top:
            return StickyPosition.Bottom;
        case StickyPosition.Bottom:
            return StickyPosition.Top;
        case StickyPosition.Left:
            return StickyPosition.Right;
        case StickyPosition.Right:
            return StickyPosition.Left;
    }
}

export function getStickyBlockHeight(stickyBlockContainer: HTMLElement): number {
    let height;
    if (!isHidden(stickyBlockContainer)) {
        const isGroup = getComputedStyle(stickyBlockContainer).display === 'contents';
        if (isGroup) {
            // Стики группа может быть в несколько строк. Сейчас единственный кейс только в графиках.
            const isMultilineGroup = stickyBlockContainer.closest(
                '.controls-StickyBlock-multilineGroup'
            );
            if (isMultilineGroup) {
                const firstStickyNode = stickyBlockContainer.children[0];
                const lastStickyNode =
                    stickyBlockContainer.children[stickyBlockContainer.childElementCount - 1];
                height =
                    lastStickyNode.getBoundingClientRect().bottom -
                    firstStickyNode.getBoundingClientRect().top;
            } else {
                height = stickyBlockContainer.children[0].clientHeight;
            }
        } else {
            height = getDimensions(stickyBlockContainer).height;
        }
        if (detection.isWin) {
            // offsetHeight округляет к ближайшему числу, из-за этого на масштабе просвечивают полупиксели.
            // Такое решение подходит только для Windows Desktop, т.к. на мобильных устройствах devicePixelRatio = 2.75,
            // на Mac devicePixelRatio = 2.
            height -= Math.abs(1 - getDevicePixelRatio());
        }
    }
    return height;
}

export function getStickyBlockIdFromNode(container: Element): string {
    return container.getAttribute('data-stickyBlockId');
}

export function getDevicePixelRatio(): number {
    if (window?.devicePixelRatio) {
        return window.devicePixelRatio;
    }
    return 1;
}

let _blocksPositions = {};
export function resetSticky(blocs: object): void {
    for (const id in blocs) {
        if (blocs.hasOwnProperty(id)) {
            if (getComputedStyle(blocs[id].stickyRef.current).display === 'contents') {
                _resetGroupSticky(blocs[id].stickyRef.current);
            } else {
                blocs[id].stickyRef.current.style.position = 'relative';
            }
            _resetPosition(id, blocs);
        }
    }
}

function _resetGroupSticky(groupContainer: HTMLElement): void {
    for (let i = 0; i < groupContainer.children.length; i++) {
        (groupContainer.children[i] as HTMLElement).style.position = 'relative';
    }
}

export function restoreSticky(blocs: object): void {
    const isStickyRestored = !Object.keys(_blocksPositions).length;
    if (isStickyRestored) {
        return;
    }

    for (const id in blocs) {
        if (blocs.hasOwnProperty(id)) {
            if (getComputedStyle(blocs[id].stickyRef.current).display === 'contents') {
                _restoreGroupSticky(blocs[id].stickyRef.current);
            } else {
                blocs[id].stickyRef.current.style.position = '';
            }
            _restorePosition(id, blocs);
        }
    }
    _blocksPositions = {};
}

function _restoreGroupSticky(groupContainer: HTMLElement): void {
    for (let i = 0; i < groupContainer.children.length; i++) {
        (groupContainer.children[i] as HTMLElement).style.position = '';
    }
}

function _resetPosition(id: string, blocs: object): void {
    _blocksPositions[id] = {};
    for (const position of [
        StickyPosition.Top,
        StickyPosition.Bottom,
        StickyPosition.Left,
        StickyPosition.Right,
    ]) {
        let positionValue;
        let element;
        if (getComputedStyle(blocs[id].stickyRef.current).display === 'contents') {
            element = blocs[id].stickyRef.current.children[0];
            positionValue = element.style[position];
        } else {
            element = blocs[id].stickyRef.current;
            positionValue = element.style[position];
        }
        _blocksPositions[id][position] = positionValue;
        element.style[position] = '';
    }
}

function _restorePosition(id: string, blocs: object): void {
    for (const position of [
        StickyPosition.Top,
        StickyPosition.Bottom,
        StickyPosition.Left,
        StickyPosition.Right,
    ]) {
        if (getComputedStyle(blocs[id].stickyRef.current).display === 'contents') {
            blocs[id].stickyRef.current.children[0].style[position] =
                _blocksPositions[id][position];
        } else {
            blocs[id].stickyRef.current.style[position] = _blocksPositions[id][position];
        }
    }
}

export function getOffsetByContainer(
    targetElement: HTMLElement,
    position: StickyPosition,
    parentContainer: HTMLElement,
    stickyFix?: boolean
): number {
    return getOffset(parentContainer, targetElement, position, stickyFix);
}
