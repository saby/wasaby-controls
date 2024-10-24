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
import { IHeaderCell, TColumnsForCtor, THeaderForCtor, IColumn } from 'Controls/baseGrid';

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
export function updateMainColumnWidth(width: string, isMinimalState: boolean): string {
    return buildNewWidth(
        validateColumnWidth(parseColumnWidth(width), !isMinimalState),
        !isMinimalState
    );
}
/**
 * Обрабатывает значение ширины (в пикселях) на соответствие допустимым значениям
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
            if (isMainColumn) {
                if (processedWidth.minLimit === DEFAULT_MIN_MAIN_COLUMN_WIDTH) {
                    processedWidth.minLimit = undefined;
                }
                if (processedWidth.maxLimit === DEFAULT_MAX_MAIN_COLUMN_WIDTH) {
                    processedWidth.maxLimit = undefined;
                }
            } else {
                if (processedWidth.minLimit === MIN_COLUMN_WIDTH) {
                    processedWidth.minLimit = undefined;
                }
                if (processedWidth.maxLimit === MAX_COLUMN_AUTO) {
                    processedWidth.maxLimit = undefined;
                }
            }
            // Валидация нижней границы
            if (processedWidth.minLimit && processedWidth.minLimit < minWidth) {
                processedWidth.minLimit = isMainColumn
                    ? DEFAULT_MIN_MAIN_COLUMN_WIDTH
                    : MIN_COLUMN_WIDTH;
            }
            // Валидация верхней границы
            if (processedWidth.maxLimit && !Number.isInteger(processedWidth.maxLimit)) {
                processedWidth.maxLimit = undefined;
            }
            if (!isMainColumn && processedWidth.maxLimit && processedWidth.maxLimit > maxWidth) {
                processedWidth.maxLimit = MAX_COLUMN_WIDTH;
            }
            if (processedWidth.minLimit && processedWidth.maxLimit) {
                if (processedWidth.minLimit > processedWidth.maxLimit) {
                    const maxLimit = processedWidth.minLimit;
                    processedWidth.minLimit = processedWidth.maxLimit;
                    processedWidth.maxLimit = maxLimit;
                }
            }
        }
    }
    return processedWidth;
}

export function validateColumnWidthInPercents(
    width: IColumnWidth,
    containerWidth: number,
    isMainColumn?: boolean
): IColumnWidth {
    const widthInPixels = { ...width, units: 'px' };

    if (width.amount) {
        widthInPixels.amount = percentsToPixels(width.amount, containerWidth);
    }
    if (width.maxLimit && Number.isInteger(width.maxLimit)) {
        widthInPixels.maxLimit = percentsToPixels(width.maxLimit, containerWidth);
    }
    if (width.minLimit && Number.isInteger(width.minLimit)) {
        widthInPixels.minLimit = percentsToPixels(width.minLimit, containerWidth);
    }

    const acceptableWidth = validateColumnWidth(widthInPixels, isMainColumn);

    if (acceptableWidth.amount) {
        acceptableWidth.amount = pixelsToPercents(acceptableWidth.amount, containerWidth);
    }
    if (acceptableWidth.maxLimit) {
        acceptableWidth.maxLimit = pixelsToPercents(acceptableWidth.maxLimit, containerWidth);
    }
    if (acceptableWidth.minLimit) {
        acceptableWidth.minLimit = pixelsToPercents(acceptableWidth.minLimit, containerWidth);
    }
    acceptableWidth.units = '%';
    return acceptableWidth;
}

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

export function buildNewWidth(
    newWidthConfig: IColumnWidth,
    isMainColumn: boolean = false,
    containerWidth?: number
): string {
    const {
        mode = 'fixed',
        amount = DEFAULT_COLUMN_PARAMS.width,
        units = 'px',
        minLimit,
        maxLimit,
    } = newWidthConfig;
    if (mode === 'auto') {
        if (minLimit || maxLimit) {
            let minWidth = minLimit;
            if (!minWidth) {
                if (newWidthConfig.units === PERCENT_UNIT) {
                    if (containerWidth) {
                        minWidth = pixelsToPercents(minWidth, containerWidth);
                    }
                } else {
                    minWidth = isMainColumn ? DEFAULT_MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
                }
            }
            let maxWidth = maxLimit;
            if (!maxWidth) {
                maxWidth = isMainColumn ? DEFAULT_MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_AUTO;
            }
            return `minmax(${minWidth}${units},${maxWidth}${
                typeof maxWidth !== 'string' ? units : ''
            })`;
        } else {
            if (isMainColumn) {
                return `minmax(${DEFAULT_MIN_MAIN_COLUMN_WIDTH}px, ${DEFAULT_MAX_MAIN_COLUMN_WIDTH})`;
            }
            return 'max-content';
        }
    } else {
        return amount + units;
    }
}

export function pixelsToPercents(widthInPixels: number, totalWidthInPixels: number): number {
    return Math.round((widthInPixels / totalWidthInPixels) * HUNDRED_PERCENT);
}

export function percentsToPixels(widthInPercents: number, totalWidthInPixels: number): number {
    return Math.round((widthInPercents * totalWidthInPixels) / HUNDRED_PERCENT);
}

export function resizeHandler(params: IHandleResizingParams): string {
    const { columnHTMLWidth, columnTemplateWidth, offset, containerWidth, isMainColumn } = params;
    const newWidth = validateColumnWidth(
        {
            mode: FIXED_MODE,
            amount: Math.round(columnHTMLWidth + offset),
            units: PIXEL_UNIT,
        },
        isMainColumn
    );
    const parsedTemplateWidth = parseColumnWidth(columnTemplateWidth);
    const templateWidth =
        parsedTemplateWidth.units === PERCENT_UNIT
            ? validateColumnWidthInPercents(parsedTemplateWidth, containerWidth, isMainColumn)
            : validateColumnWidth(parsedTemplateWidth, isMainColumn);
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
        if (templateWidth.maxLimit || templateWidth.minLimit) {
            let maxLimit = templateWidth.maxLimit;
            let minLimit = templateWidth.minLimit;
            if (templateWidth.units === PERCENT_UNIT) {
                if (minLimit) {
                    minLimit = percentsToPixels(minLimit, containerWidth);
                }
                if (maxLimit && Number.isInteger(maxLimit)) {
                    maxLimit = percentsToPixels(maxLimit, containerWidth);
                }
            }
            if (!maxLimit) {
                if (isMainColumn) {
                    // MinMax(N; 1fr)
                    result.maxLimit = maxLimit;
                    result.minLimit = newWidth.amount;
                } else {
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
            }
            // MinMax(N; K)
            else if (Math.round(columnHTMLWidth) === maxLimit) {
                // Если текущая фактическая ширина равна K
                if (newWidth.amount > Math.round(columnHTMLWidth)) {
                    // MinMax(N; K+)
                    result.maxLimit = newWidth.amount;
                    result.minLimit = minLimit;
                } else if (newWidth.amount < Math.round(columnHTMLWidth)) {
                    if (!minLimit) {
                        minLimit = isMainColumn ? DEFAULT_MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
                    }
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
                } else if (newWidth.amount <= Math.round(columnHTMLWidth)) {
                    // Если уменьшили колонку
                    // более N
                    if (!minLimit) {
                        minLimit = isMainColumn ? DEFAULT_MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
                    }
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
        result.units = templateWidth.units;
        if (result.units === PERCENT_UNIT) {
            if (result.mode === FIXED_MODE) {
                result.amount = pixelsToPercents(result.amount, containerWidth);
            } else if (result.mode === AUTO_MODE) {
                result.minLimit = pixelsToPercents(result.minLimit, containerWidth);
                if (Number.isInteger(result.maxLimit)) {
                    result.maxLimit = pixelsToPercents(result.maxLimit, containerWidth);
                }
            }
        }
    }
    const acceptableWidth =
        result.units === PERCENT_UNIT
            ? validateColumnWidthInPercents(result, containerWidth, isMainColumn)
            : validateColumnWidth(result, isMainColumn);
    return buildNewWidth(acceptableWidth, isMainColumn, containerWidth);
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
