import { IColumn } from 'Controls/grid';
import { TColumnsForCtor, THeaderForCtor } from 'Controls/grid';
import { Model } from 'Types/entity';
import {
    MIN_COLUMN_WIDTH,
    MIN_MAIN_COLUMN_WIDTH,
    MAX_COLUMN_WIDTH,
    DEFAULT_COLUMN_PARAMS,
    MAX_MAIN_COLUMN_WIDTH,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import { Logger } from 'UICommon/Utils';

interface IOnItemClickForReplaceParams {
    item: Model;
    onValueChange: Function;
    onClose: Function;
    allColumns: IColumn[];
}

export interface IColumnWidth {
    mode: 'fixed' | 'auto';
    amount?: number;
    units?: '%' | 'px';
    minLimit?: number;
    maxLimit?: number | string;
}
export interface IHandleResizingParams {
    columnHTMLWidth: number;
    columnTemplateWidth: string;
    offset: number;
    containerWidth?: number;
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
 * Обрабатывает новое значение ширины (в пикселях) на соответствие допустимым значениям
 * @param width
 * @param isMainColumn
 */
export function validateColumnWidth(width: IColumnWidth, isMainColumn?: boolean): IColumnWidth {
    const processedWidth = { ...width };
    if (width.units === 'px') {
        if (width.mode === 'fixed') {
            if (width.amount < MIN_COLUMN_WIDTH) {
                processedWidth.amount = MIN_COLUMN_WIDTH;
            } else if (width.amount > MAX_COLUMN_WIDTH) {
                processedWidth.amount = MAX_COLUMN_WIDTH;
            }
        } else {
            const minWidth = isMainColumn ? MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
            const maxWidth = isMainColumn ? MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_WIDTH;
            if ((isMainColumn && !processedWidth.minLimit) || processedWidth.minLimit < minWidth) {
                processedWidth.minLimit = minWidth;
            }
            if (isMainColumn && !processedWidth.maxLimit) {
                processedWidth.maxLimit = maxWidth;
            }
        }
    }
    return processedWidth;
}

// TODO написать unit тесты
/**
 * Функция парсит строку с шириной
 * @param width
 */
export function parseColumnWidth(width: string): IColumnWidth {
    const result: IColumnWidth = { mode: 'auto', units: 'px' };
    let isFixed: boolean = false;
    let units: 'px' | '%' = 'px';
    if (width.includes('minmax(')) {
        try {
            const minLimitStr = width.slice(
                width.indexOf('(') + 1,
                width.includes(',') ? width.indexOf(',') : width.indexOf(')')
            );
            units = 'px';
            if (!minLimitStr.includes(units)) {
                units = '%';
            }
            if (minLimitStr.includes(units)) {
                result.minLimit = Number(minLimitStr.slice(0, minLimitStr.indexOf(units)));
                result.units = units;
            } else {
                throw new Error(
                    'Формат минимальной ширины ожидается в формате: числовое значение + единица измерения в пикселях или процентах'
                );
            }
            if (width.includes(',')) {
                const maxLimitStr = width.slice(width.indexOf(',') + 1, width.indexOf(')'));
                units = 'px';
                if (!maxLimitStr.includes(units)) {
                    units = '%';
                }
                if (maxLimitStr.includes(units)) {
                    result.maxLimit = Number(maxLimitStr.slice(0, maxLimitStr.indexOf(units)));
                    if (units !== result.units) {
                        Logger.warn(
                            'Не совпадают единицы измерения границ, единица измерения максимальной границы будет задана как у минимальной'
                        );
                    }
                } else {
                    result.maxLimit = maxLimitStr;
                }
            }
        } catch (error) {
            Logger.error(`Некорректный формат ширины колонки ${error}`);
        }
    } else {
        let unitPosition = width.indexOf(units);
        if (unitPosition === -1) {
            units = '%';
            unitPosition = width.indexOf(units);
            if (unitPosition !== -1) {
                isFixed = true;
            }
        } else {
            isFixed = true;
        }
        if (isFixed) {
            result.amount = Number(width.slice(0, unitPosition));
            result.units = units;
            result.mode = 'fixed';
        }
    }
    return result;
}

export function buildNewWidth(newWidthConfig: IColumnWidth): string {
    const {
        mode = 'fixed',
        amount = DEFAULT_COLUMN_PARAMS.width,
        units = 'px',
        minLimit,
        maxLimit,
    } = newWidthConfig;
    if (mode === 'auto') {
        if (minLimit || maxLimit) {
            return `minmax(${minLimit ?? MIN_COLUMN_WIDTH}${units},${maxLimit ?? MAX_COLUMN_WIDTH}${
                typeof maxLimit !== 'string' ? units : ''
            })`;
        }
        return 'max-content';
    } else {
        return amount + units;
    }
}

export function resizeHandler(params: IHandleResizingParams): string {
    const { columnHTMLWidth, columnTemplateWidth, offset, containerWidth } = params;
    const newWidth = validateColumnWidth({
        mode: 'fixed',
        amount: Math.round(columnHTMLWidth + offset),
        units: 'px',
    });
    const templateWidth = parseColumnWidth(columnTemplateWidth);
    let result: IColumnWidth = { mode: 'fixed' };
    if (templateWidth.mode === 'fixed') {
        if (templateWidth.units === '%') {
            result.amount = Math.round((newWidth.amount / columnHTMLWidth) * templateWidth.amount);
            result.units = '%';
        } else {
            result = { ...newWidth };
        }
    } else {
        result.mode = 'auto';
        if (templateWidth.maxLimit || templateWidth.minLimit) {
            if (
                (newWidth.amount > Math.round(columnHTMLWidth) &&
                    Math.round(columnHTMLWidth) < templateWidth.maxLimit) ||
                (newWidth.amount < Math.round(columnHTMLWidth) &&
                    newWidth.amount < templateWidth.minLimit)
            ) {
                result = { ...newWidth };
            } else {
                result.maxLimit = newWidth.amount;
                result.minLimit = templateWidth.minLimit;
            }
        } else {
            if (newWidth.amount >= Math.round(columnHTMLWidth)) {
                result.minLimit = newWidth.amount;
            } else {
                result.maxLimit = newWidth.amount;
            }
        }
    }
    return buildNewWidth(result);
}
