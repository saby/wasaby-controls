/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TDisplayType } from 'Controls/_gridRender/cell/interface/ICell';

const AVAILABLE_DISPLAY_TYPES: TDisplayType[] = [
    'block',
    'inline-block',
    'flex',
    'inline-flex',
    'contents',
    'hidden',
];

/**
 * Утилита, предоставляющая CSS классы для указания типа отображения HTML-блока
 * @private
 */
export function getDisplayTypeClasses(displayType?: TDisplayType) {
    if (displayType && AVAILABLE_DISPLAY_TYPES.indexOf(displayType) !== -1) {
        return ` tw-${displayType}`;
    }
    return ' tw-flex';
}
