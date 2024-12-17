import { THorizontalAlign, TVerticalAlign } from 'Controls/interface';

export function getAlignClasses(align: THorizontalAlign) {
    if (align === 'right') {
        return ' tw-justify-end tw-text-end';
    }

    if (align === 'center') {
        return ' tw-justify-center tw-text-center';
    }

    if (align === 'left') {
        return ' tw-justify-start tw-text-start';
    }

    return '';
}

export function getVAlignClasses(valign: TVerticalAlign) {
    if (valign === 'start' || valign === 'top') {
        return ' tw-items-start';
    }

    if (valign === 'end' || valign === 'bottom') {
        return ' tw-items-end';
    }

    if (valign === 'baseline') {
        return ' tw-items-baseline';
    }

    if (valign === 'center') {
        return ' tw-items-center';
    }

    return '';
}
