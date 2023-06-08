import * as React from 'react';

import {
    IItemActionsHandler,
    IItemEventHandlers,
    ITrackedPropertiesTemplateProps,
} from 'Controls/baseList';

import { GridCollection } from 'Controls/grid';

/**
 * Интерфейс опцисывающий опции рендера таблицы.
 * @private
 */
export interface IGridViewProps {
    /**
     * Коллекция на основе которой строится таблица
     */
    collection: GridCollection;

    /**
     * Версия коллекции благодаря которой нативно вызывается перерисовка
     */
    collectionVersion: number;

    /**
     * Внутренние обработчики событий
     */
    itemHandlers: IItemEventHandlers;

    /**
     * Обработчики для опций записи
     */
    actionHandlers: IItemActionsHandler;

    className?: string;
    itemsContainerClass: string;
    itemsContainerReadyCallback: (
        itemsContainerGetter: () => HTMLElement
    ) => void;
    viewResized: () => void;

    trackedPropertiesTemplate?: React.FunctionComponent<ITrackedPropertiesTemplateProps>;
}
