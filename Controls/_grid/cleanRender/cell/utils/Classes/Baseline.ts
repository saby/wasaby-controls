import { TFontSize, TVerticalAlign } from 'Controls/interface';

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
