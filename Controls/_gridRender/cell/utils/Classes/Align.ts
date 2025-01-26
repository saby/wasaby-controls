import { THorizontalAlign, TVerticalAlign } from 'Controls/interface';

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
