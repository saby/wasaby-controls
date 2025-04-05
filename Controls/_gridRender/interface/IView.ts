import * as React from 'react';
import type { Model } from 'Types/entity';

import type {
    IItemActionsHandler,
    IItemEventHandlers,
    ITrackedPropertiesTemplateProps,
} from 'Controls/baseList';

import type { GridCollection } from 'Controls/grid';
import { TListTriggerPosition } from 'Controls/interface';
import { Container as ValidateContainer } from 'Controls/validate';
import { TGroupViewMode } from 'Controls/_display/interface/ICollection';
import { TemplateFunction } from 'UICommon/Base';
import { ICellComponentProps } from 'Controls/_gridRender/cell/interface/ICell';
import { IBeforeContentRenderProps } from 'Controls/_gridRender/row/interface/IRowComponent';
import { GridRow, IRowComponentProps } from 'Controls/grid';
import type { TEditArrowVisibilityCallback, IItemActionsOptions } from 'Controls/itemActions';
import type { IItemsRange } from 'Controls/baseList';

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
 * Интерфейс конфигурации таблицы, порддерживающей шеврон редактирования
 * @public
 */
export interface IEditArrowGridProps {
    /**
     * Видимость кнопки, которая отображается в первой колонке при наведении курсора.
     * @cfg
     * @remark
     * Чтобы стрелка отобразилась в прикладном рендере ячейки, необходимо использовать компонент Controls/grid:EditArrowComponent.
     * Чтобы скрыть стрелку у некоторых записей, используйте {@link Controls/gridRender:IEditArrowGridProps#editArrowVisibilityCallback}.
     * **Обратите внимание!** Для отображения стрелки по свайпу необходимо всегда указывать опцию showEditArrow=true, вне зависимости от того, используется прикладной шаблон или нет.
     * @demo Controls-demo/gridNew/ShowEditArrow/Index
     * @example
     * <pre class="brush: js;">
     * <!-- TypeScript -->
     * import { View as GridView, IColumnConfig, useItemData, EditArrowComponent } from 'Controls/grid';
     *
     * function CustomNameTemplate(): ReactElement {
     *     const { renderProps: { name } } = useItemData(['name'])
     *     return (
     *          <div>
     *              {name}
     *              <EditArrowComponent backgroundStyle="default"/>
     *          </div>
     *     )
     * }
     *
     * const columns: IColumnConfig[] = [
     *       {
     *          displayProperty: 'name',
     *          width: '1fr',
     *          render: <CustomNameTemplate/>
     *       },
     *    ];
     *    function CustomControl(): ReactElement {
     *        return <GridView columns={columns}/>;
     *    }
     * </pre>
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
}

/**
 * Интерфейс описывающий опции рендера таблицы.
 * @private
 */
export interface IGridViewProps
    extends ICompatibleGridViewProps,
        IItemActionsOptions,
        Partial<IEditArrowGridProps> {
    /**
     * Границы отображаемого диапазона записей
     */
    virtualScrollRange?: IItemsRange;
    /**
     * Коллекция на основе которой строится таблица
     * @cfg
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

    onHeaderClick?: React.EventHandler<React.MouseEvent>;

    /**
     * Обработчики для опций записи
     */
    actionHandlers?: IItemActionsHandler;

    className?: string;
    itemsContainerClass?: string;
    itemsContainerReadyCallback?: (itemsContainerGetter: () => HTMLElement) => void;
    viewResized?: () => void;

    /**
     * Опции для размещения контент до и после всех записей.
     * Записи рассматриваются как ItemsView, к которым относятся, например, индикаторы.
     * */
    beforeItemsContent?: JSX.Element;
    afterItemsContent?: JSX.Element;

    /**
     * Контент отображаемый перед заголовком.
     */
    beforeHeader?: JSX.Element;

    /**
     * Растягивать ли контейнер таблицы на всю доступную область.
     */
    shouldStretchGridContainer?: boolean;

    innerFocusElement?: boolean;

    trackedPropertiesTemplate?: React.FunctionComponent<ITrackedPropertiesTemplateProps>;
    needShowEmptyTemplate?: boolean;

    viewTriggerProps?: IViewTriggerProps;
    onViewTriggerVisibilityChanged?: TTriggerVisibilityChangedCallback;
    onValidateCreated?: (control: ValidateContainer) => void;
    onValidateDestroyed?: (control: ValidateContainer) => void;

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
     * Стилизация контрола для masterDetail.
     */
    style?: string;

    /**
     * Функция, вызываемая при клике на "шеврон" элемента.
     * Прнимает два аргумента:
     * * React.SyntheticEvent event Объект события.
     * * {@link Types/entity:Model} item Элемент, по которому произвели клик.
     */
    onEditArrowClick?: (event: React.SyntheticEvent, item: Model) => void;

    groupTemplate?: string | TemplateFunction | React.ReactElement;

    /**
     * Функция, вызываемая при клике на любое место списка.
     * @param event
     */
    onClick?: (event: React.SyntheticEvent) => void;

    // Внутренний параметр. Используется для установки компонента, с помощью которого выводится строка по умолчанию.
    _$FRC?: React.FunctionComponent<IRowComponentProps>;

    // Внутренний параметр. Используется для установки компонента, с помощью которого выводятся ячейки строки по умолчанию.
    _$FCC?: React.FunctionComponent<ICellComponentProps>;

    // Внутренний параметр. Используется в рендере элемента для вывода компонента перед его контентом.
    beforeItemContentRender?: React.FunctionComponent<IBeforeContentRenderProps>;

    // Внутренний параметр. Функция, необходимая для предобработки компонента ряда (обертка в контекст, подгрузка шаблона, если он был передан и тд ).
    // Возвращает компонент строки _$FRC с дополнительными опциями
    _$getRowComponent?: (
        item: GridRow,
        props: IGridViewProps,
        rowProps: IRowComponentProps
    ) => React.ReactElement | null;

    // Внутренний параметр. Содержит значение для стиля grid-template-columns,
    // который навешивается у фейкового грида горизонтального скролла в мобильном представлении
    _$fakeGridTemplateColumns?: string;
}
