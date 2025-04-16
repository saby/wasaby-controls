import { TColumnWidth } from 'Controls/_gridRender/cell/interface/IColumnConfig';
import { TCellType } from 'Controls/_gridRender/cell/interface/ICell';
import { isOldBrowser } from 'Controls/_gridRender/utils/isOldBrowser';

// В IE, если не задана ширина у колонки и эта колонка не чекбокс, нужно растянуть ячейку
export function getIECellClasses(width?: TColumnWidth, cellType?: TCellType): string {
    return isOldBrowser && !width && cellType !== 'checkbox'
        ? ' controls-GridReact-IE-cell-without-width '
        : '';
}
