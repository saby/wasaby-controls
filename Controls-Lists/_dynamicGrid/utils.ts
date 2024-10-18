/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import { TOffsetSize } from 'Controls/interface';
import type { IDynamicColumnConfig } from 'Controls-Lists/dynamicGrid';
import { Logger } from 'UI/Utils';
import type { IColumnConfig, TColumnKey } from 'Controls/gridReact';
import { AGGREGATION_COLUMN_WIDTH, CHECKBOX_COLUMN_WIDTH } from './constants';

const GAP_SIZES_MAP = {
    null: 0,
    '3xs': 2,
    '2xs': 4,
    xs: 6,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
};

export function getColumnGapSize(columnsSpacing: TOffsetSize | 'null'): number {
    const borderThickness = 1;
    if (!columnsSpacing) {
        return 0;
    }
    return Math.max(GAP_SIZES_MAP[columnsSpacing] + borderThickness, 0);
}

// Возвращает ширину рабочей области динамической сетки
export function getViewportWidth(
    viewportWidth: number,
    staticColumns: IColumnConfig[],
    isAggregationVisible: boolean = false,
    staticWorkspaceSize: string = 'default'
): number | null {
    if (!viewportWidth) {
        Logger.error(
            'Should set viewportWidth. Pass workspaceWidth into it https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/workspace-config/'
        );
        return null;
    }

    const staticColumnsWidth = getStaticColumnsWidth(staticColumns, staticWorkspaceSize);
    return (
        viewportWidth - staticColumnsWidth - (isAggregationVisible ? AGGREGATION_COLUMN_WIDTH : 0)
    );
}

// Возвращает ширину статических колонок.
export function getStaticColumnsWidth(
    staticColumns: IColumnConfig[],
    staticWorkspaceSize = 'default'
): number {
    if (!staticColumns || !staticColumns.length) {
        return 0;
    }

    if (staticWorkspaceSize === 'min') {
        return staticColumns.reduce((sumWidth, column) => {
            const minWidth = parseInt(column.minWidth, 10);
            return sumWidth + minWidth;
        }, 0);
    }

    return staticColumns.reduce((sumWidth, column) => {
        const width = parseInt(column.width, 10);
        return sumWidth + width;
    }, 0);
}

/**
 * Расчитывает ширину динамических колонок.
 * @param viewportWidth Ширина рабочей области.
 * @param rangeSize Колличество динамических колонок.
 * @param dynamicColumn Динамические колонки.
 * @param columnGapSize Ширина отступов между ячейками.
 * @param hasMultiSelectColumn Есть ли колонка с множественным выбором.
 * @param minWidth Минимальная ширина колонки.
 */
export function getDynamicColumnWidth(
    viewportWidth: number | null,
    rangeSize: number,
    dynamicColumn: IDynamicColumnConfig<Date> | IDynamicColumnConfig<TColumnKey>,
    columnGapSize: number,
    hasMultiSelectColumn: boolean,
    minWidth: number
): { width: number; rangeSize?: number } {
    if (!viewportWidth) {
        return { width: minWidth };
    }

    const checkboxWidth = hasMultiSelectColumn ? CHECKBOX_COLUMN_WIDTH : 0;
    let availableWidth = viewportWidth - columnGapSize * (rangeSize + 1) - checkboxWidth;
    const width = availableWidth / rangeSize;
    if (width < minWidth) {
        const maxRangeSize = Math.floor(
            (viewportWidth - columnGapSize - checkboxWidth) / (minWidth + columnGapSize)
        );
        if (maxRangeSize > 1) {
            availableWidth = viewportWidth - columnGapSize * (maxRangeSize + 1) - checkboxWidth;
            return {
                width: availableWidth / maxRangeSize,
                rangeSize: maxRangeSize,
            };
        } else {
            Logger.warn(
                'TimelineGrid: Доступная ширина слишком мала. Корректная работа контрола невозможна.'
            );
            return { width: minWidth };
        }
    } else {
        return { width };
    }
}
