import * as React from 'react';

import {
    IItemActionsHandler,
    IItemEventHandlers,
    ITrackedPropertiesTemplateProps,
} from 'Controls/baseList';

import type { GridCollection } from 'Controls/grid';
import { TListTriggerPosition } from 'Controls/interface';
import { Container as ValidateContainer } from 'Controls/validate';

export interface IViewTriggerProps {
    offset: number;
}

export type TTriggerVisibilityChangedCallback = (
    position: TListTriggerPosition,
    state: boolean
) => void;

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

    onHeaderClick: React.EventHandler<React.MouseEvent>;

    /**
     * Обработчики для опций записи
     */
    actionHandlers: IItemActionsHandler;

    className?: string;
    itemsContainerClass: string;
    itemsContainerReadyCallback?: (itemsContainerGetter: () => HTMLElement) => void;
    viewResized?: () => void;

    /**
     * Опции для размещения контент до и после всех записей.
     * Записи рассматриваются как ItemsView, к которым относятся, например, индикаторы.
     * */
    beforeItemsContent?: JSX.Element;
    afterItemsContent?: JSX.Element;

    trackedPropertiesTemplate?: React.FunctionComponent<ITrackedPropertiesTemplateProps>;
    needShowEmptyTemplate?: boolean;

    viewTriggerProps?: IViewTriggerProps;
    onViewTriggerVisibilityChanged?: TTriggerVisibilityChangedCallback;
    onValidateCreated: (control: ValidateContainer) => void;
    onValidateDestroyed: (control: ValidateContainer) => void;
}
