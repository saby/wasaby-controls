/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { THorizontalAlign, TVerticalAlign } from 'Controls/interface';

/**
 * Утилита, предоставляющая CSS классы горизонтального размещения текста
 * @private
 */
export function getAlignClasses(align?: THorizontalAlign) {
    const valueMap = {
        right: 'end',
        left: 'start',
        center: 'center',
    };
    return align && valueMap[align]
        ? ` tw-justify-${valueMap[align]} tw-text-${valueMap[align]}`
        : '';
}

/**
 * Утилита, предоставляющая CSS классы вертикального размещения текста
 * @private
 */
export function getVAlignClasses(valign?: TVerticalAlign) {
    const valueMap = {
        start: 'start',
        end: 'end',
        top: 'start',
        bottom: 'end',
        center: 'center',
        baseline: 'baseline',
    };
    return valign && valueMap[valign] ? ` tw-items-${valueMap[valign]}` : '';
}
