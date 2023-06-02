/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { IPositionOrientation, POSITION } from './Utils';
import { IOrientation, StickyPosition } from 'Controls/_stickyBlock/types';

export function getDecomposedPosition(
    headerPosition: Record<keyof IPositionOrientation, string> | IOrientation
): StickyPosition[] | POSITION[] {
    const positions = [];
    switch (headerPosition.vertical) {
        case 'top':
        case 'bottom':
            positions.push(headerPosition.vertical);
            break;
        case 'topBottom':
            positions.push('top');
            positions.push('bottom');
            break;
    }

    switch (headerPosition.horizontal) {
        case 'left':
        case 'right':
            positions.push(headerPosition.horizontal);
            break;
        case 'leftRight':
            positions.push('left');
            positions.push('right');
            break;
    }
    return positions;
}

export function getDecomposedPositionFromString(
    headerPosition: string
): POSITION[] | StickyPosition[] {
    const positions = [];

    for (const fPosition of [
        POSITION.left,
        POSITION.right,
        POSITION.top,
        POSITION.bottom,
    ]) {
        if (headerPosition.toLowerCase().indexOf(fPosition) !== -1) {
            positions.push(fPosition);
        }
    }
    return positions;
}
