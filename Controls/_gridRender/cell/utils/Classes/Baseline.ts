/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TFontSize, TVerticalAlign } from 'Controls/interface';

/**
 * Утилита, предоставляющая CSS классы для выравнивания содержимого по базовой линии
 * @private
 */
export function getBaselineClasses(
    valign?: TVerticalAlign,
    minHeight?: string,
    baseline?: Exclude<TFontSize, 'inherit'> | 'default'
) {
    if (valign !== 'baseline') {
        return '';
    }

    let baselineClasses = ' controls-GridReact__cell-baseline';

    if (minHeight !== 'null') {
        baselineClasses += ` controls-GridReact__cell-baseline_${baseline}`;
    }

    return baselineClasses;
}
