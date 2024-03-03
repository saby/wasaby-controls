import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import {
    ISourceOptions,
    IDraggableOptions,
    ISortingOptions,
    TVisibility,
} from 'Controls/interface';
import { IItemActionsOptions } from 'Controls/itemActions';

import {
    IColumnConfig,
    IHeaderConfig,
    IResultConfig,
    IFooterConfig,
    TGetCellPropsCallback,
    TRowSeparatorSize,
    TColumnSeparatorSize,
} from 'Controls/_gridReact/cell/interface';
import { TGetRowPropsCallback } from 'Controls/_gridReact/row/interface';
import * as React from 'react';
import { IEmptyViewConfig } from 'Controls/_gridReact/cell/interface';
import { IEmptyViewProps } from 'Controls/_gridReact/emptyView/interface';
import { TGetGroupPropsCallback } from 'Controls/_gridReact/group/interface';

export type TItem = Model;

/**
 * Тип ключа колонки - строка или число
 * @typedef {(String|Number)} Controls/_gridReact/CommonInterface/TColumnKey
 */
export type TColumnKey = string | number;

/**
 * Базовый интерфейс колонки таблицы (реакт)
 * @interface Controls/_gridReact/CommonInterface
 * @public
 */
export interface IBaseColumnConfig {
    /**
     * Уникальный идентификатор.
     */
    key?: TColumnKey;

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

/**
 * Интерфейс параметров объединения колонок
 * @interface Controls/_gridReact/CommonInterface/IColspanProps
 * @public
 */
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

/**
 * Интерфейс параметров объединения строк
 * @interface Controls/_gridReact/CommonInterface/IRowspanProps
 * @public
 */
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
 * Размещение строки итогов
 * @typedef {String} Controls/_gridReact/CommonInterface/TResultsPosition
 * @variant top Сверху, под строкой заголовков
 * @variant bottom Внизу, над строкой подвала
 */
export type TResultsPosition = 'top' | 'bottom';

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
    /**
     * Конфигурация заголовков таблицы
     */
    header: IHeaderConfig[];
    /**
     * Конфигурация ячеек строки итогов
     */
    results: IResultConfig[];
    /**
     * Размещение строки итогов
     * @cfg {Controls/_gridReact/CommonInterface/TResultsPosition.typedef}
     */
    resultsPosition?: TResultsPosition;
    /**
     * Конфигурация ячеек подвала таблицы
     */
    footer: IFooterConfig[];
    /**
     * Колонки для построения таблицы
     */
    columns: IColumnConfig[];
    /**
     * Конфигурация ячеек пустого представлния
     * @see emptyViewProps
     */
    emptyView: IEmptyViewConfig[];
    /**
     * Объект с конфигурацией строки пустого представления
     * @see emptyView
     */
    emptyViewProps: IEmptyViewProps;
    /**
     * Величина разделителя строк
     * @cfg {Controls/_display/interface/ICollectionItem/TRowSeparatorSize.typedef}
     */
    rowSeparatorSize?: TRowSeparatorSize;
    /**
     * Величина разделителя колонок
     * @cfg {Controls/_display/interface/ICollectionItem/TColumnSeparatorSize.typedef}
     */
    columnSeparatorSize?: TColumnSeparatorSize;
    /**
     * Функция, возвращающая свойства строки
     * @cfg {Controls/_gridReact/row/interface/TGetRowPropsCallback.typedef}
     */
    getRowProps?: TGetRowPropsCallback;
    /**
     * Видимость множественного выбора строк
     * @cfg {Controls/interface/TVisibility.typedef}
     */
    multiSelectVisibility?: TVisibility;
    /**
     * Компонент для отображения групп
     */
    groupRender?: React.ReactElement;
    /**
     * Функция, возвращающая свойства нгруппы
     */
    getGroupProps?: TGetGroupPropsCallback;
}
