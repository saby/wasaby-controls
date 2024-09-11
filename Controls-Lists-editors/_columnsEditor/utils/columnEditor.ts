import {
    MIN_COLUMN_WIDTH,
    DEFAULT_MIN_MAIN_COLUMN_WIDTH,
    MAX_COLUMN_WIDTH,
    DEFAULT_COLUMN_PARAMS,
    DEFAULT_MAX_MAIN_COLUMN_WIDTH,
    FIXED_MODE,
    AUTO_MODE,
    PIXEL_UNIT,
    PERCENT_UNIT,
    HUNDRED_PERCENT,
    MAX_COLUMN_AUTO,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import { Logger } from 'UICommon/Utils';
import { IColumn } from 'Controls/_baseGrid/display/interface/IColumn';
import { IHeaderCell, TColumnsForCtor, THeaderForCtor } from 'Controls/baseGrid';

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
    isMainColumn?: boolean;
}

export interface IUnusedColumn {
    column: IColumn;
    header: IHeaderCell;
}

type TUnusedColumnsResult = IUnusedColumn[];

// Утилиты для работы с редактором колонки И папки

/**
 * Обрабатывает новое значение ширины (в пикселях) на соответствие допустимым значениям
 * @param width
 * @param isMainColumn
 */
export function validateColumnWidth(width: IColumnWidth, isMainColumn?: boolean): IColumnWidth {
    const processedWidth = { ...width };
    if (width.units === 'px') {
        const minWidth = MIN_COLUMN_WIDTH;
        const maxWidth = MAX_COLUMN_WIDTH;
        if (width.mode === 'fixed') {
            if (width.amount < minWidth) {
                processedWidth.amount = minWidth;
            } else if (!isMainColumn && width.amount > maxWidth) {
                processedWidth.amount = maxWidth;
            }
        } else {
            // По умолчанию ширина главной колонки minmax(200px, 1fr). Если у главной колонки ширина авто, а границы не заданы, зададим их по умолчанию
            if (
                ((isMainColumn || processedWidth.maxLimit) && !processedWidth.minLimit) ||
                (processedWidth.minLimit && processedWidth.minLimit < minWidth)
            ) {
                processedWidth.minLimit = isMainColumn
                    ? DEFAULT_MIN_MAIN_COLUMN_WIDTH
                    : MIN_COLUMN_WIDTH;
            }
            // Для главной колонки нет ограничения по максимуму ширины
            if (
                ((isMainColumn || processedWidth.minLimit) && !processedWidth.maxLimit) ||
                (!isMainColumn && processedWidth.maxLimit && processedWidth.maxLimit > maxWidth)
            ) {
                processedWidth.maxLimit = isMainColumn
                    ? DEFAULT_MAX_MAIN_COLUMN_WIDTH
                    : MAX_COLUMN_AUTO;
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
                    result.maxLimit = maxLimitStr.trim();
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
            return `minmax(${minLimit}${units},${maxLimit}${
                typeof maxLimit !== 'string' ? units : ''
            })`;
        }
        return 'max-content';
    } else {
        return amount + units;
    }
}

export function resizeHandler(params: IHandleResizingParams): string {
    const { columnHTMLWidth, columnTemplateWidth, offset, containerWidth, isMainColumn } = params;
    const newWidth = validateColumnWidth({
        mode: FIXED_MODE,
        amount: Math.round(columnHTMLWidth + offset),
        units: PIXEL_UNIT,
    });
    const templateWidth = parseColumnWidth(columnTemplateWidth);
    let result: IColumnWidth = { mode: FIXED_MODE };
    if (templateWidth.mode === FIXED_MODE) {
        if (templateWidth.units === PERCENT_UNIT) {
            result.amount = Math.round((newWidth.amount / columnHTMLWidth) * templateWidth.amount);
            result.units = PERCENT_UNIT;
        } else {
            result = { ...newWidth };
        }
    } else {
        result.mode = AUTO_MODE;
        if (templateWidth.maxLimit && templateWidth.minLimit) {
            const maxLimit =
                templateWidth.units === PIXEL_UNIT
                    ? templateWidth.maxLimit
                    : Math.round(containerWidth * (templateWidth.maxLimit / HUNDRED_PERCENT));
            const minLimit =
                templateWidth.units === PIXEL_UNIT
                    ? templateWidth.minLimit
                    : Math.round(containerWidth * (templateWidth.minLimit / HUNDRED_PERCENT));
            if (maxLimit === DEFAULT_MAX_MAIN_COLUMN_WIDTH) {
                // MinMax(N; 1fr)
                result.maxLimit = maxLimit;
                result.minLimit = newWidth.amount;
            } else if (maxLimit === MAX_COLUMN_AUTO) {
                //  MinMax(N; Max-Content)
                if (newWidth.amount > Math.round(columnHTMLWidth)) {
                    // MinMax(N+; Max-Content)
                    result.maxLimit = maxLimit;
                    result.minLimit = newWidth.amount;
                } else {
                    // N- Фиксированная
                    result = { ...newWidth };
                }
            }
            // MinMax(N; K)
            else if (Math.round(columnHTMLWidth) === maxLimit) {
                // Если текущая фактическая ширина равна K
                if (newWidth.amount > Math.round(columnHTMLWidth)) {
                    // MinMax(N; K+)
                    result.maxLimit = newWidth.amount;
                    result.minLimit = minLimit;
                } else if (newWidth.amount < Math.round(columnHTMLWidth)) {
                    if (newWidth.amount > minLimit) {
                        // MinMax(N; K-)
                        result.maxLimit = newWidth.amount;
                        result.minLimit = minLimit;
                    } else {
                        // K- Фиксированная
                        result = { ...newWidth };
                    }
                }
            } else {
                // Если текущая фактическая ширина меньше K
                // увеличили колонку не более K
                if (newWidth.amount > Math.round(columnHTMLWidth)) {
                    if (newWidth.amount < maxLimit) {
                        // MinMax(K-; K)
                        result.maxLimit = maxLimit;
                        result.minLimit = newWidth.amount;
                    } else {
                        // Если увеличили до K или более => Фиксированная K+
                        result = { ...newWidth };
                    }
                } else if (newWidth.amount < Math.round(columnHTMLWidth)) {
                    // Если уменьшили колонку
                    // более N
                    if (newWidth.amount > minLimit) {
                        // MinMax(N; K-)
                        result.maxLimit = newWidth.amount;
                        result.minLimit = minLimit;
                    } else {
                        // менее или равно N => Фиксированная K-
                        result = { ...newWidth };
                    }
                }
            }
        } else {
            // Max-content (без ограничений)
            if (newWidth.amount >= Math.round(columnHTMLWidth)) {
                result.minLimit = newWidth.amount;
                result.maxLimit = isMainColumn ? DEFAULT_MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_AUTO;
            } else {
                result.maxLimit = newWidth.amount;
                result.minLimit = MIN_COLUMN_WIDTH;
            }
        }
    }
    return buildNewWidth(validateColumnWidth(result));
}

export function getInitialColumnConfig(
    column: IColumn,
    allColumns: TColumnsForCtor,
    allHeaders: THeaderForCtor
): IHeaderCell {
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

export function getUnusedColumns(
    allColumns: TColumnsForCtor,
    allHeader: THeaderForCtor,
    columns: TColumnsForCtor
): TUnusedColumnsResult | undefined {
    const result: TUnusedColumnsResult = [];
    allColumns.filter((initColumn: IColumn, columnId: number) => {
        const editingColumn: IColumn | undefined = columns.find((column: IColumn) => {
            return column.displayProperty === initColumn.displayProperty;
        });
        if (!editingColumn) {
            const unusedColumnHeader = allHeader.find((initHeader: IHeaderCell) => {
                return initHeader.startColumn - 1 === columnId;
            });
            const item: IUnusedColumn = {
                column: initColumn,
                header: unusedColumnHeader,
            };
            result.push(item);
        }
    });
    return result;
}
