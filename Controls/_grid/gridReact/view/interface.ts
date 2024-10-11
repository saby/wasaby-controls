import * as React from 'react';
import type { Model } from 'Types/entity';

import {
    IItemActionsHandler,
    IItemEventHandlers,
    ITrackedPropertiesTemplateProps,
} from 'Controls/baseList';

import type { GridCollection } from 'Controls/grid';
import { TListTriggerPosition, TItemActionsVisibility } from 'Controls/interface';
import { Container as ValidateContainer } from 'Controls/validate';
import { TGroupViewMode } from 'Controls/_display/interface/ICollection';
import { TemplateFunction } from 'UICommon/Base';
import { ICellComponentProps } from 'Controls/_grid/dirtyRender/cell/interface';
import { IBeforeContentRenderProps } from 'Controls/_grid/gridReact/row/interface';
import { GridRow, IRowComponentProps } from 'Controls/grid';
import type { TEditArrowVisibilityCallback, IItemActionsOptions } from 'Controls/itemActions';

export interface IViewTriggerProps {
    offset: number;
}

export type TTriggerVisibilityChangedCallback = (
    position: TListTriggerPosition,
    state: boolean
) => void;

// Опции для совместимости с wasaby-списками
interface ICompatibleGridViewProps {
    multiSelectTemplate?: TemplateFunction;
}

/**
 * Интерфейс описывающий опции рендера таблицы.
 * @private
 */
export interface IGridViewProps extends ICompatibleGridViewProps, IItemActionsOptions {
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
     * Компонент для отображения групп
     */
    groupRender?: React.ReactElement;

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

    /**
     * Признак наличия кнопки "стрелки редактирования".
     * @cfg
     * @default false
     * @see editArrowVisibilityCallback
     */
    showEditArrow?: boolean;

    /**
     * Функция обратного вызова для управления видимостью кнопки редактирования.
     * @cfg
     * @remark
     * Первый и единственный аргумент функции - запись таблицы, для которой вызвана функция.
     * Функция вызывается при включенной опции showEditArrow для каждой записи списка,
     * таким образом позволяет убрать видимость стрелки редактирования у отдельно взятых записей.
     * @see showEditArrow
     */
    editArrowVisibilityCallback?: TEditArrowVisibilityCallback;

    /**
     * Функция, вызываемая при клике на "шеврон" элемента.
     * Прнимает два аргумента:
     * * React.SyntheticEvent event Объект события.
     * * {@link Types/entity:Model} item Элемент, по которому произвели клик.
     */
    onEditArrowClick?: (event: React.SyntheticEvent, item: Model) => void;

    groupTemplate?: React.ReactElement;

    // Внутренний параметр. Используется для установки компонента, с помощью которого выводится строка по умолчанию.
    _$FunctionalRowComponent?: React.FunctionComponent<IRowComponentProps>;

    // Внутренний параметр. Используется для установки компонента, с помощью которого выводятся ячейки строки по умолчанию.
    _$FunctionalCellComponent?: React.FunctionComponent<ICellComponentProps>;

    // Внутренний параметр. Используется в рендере элемента для вывода компонента перед его контентом.
    beforeItemContentRender?: React.FunctionComponent<IBeforeContentRenderProps>;

    // Внутренний параметр. Функция, необходимая для предобработки компонента ряда (обертка в контекст, подгрузка шаблона, если он был передан и тд ).
    // Возвращает компонент строки _$FunctionalRowComponent с дополнительными опциями
    _$getRowComponent?: (
        item: GridRow,
        props: IGridViewProps,
        rowProps: IRowComponentProps
    ) => React.ReactElement | null;
}
