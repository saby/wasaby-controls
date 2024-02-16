import { IColumn } from 'Controls/grid';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import { Model } from 'Types/entity';
import {
    MIN_COLUMN_WIDTH,
    MAX_COLUMN_WIDTH,
} from 'Controls-Lists-editors/_columnsEditor/constants';

interface IOnItemClickForReplaceParams {
    item: Model;
    onValueChange: Function;
    onClose: Function;
    allColumns: IColumn[];
}
export function getInitialColumnConfig(
    column: IColumn,
    allColumns: TColumnsForCtor,
    allHeaders: THeaderForCtor
): IColumn | undefined {
    let result = {};
    allColumns.map((initColumn, columnIndex) => {
        if (initColumn.displayProperty === column.displayProperty) {
            result = allHeaders.find((initHeader) => {
                return initHeader.startColumn - 1 === columnIndex;
            });
        }
    });
    return result;
}
export function onItemClickForReplace(props: IOnItemClickForReplaceParams) {
    const { item, onValueChange, onClose, allColumns } = props;
    onValueChange({
        caption: item.getRawData().caption,
        displayProperty: allColumns[item.getRawData().startColumn - 1].displayProperty,
    });
    onClose();
}

/**
 * Обрабатывает новое значение ширины на соответствие допустимым значениям
 * @param width
 */
export function validateColumnWidth(width: number): number {
    if (width < MIN_COLUMN_WIDTH) {
        return MIN_COLUMN_WIDTH;
    } else if (width > MAX_COLUMN_WIDTH) {
        return MAX_COLUMN_WIDTH;
    } else return width;
}
