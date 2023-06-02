import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import { ISourceOptions, IDraggableOptions, ISortingOptions } from 'Controls/interface';
import { IItemActionsOptions } from 'Controls/itemActions';

import {
    IColumnConfig,
    IHeaderConfig,
    IResultConfig,
    IFooterConfig,
    TGetCellPropsCallback,
    TRowSeparatorSize,
    TColumnSeparatorSize
} from 'Controls/_gridReact/cell/interface';
import { TGetRowPropsCallback } from 'Controls/_gridReact/row/interface';
import * as React from 'react';
import { IEmptyViewConfig } from 'Controls/_gridReact/cell/interface';
import { IEmptyViewProps } from 'Controls/_gridReact/emptyView/interface';

export type TItem = Model;

export interface IBaseColumnConfig {
    /**
     * Уникальный идентификатор.
     */
    key?: string | number;

    /**
     * Компонент, используемый для отрисовки кастомного контента в ячейке.
     */
    render?: React.ReactElement;

    /**
     * Коллбэк, который возвращает настройки ячеек.
     * @remark Коллбэк и его результат должны быть мемоизированы.
     * Пересоздаваться по ссылке они должны только при наличии реальных изменений.
     */
    getCellProps?: TGetCellPropsCallback;
}

export interface IColspanProps {
    /**
     * Порядковый номер колонки, на которой начинается ячейка.
     * @see endColumn
     */
    startColumn?: number;

    /**
     * Порядковый номер колонки, на которой заканчивается ячейка.
     * @see startColumn
     */
    endColumn?: number;
}

export interface IRowspanProps {
    /**
     * Порядковый номер строки, на которой начинается ячейка.
     * @see endRow
     */
    startRow?: number;

    /**
     * Порядковый номер строки, на которой заканчивается ячейка.
     * @see startRow
     */
    endRow?: number;
}

/**
 * Опции таблицы с новым быстрым рендером на реакте.
 * @public
 */
export interface IGridProps
    extends ISourceOptions,
        IDraggableOptions,
        ISortingOptions,
        IItemActionsOptions {
    items?: RecordSet;

    header: IHeaderConfig[];
    results: IResultConfig[];
    resultsPosition?: 'top' | 'bottom';
    footer: IFooterConfig[];
    columns: IColumnConfig[];

    emptyView: IEmptyViewConfig[];
    emptyViewProps: IEmptyViewProps;

    rowSeparatorSize?: TRowSeparatorSize;
    columnSeparatorSize?: TColumnSeparatorSize;

    getRowProps?: TGetRowPropsCallback;
}
