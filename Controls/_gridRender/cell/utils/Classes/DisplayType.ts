import { TDisplayType } from 'Controls/_gridRender/cell/interface/ICell';

const AVAILABLE_DISPLAY_TYPES: TDisplayType[] = [
    'block',
    'inline-block',
    'flex',
    'inline-flex',
    'contents',
    'hidden',
];

export function getDisplayTypeClasses(displayType?: TDisplayType) {
    if (displayType && AVAILABLE_DISPLAY_TYPES.indexOf(displayType) !== -1) {
        return ` tw-${displayType}`;
    }
    return ' tw-flex';
}
