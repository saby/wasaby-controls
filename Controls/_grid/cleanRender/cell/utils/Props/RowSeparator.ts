import { TRowSeparatorSize, TRowSeparatorStyle } from 'Controls/_grid/dirtyRender/cell/interface';
import { GridCell, GridRow } from 'Controls/gridDisplay';

export interface IRowSeparators {
    topSeparatorSize: TRowSeparatorSize;
    topSeparatorStyle: TRowSeparatorStyle;
    bottomSeparatorSize: TRowSeparatorSize;
    bottomSeparatorStyle: TRowSeparatorStyle;
}

interface IGetRowSeparatorsProps {
    cell: GridCell;
    row: GridRow;
}

/**
 * Утилита, позволяющая рассчитать видимость разделителей между записями "по-старому".
 * Реакт подход, при котором разделитель по умолчанию добавляется снизу, а не сверху
 * нельзя применять, тк он ломает всю базовую линию.
 * Утилита отрабатывает независимо от того, что было рассчитано в Cell.getCellComponentProps()
 * Логика добавления разделителей зависит от опции списка rowSeparatorVisibility
 * * items разделители видны только между записями, после header/top-results и перед footer/bottom-results.
 *   Вокруг списка разделителей нет. Та же логика используется, если на список повесли опцию newDesign.
 * * edges разделители видны только вокруг списка, после header/top-results и перед footer/bottom-results. Между записями разделителей нет.
 * * all разделители видны и между записями и вокруг списка.
 * @param props
 */
export function getRowSeparators(props: IGetRowSeparatorsProps): IRowSeparators {
    const { cell, row } = props;

    const rowSeparators: IRowSeparators = {
        topSeparatorSize: 'null',
        topSeparatorStyle: '',
        bottomSeparatorSize: 'null',
        bottomSeparatorStyle: '',
    };

    const rowSeparatorSize = (cell.getRowSeparatorSize() || 'null') as TRowSeparatorSize;

    if (rowSeparatorSize !== 'null') {
        // Всегда добавляем разделитель сверху, если он есть
        rowSeparators.topSeparatorSize = row.isTopSeparatorEnabled() ? rowSeparatorSize : 'null';

        // Сверху у самой первой записи делаем разделитель ярче
        if (row.isFirstItem() && rowSeparators.topSeparatorSize !== 'null') {
            rowSeparators.topSeparatorStyle = 'bold';
        }

        // Снизу добавляем яркий разделитель, только если нужно
        if (row.isLastItem() && row.isBottomSeparatorEnabled()) {
            rowSeparators.bottomSeparatorSize = rowSeparatorSize;
            rowSeparators.bottomSeparatorStyle = 'bold';
        }
    }

    return rowSeparators;
}
