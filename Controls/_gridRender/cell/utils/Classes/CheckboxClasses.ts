import { IDecorationStyleProps } from 'Controls/_gridRender/interface/CommonInterface';
import { ICellTypeProps } from 'Controls/_gridRender/cell/interface/ICell';
import { clsx } from 'clsx';

export function getCheckboxClasses(
    cellType: ICellTypeProps['cellType'],
    decorationStyle: IDecorationStyleProps['decorationStyle'],
    className?: string
) {
    return cellType === 'checkbox'
        ? ' ' + clsx([`controls-Grid__row-cell-checkbox-${decorationStyle}`, className])
        : '';
}
