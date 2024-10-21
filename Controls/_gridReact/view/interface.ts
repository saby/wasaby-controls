import * as React from 'react';

import {
    IItemActionsHandler,
    IItemEventHandlers,
    ITrackedPropertiesTemplateProps,
} from 'Controls/baseList';

import type { GridCollection } from 'Controls/grid';
import { TListTriggerPosition, TItemActionsVisibility } from 'Controls/interface';
import { Container as ValidateContainer } from 'Controls/validate';
import { TGroupViewMode } from 'Controls/_display/interface/ICollection';

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

    innerFocusElement?: boolean;

    trackedPropertiesTemplate?: React.FunctionComponent<ITrackedPropertiesTemplateProps>;
    needShowEmptyTemplate?: boolean;

    viewTriggerProps?: IViewTriggerProps;
    onViewTriggerVisibilityChanged?: TTriggerVisibilityChangedCallback;
    onValidateCreated: (control: ValidateContainer) => void;
    onValidateDestroyed: (control: ValidateContainer) => void;
    itemActionsVisibility: TItemActionsVisibility;

    /**
     * Опция позволяет включить/отключить фикс, решающий проблему с разрывами между заголовками. См {@link /doc/platform/developmentapl/interface-development/debug/scroll-container/#1px-border-controlsgrid Отладка ошибок в скролл-контейнере и фиксированных заголовках}
     * @default false
     */
    subPixelArtifactFix?: boolean;

    /**
     * Опция, которая решает проблему возникновения разрыва над прилипающем заголовком на масштабах и safari. См {@link /doc/platform/developmentapl/interface-development/debug/scroll-container/#1px Отладка ошибок в скролл-контейнере и фиксированных заголовках}
     * @default true
     */
    pixelRatioBugFix?: boolean;

    /**
     * Режим отображения группы.
     * Возможные значения default, blocks, titledBlocks.
     * @default default
     */
    groupViewMode?: TGroupViewMode;

    /**
     * CSS-класс, позволяющий задать отступы
     * и позицию панели с опциями записи внутри элемента.
     * @default controls-itemActionsV_position_bottomRight
     */
    itemActionsClass?: string;

    /**
     * Стилизация контрола для masterDetail.
     */
    style?: string;
}
