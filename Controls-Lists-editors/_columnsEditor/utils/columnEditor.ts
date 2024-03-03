import {
    MIN_COLUMN_WIDTH,
    MIN_MAIN_COLUMN_WIDTH,
    MAX_COLUMN_WIDTH,
    DEFAULT_COLUMN_PARAMS,
    MAX_MAIN_COLUMN_WIDTH,
    FIXED_MODE,
    AUTO_MODE,
    PIXEL_UNIT,
    PERCENT_UNIT,
    HUNDRED_PERCENT,
} from 'Controls-Lists-editors/_columnsEditor/constants';
import { Logger } from 'UICommon/Utils';

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

// Утилиты для работы с редактором колонки

/**
 * Обрабатывает новое значение ширины (в пикселях) на соответствие допустимым значениям
 * @param width
 * @param isMainColumn
 */
export function validateColumnWidth(width: IColumnWidth, isMainColumn?: boolean): IColumnWidth {
    const processedWidth = { ...width };
    if (width.units === 'px') {
        const minWidth = isMainColumn ? MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
        const maxWidth = isMainColumn ? MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_WIDTH;
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
                processedWidth.minLimit = minWidth;
            }
            // Для главной колонки нет ограничения по максимуму ширины
            if (
                ((isMainColumn || processedWidth.minLimit) && !processedWidth.maxLimit) ||
                (!isMainColumn && processedWidth.maxLimit && processedWidth.maxLimit > maxWidth)
            ) {
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
        // Если задана хотя бы одна граница, редактор подставит в другую значение по умолчанию
        if (templateWidth.maxLimit && templateWidth.minLimit) {
            const maxLimit =
                templateWidth.units === PIXEL_UNIT
                    ? templateWidth.maxLimit
                    : Math.round(containerWidth * (templateWidth.maxLimit / HUNDRED_PERCENT));
            const minLimit =
                templateWidth.units === PIXEL_UNIT
                    ? templateWidth.minLimit
                    : Math.round(containerWidth * (templateWidth.minLimit / HUNDRED_PERCENT));
            if (
                (newWidth.amount > Math.round(columnHTMLWidth) &&
                    Math.round(columnHTMLWidth) < maxLimit) ||
                (newWidth.amount < Math.round(columnHTMLWidth) && newWidth.amount < minLimit)
            ) {
                result = { ...newWidth };
            } else {
                result.maxLimit = newWidth.amount;
                result.minLimit = templateWidth.minLimit;
                validateColumnWidth(result, isMainColumn);
            }
        } else {
            if (newWidth.amount >= Math.round(columnHTMLWidth)) {
                result.minLimit = newWidth.amount;
                result.maxLimit = isMainColumn ? MAX_MAIN_COLUMN_WIDTH : MAX_COLUMN_WIDTH;
            } else {
                result.maxLimit = newWidth.amount;
                result.minLimit = isMainColumn ? MIN_MAIN_COLUMN_WIDTH : MIN_COLUMN_WIDTH;
            }
        }
    }
    return buildNewWidth(result);
}
