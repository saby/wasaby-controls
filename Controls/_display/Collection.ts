/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { TemplateFunction } from 'UI/Base';
import Abstract, { IEnumerable, IOptions as IAbstractOptions } from './Abstract';
import CollectionEnumerator from './CollectionEnumerator';
import CollectionItem, {
    IOptions as ICollectionItemOptions,
    ICollectionItemCounters,
} from './CollectionItem';
import AnimatedItem from './AnimatedItem';
import GroupItem from './GroupItem';
import EmptyTemplateItem from './EmptyTemplateItem';
import { Model, Model as EntityModel } from 'Types/entity';
import IItemsStrategy from './IItemsStrategy';
import ItemsStrategyComposer from './itemsStrategy/Composer';
import DirectItemsStrategy from './itemsStrategy/Direct';
import UserItemsStrategy from './itemsStrategy/User';
import GroupItemsStrategy, { IHiddenGroupPosition } from './itemsStrategy/Group';
import DragStrategy from './itemsStrategy/Drag';
import AddStrategy from './itemsStrategy/Add';
import {
    DestroyableMixin,
    SerializableMixin,
    ISerializableState as IDefaultSerializableState,
    functor,
} from 'Types/entity';
import {
    EnumeratorCallback,
    IList,
    IObservable,
    EventRaisingMixin,
    IEnumerableComparatorSession,
} from 'Types/collection';
import { isEqual } from 'Types/object';
import { create } from 'Types/di';
import { mixin, object } from 'Types/util';
import { Set, Map } from 'Types/shim';
import { Object as EventObject } from 'Env/Event';
import * as VirtualScrollController from './controllers/VirtualScroll';
import {
    ICollection,
    ISourceCollection,
    IItemPadding,
    TLogError,
    TGroupViewMode,
} from './interface/ICollection';
import { IDragPosition } from './interface/IDragPosition';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
    IRoundBorder,
    ITrackedPropertiesItem,
    TBackgroundStyle,
    TOffsetSize,
} from 'Controls/interface';
import { Footer, IOptions as IFooterOptions } from 'Controls/_display/Footer';
import IndicatorsMixin from './IndicatorsMixin';
import { Logger } from 'UI/Utils';
import { CrudEntityKey } from 'Types/source';
import { IDirection } from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import { getFlatNearbyItem } from 'Controls/_display/utils/NearbyItemUtils';
import {
    TRowSeparatorVisibility,
    TItemsSpacingVisibility,
} from 'Controls/_display/interface/ICollectionItem';
import { default as ItemsSpacingStrategy } from 'Controls/_display/itemsStrategy/ItemsSpacingStrategy';
import { SpaceCollectionItem } from './SpaceCollectionItem';
import TriggersMixin from 'Controls/_display/TriggersMixin';
import { IVirtualScrollCollection } from './controllers/VirtualScroll';
import type {
    IItemActionsTemplateConfig,
    TItemActionsVisibility,
    TApplyButtonStyle,
} from 'Controls/itemActions';
import Animation from './itemsStrategy/Animation';
import { AdaptiveModeType } from 'UI/Adaptive';

const GLOBAL = globalThis;
const LOGGER = GLOBAL.console;
const MESSAGE_READ_ONLY =
    'The Display is read only. You should modify the source collection instead.';
const VERSION_UPDATE_ITEM_PROPERTIES = [
    'editing',
    'editingContents',
    'animated',
    'canShowActions',
    'expanded',
    'marked',
    'selected',
    'faded',
    'dragTargetNode',
];
const REBUILD_ITEM_PROPERTIES = ['expanded'];

/**
 * Перечисляемый тип значений {@link Controls/list:IList#multiSelectAccessibilityProperty доступности чекбокса}.
 * @typedef {Object} Controls/_display/Collection/MultiSelectAccessibility
 * @property {Boolean} enabled Чекбокс виден и с ним можно взаимодействовать. Соответствует true
 * @property {Boolean} disabled Чекбокс виден, но с ним нельзя взаимодействовать. Режим "только для чтения". Соответствует false
 * @property {Boolean} hidden Чекбокс скрыт. Соответствует null
 */
const MultiSelectAccessibility = {
    /**
     * Чекбокс виден и с ним можно взаимодействовать.
     */
    enabled: true,
    /**
     * Чекбокс виден, но с ним нельзя взаимодействовать. Режим "только для чтения".
     */
    disabled: false,
    /**
     * Чекбокс скрыт.
     */
    hidden: null,
};
export { MultiSelectAccessibility };

export interface ISplicedArray<T> extends Array<T> {
    start?: number;
}

type FilterFunction<S extends Model, T extends CollectionItem> = (
    item: S,
    index: number,
    collectionItem: T,
    collectionIndex: number,
    hasMembers?: boolean,
    group?: GroupItem<S>
) => boolean;

type GroupId = number | string | null;
type GroupFunction<S, T> = (item: S, index: number, collectionItem: T) => GroupId;

interface ISortItem<S, T> {
    item: T;
    index: number;
    collectionItem: S;
    collectionIndex: number;
}

export type SortFunction<S, T> = (a: ISortItem<S, T>, b: ISortItem<S, T>) => number;

export type ItemsFactory<T> = (options: object) => T;

export type TItemActionsPosition = 'inside' | 'outside' | 'custom';

export enum MoreButtonVisibility {
    // Кнопка "Еще" видна всегда
    visible = 'visible',
    // Кнопка "Ещё" должна быть скрыта в узле дерева если он является последним в коллекции
    exceptLastNode = 'exceptLastNode',
}

export type StrategyConstructor<
    F extends IItemsStrategy<S, T>,
    S extends EntityModel = EntityModel,
    T extends CollectionItem<S> = CollectionItem<S>
> = new (options?: unknown) => F;

export interface ISessionItems<T> extends Array<T> {
    properties?: string;
}

export interface ISessionItemState<T> {
    item: T;
    selected: boolean;
}

export interface ISerializableState<S, T> extends IDefaultSerializableState {
    _composer: ItemsStrategyComposer<S, T>;
}

export interface IOptions<S extends Model = Model, T extends CollectionItem = CollectionItem>
    extends IAbstractOptions<S> {
    filter?: FilterFunction<S, T> | FilterFunction<S, T>[];
    group?: GroupFunction<S, T>;
    sort?: SortFunction<S, T> | SortFunction<S, T>[];
    displayProperty?: string;
    itemTemplateProperty?: string;
    multiSelectVisibility?: string;
    multiSelectPosition?: 'default' | 'custom';
    itemPadding?: IItemPadding;
    itemsSpacing?: TOffsetSize;
    emptyTemplate?: TemplateFunction;
    rowSeparatorSize?: 's' | 'l' | null;
    rowSeparatorVisibility?: TRowSeparatorVisibility;
    itemsSpacingVisibility?: TItemsSpacingVisibility;
    stickyMarkedItem?: boolean;
    stickyHeader?: boolean;
    stickyCallback?: Function;
    stickyResults?: boolean;
    theme?: string;
    style?: string;
    backgroundStyle?: TBackgroundStyle;
    footerBackgroundStyle?: TBackgroundStyle;
    hoverBackgroundStyle?: TBackgroundStyle;
    collapsedGroups?: TArrayGroupKey;
    groupProperty?: string;
    groupTemplate?: TemplateFunction;
    searchValue?: string;
    editingConfig?: any;
    unique?: boolean;
    importantItemProperties?: string[];
    itemActionsProperty?: string;
    itemActionsPosition?: TItemActionsPosition;
    navigation?: INavigationOptionValue<INavigationSourceConfig>;
    multiSelectAccessibilityProperty?: string;
    hiddenGroupPosition?: IHiddenGroupPosition;
    footerTemplate?: TemplateFunction | string;
    stickyFooter?: boolean;
    stickyGroup?: boolean;
    trackedProperties?: ITrackedPropertiesItem[];
    // todo Так делать плохо, но по другому сейчас не сделать.
    // Получится убрать при распиле коллекций и выносе вычисления классов в react-компонент.
    adaptiveMode?: AdaptiveModeType;
    // Регулирует видимость кнопки "Еще"
    moreButtonVisibility?: MoreButtonVisibility;
    validateUnique?: boolean;
    logError?: TLogError;
}

export interface ICollectionCounters {
    key: string | number;
    counters: ICollectionItemCounters;
}

export interface IViewIterator<TItem extends CollectionItem = CollectionItem> {
    each: (callback: (item: TItem, index: number) => void) => void;
    data?: object;
    isItemAtIndexHidden: Function;
    setNextIndices: Function;
    setIndices: Function;
}

export type TGroupKey = string | number;
export type TArrayGroupKey = TGroupKey[];

export interface ISwipeConfig {
    itemActionsSize?: 's' | 'm' | 'l';
    itemActions?: {
        all: any[];
        showed: any[];
    };
    paddingSize?: 's' | 'm' | 'l';
    twoColumns?: boolean;
    twoColumnsActions?: [[any, any], [any, any]];
    needTitle?: Function;
    needIcon?: Function;
}

export interface IHasMoreData {
    up: boolean;
    down: boolean;
}

/**
 * @typedef {String} TEditingMode
 * @variant row - Редактирование всей строки таблицы
 * @variant cell - Редактирование отдельных ячеек таблицы
 * @demo Controls-demo/gridNew/EditInPlace/SingleCellEditable/Index
 */

/*
 * @typedef {String} TEditingMode
 * @variant row - Editing of whole row.
 * @variant cell - Editing of separated cell.
 * @default row
 * @demo Controls-demo/gridNew/EditInPlace/SingleCellEditable/Index
 */
type TEditingMode = 'cell' | 'row';

type TSequentialEditingMode = 'row' | 'cell' | 'none';

/**
 * Конфигурация редактирования по месту
 * @typedef {Object} IEditingConfig
 * @property {TEditingMode} [mode='row'] Режим редактирования раписей в таблице.
 * @property {Boolean} [editOnClick=false] Если передано значение "true", клик по элементу списка начинает редактирование по месту.
 * @property {Boolean} [autoAdd=false] Если передано значение "true", после окончания редактирования последнего (уже сущестсвующего) элемента списка автоматически добавляется новый элемент и начинается его редактирование.
 * @property {Boolean} [autoAddByApplyButton=false] Если передано значение "true", после окончания редактирования только что добавленного элемента списка автоматически добавляется новый элемент и начинается его редактирование.
 * @property {Boolean} [sequentialEditing=true] Если передано значение "true", после окончания редактирования любого элемента списка, кроме последнего, автоматически запускается редактирование следующего элемента списка.
 * @property {TSequentialEditingMode} [sequentialEditingMode=row] Следует ли автоматически запускаеть редактирование следующего элемента списка после окончания редактирования любого элемента, кроме последнего.
 * @property {Boolean} [toolbarVisibility=false] Определяет, должны ли отображаться кнопки "Сохранить" и "Отмена".
 * @property {AddPosition} [addPosition] Позиция редактирования по месту.
 * @property {Types/entity:Record} [item=undefined] Запись, которая будет запущена на редактирование при первой отрисовке списка.
 * @property {String} [backgroundStyle=default] Предназначен для настройки фона редактируемой записи.
 */

/*
 * @typedef {Object} IEditingConfig
 * @property {TEditingMode} [mode='row'] Items editing mode.
 * @property {Boolean} [editOnClick=false] If true, click on list item starts editing in place.
 * @property {Boolean} [autoAdd=false] If true, after the end of editing of the last list item, new item adds automatically and its editing begins.
 * @property {Boolean} [toolbarVisibility=false] Determines whether buttons 'Save' and 'Cancel' should be displayed.
 * @property {AddPosition} [addPosition] Editing in place position.
 * @property {Types/entity:Record} [item=undefined] If present, editing of this item will begin on first render.
 */
export interface IEditingConfig {
    mode?: 'row' | 'cell';
    editOnClick?: boolean;
    sequentialEditing?: boolean;
    sequentialEditingMode?: TSequentialEditingMode;
    addPosition?: 'top' | 'bottom';
    item?: Model;
    autoAdd?: boolean;
    autoAddOnInit?: boolean;
    autoAddByApplyButton?: boolean;
    toolbarVisibility?: boolean;
    backgroundStyle?: string;
    applyButtonStyle?: TApplyButtonStyle;

    // Используется в новом АПИ грида
    inputBackgroundVisibility?: 'visible' | 'onhover' | 'hidden';
    inputBorderVisibility?: 'partial' | 'hidden';
}

interface IUserStrategy<S, T> {
    strategy: new (options: unknown) => IItemsStrategy<S, T>;
    options?: object;
}

/**
 * Преобразует проекцию в массив из ее элементов
 */
function toArray<S, T>(display: Collection<S>): T[] {
    const result = [];
    display.each((item) => {
        result.push(item);
    });
    return result;
}

/**
 * Нормализует массив обработчиков
 */
function normalizeHandlers<T>(handlers: T | T[]): T[] {
    if (typeof handlers === 'function') {
        return [handlers];
    }
    return handlers instanceof Array
        ? handlers.filter((item) => {
              return typeof item === 'function';
          })
        : [];
}

/**
 * Обрабатывает событие об изменении коллекции
 * @param event Дескриптор события.
 * @param action Действие, приведшее к изменению.
 * @param newItems Новые элементы коллекции.
 * @param newItemsIndex Индекс, в котором появились новые элементы.
 * @param oldItems Удаленные элементы коллекции.
 * @param oldItemsIndex Индекс, в котором удалены элементы.
 * @param reason Причина перерисовки, в качестве причины передаётся название метода, которым был изменён RecordSet.
 */
function onCollectionChange<T>(
    event: EventObject,
    action: string,
    newItems: T[],
    newItemsIndex: number,
    oldItems: T[],
    oldItemsIndex: number,
    reason: string
): void {
    let session;

    switch (action) {
        case IObservable.ACTION_RESET:
            const projectionOldItems = toArray(this);
            this._reBuild(true);
            const projectionNewItems = toArray(this);
            this._notifyBeforeCollectionChange();
            this._notifyCollectionChange(
                action,
                projectionNewItems,
                0,
                projectionOldItems,
                0,
                reason
            );
            this._handleAfterCollectionChange(undefined, action);
            this._nextVersion();
            return;

        case IObservable.ACTION_CHANGE:
            session = this._startUpdateSession();

            // FIXME: newItems.length - FIXME[OrderMatch];
            this._reGroup(newItemsIndex, newItems.length);
            this._reSort();
            this._reFilter();
            this._finishUpdateSession(session, true);
            this._notifyCollectionItemsChange(newItems, newItemsIndex, session);
            this._nextVersion();
            this._handleCollectionActionChange(newItems);
            return;
    }

    session = this._startUpdateSession();
    switch (action) {
        case IObservable.ACTION_ADD:
            this._addItems(newItemsIndex, newItems);

            this._handleCollectionChangeAdd();

            // FIXME: newItems.length - FIXME[OrderMatch]
            this._reGroup(newItemsIndex, newItems.length);
            this._reSort();
            this._reFilter();
            break;

        case IObservable.ACTION_REMOVE:
            // FIXME: oldItems.length - FIXME[OrderMatch]
            this._removeItems(oldItemsIndex, oldItems.length);

            this._handleCollectionChangeRemove();

            this._reSort();
            if (this._isFiltered()) {
                this._reFilter();
            }
            break;

        case IObservable.ACTION_REPLACE:
            // FIXME: newItems - FIXME[OrderMatch]
            this._replaceItems(newItemsIndex, newItems);

            this._handleCollectionChangeReplace();

            // FIXME: newItems.length - FIXME[OrderMatch]
            this._reGroup(newItemsIndex, newItems.length);
            this._reSort();
            this._reFilter();
            break;

        case IObservable.ACTION_MOVE:
            // FIXME: newItems - FIXME[OrderMatch]
            this._moveItems(newItemsIndex, oldItemsIndex, newItems);
            this._reSort();
            this._reFilter();
            break;
    }

    this._updateEdgeItems();
    this._finishUpdateSession(session);
    this._nextVersion();
}

/**
 * Обрабатывает событие об изменении элемента коллекции
 * @param event Дескриптор события.
 * @param item Измененный элемент коллекции.
 * @param index Индекс измененного элемента.
 * @param [properties] Изменившиеся свойства
 */
function onCollectionItemChange<T extends EntityModel>(
    event: EventObject,
    item: T,
    index: number,
    properties?: object
): void {
    if (!this.isEventRaising()) {
        return;
    }

    if (this._sourceCollectionSynchronized) {
        this._notifySourceCollectionItemChange(event, item, index, properties);
    } else {
        this._sourceCollectionDelayedCallbacks = this._sourceCollectionDelayedCallbacks || [];
        this._sourceCollectionDelayedCallbacks.push([
            this._notifySourceCollectionItemChange,
            arguments,
        ]);
    }

    this._nextVersion();

    this._handleAfterCollectionItemChange(item, index, properties);
}

/**
 * Обрабатывает событие об изменении режима генерации событий
 * @param event Дескриптор события.
 * @param enabled Включена или выключена генерация событий
 * @param analyze Включен или выключен анализ изменений
 */
function onEventRaisingChange(event: EventObject, enabled: boolean, analyze: boolean): void {
    // Если без выключили без анализа изменений, то при следующем включении генерации надо актуализировать состояние
    if (!analyze && enabled) {
        this._reBuild(true);
    }

    this._sourceCollectionSynchronized = enabled;

    // Call delayed handlers if get back to synchronize
    const callbacks = this._sourceCollectionDelayedCallbacks;
    if (this._sourceCollectionSynchronized && callbacks) {
        let callback;
        while (callbacks.length > 0) {
            callback = callbacks[0];
            callback[0].apply(this, callback[1]);
            callbacks.shift();
        }
    }
}

function onCollectionPropertyChange(
    event: EventObject,
    values: { metaData: { results?: EntityModel } }
): void {
    if (values && values.metaData) {
        this.setMetaData(values.metaData);
    }
}

function onMetaResultsChange(event: EventObject, values: Record<string, unknown>): void {
    this._setMetaResults(this.getMetaData()?.results);
}

/**
 * Adds/removes functor's properties into/out of list of important properties
 * @param func Functior to handle
 * @param add Do add or remove
 */
function functorToImportantProperties(func: Function, add: boolean): void {
    if (functor.Compute.isFunctor(func)) {
        const properties = (func as any).properties;
        for (let i = 0; i < properties.length; i++) {
            if (add) {
                this._setImportantProperty(properties[i]);
            } else {
                this._unsetImportantProperty(properties[i]);
            }
        }
    }
}

function groupingFilter(
    item: EntityModel,
    index: number,
    collectionItem: CollectionItem<EntityModel>,
    collectionIndex: number,
    hasMembers?: boolean,
    group?: GroupItem<EntityModel>
): boolean {
    return collectionItem['[Controls/_display/GroupItem]'] || !group || group.isExpanded();
}

/**
 * Проекция коллекции - предоставляет методы навигации, фильтрации и сортировки,
 * не меняя при этом оригинальную коллекцию.
 * @extends Controls/_display/Abstract
 * @implements Types/collection:IEnumerable
 * @implements Types/collection:IList
 * @mixes Types/entity:SerializableMixin
 * @mixes Types/collection:EventRaisingMixin
 * @ignoremethods notifyItemChange
 * @public
 */
export default class Collection<
        S extends EntityModel = EntityModel,
        T extends CollectionItem<S> = CollectionItem<S>
    >
    extends mixin<
        Abstract<any, any>,
        SerializableMixin,
        EventRaisingMixin,
        IndicatorsMixin,
        TriggersMixin
    >(Abstract, SerializableMixin, EventRaisingMixin, IndicatorsMixin, TriggersMixin)
    implements ICollection<S, T>, IEnumerable<T>, IList<T>
{
    /**
     * Возвращать локализованные значения
     */
    get localize(): boolean {
        return this._localize;
    }

    // endregion

    // region IEnumerable

    readonly '[Types/_collection/IEnumerable]': boolean = true;

    // endregion

    // region IList

    readonly '[Types/_collection/IList]': boolean = true;
    /**
     * @typedef {Object} UserSortItem
     * @property {Controls/_display/CollectionItem} item Элемент проекции
     * @property {*} collectionItem Элемент коллекции
     * @property {Number} index Индекс элемента проекции
     * @property {Number} collectionIndex Индекс элемента коллекции
     */

    /**
     * @event onBeforeCollectionChange Перед началом изменений коллекции
     * @name Controls/_display/Collection#onBeforeCollectionChange
     */

    /**
     * @event onAfterCollectionChange После окончания изменений коллекции
     * @name Controls/_display/Collection#onAfterCollectionChange
     */

    /**
     * @cfg Пользовательские методы фильтрации элементов проекциию. Аргументы: элемент коллекции, позиция в коллекции,
     * элемент проекции, позиция в проекции. Должен вернуть Boolean - признак, что элемент удовлетворяет условиям
     * фильтрации.
     * @name Controls/_display/Collection#filter
     * @example
     * Отберем персонажей женского пола:
     * <pre>
     *     require([
     *         'Types/_collection/List'
     *         'Controls/_display/Collection'
     *     ], function(List, CollectionDisplay) {
     *         var list = new List({
     *                 items: [
     *                     {name: 'Philip J. Fry', gender: 'M'},
     *                     {name: 'Turanga Leela', gender: 'F'},
     *                     {name: 'Professor Farnsworth', gender: 'M'},
     *                     {name: 'Amy Wong', gender: 'F'},
     *                     {name: 'Bender Bending Rodriguez', gender: 'R'}
     *                 ]
     *             }),
     *             display = new CollectionDisplay({
     *                 collection: list,
     *                 filter: function(collectionItem) {
     *                     return collectionItem.gender === 'F';
     *                 }
     *             });
     *
     *         display.each(function(item) {
     *             console.log(item.getContents().name);
     *         });
     *         //output: 'Turanga Leela', 'Amy Wong'
     *     });
     * </pre>
     * @see getFilter
     * @see setFilter
     * @see addFilter
     * @see removeFilter
     */
    protected _$filter: FilterFunction<S>[];

    /**
     * @cfg Метод группировки элементов проекции. Аргументы: элемент коллекции, позиция в коллекции, элемент проекции.
     * Должен вернуть идентификатор группы.
     * @name Controls/_display/Collection#group
     * @example
     * Сгруппируем персонажей по полу:
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var list = new collection.List({
     *             items: [
     *                 {name: 'Philip J. Fry', gender: 'M'},
     *                 {name: 'Turanga Leela', gender: 'F'},
     *                 {name: 'Professor Farnsworth', gender: 'M'},
     *                 {name: 'Amy Wong', gender: 'F'},
     *                 {name: 'Bender Bending Rodriguez', gender: 'R'}
     *             ]
     *         });
     *         var display = new display.Collection({
     *             collection: list
     *             group: function(collectionItem, index, item) {
     *                 return collectionItem.gender;
     *             }
     *         });
     *
     *         display.each(function(item, index) {
     *             if (item instanceof display.GroupItem) {
     *                 console.log('[' + item.getContents() + ']';
     *             } else {
     *                 console.log(item.getContents().name);
     *             }
     *         });
     *         //output:
     *         // '[M]', 'Philip J. Fry', 'Professor Farnsworth',
     *         // '[F]', 'Turanga Leela', 'Amy Wong',
     *         // '[R]', 'Bender Bending Rodriguez'
     *     });
     * </pre>
     * @see getGroup
     * @see setGroup
     */
    protected _$group: GroupFunction<S, T>;

    /**
     * @cfg Пользовательские методы сортировки элементов. Аргументы: 2 объекта типа {@link UserSortItem},
     * должен вернуть -1|0|1 (см. Array.prototype.sort())
     * @name Controls/_display/Collection#sort
     * @example
     * Отсортируем коллекцию по возрастанию значения поля title:
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var display = new display.Collection({
     *             collection: new collection.List({
     *                 items: [
     *                     {id: 1, title: 'foo'},
     *                     {id: 2, title: 'bar'}
     *                 ]
     *             }),
     *             sort: function(a, b) {
     *                 return a.collectionItem.title - b.collectionItem.title;
     *             }
     *         });
     *
     *         display.each(function(item) {
     *             console.log(item.getContents().title;
     *         });
     *         //output: 'bar', 'foo'
     *     });
     * </pre>
     * @see getSort
     * @see setSort
     * @see addSort
     * @see removeSort
     */
    protected _$sort: SortFunction<S, T>[];

    protected _$displayProperty: string;

    protected _$itemTemplateProperty: string;

    protected _$itemsDragNDrop: boolean;

    protected _$multiSelectVisibility: string;

    protected _$multiSelectPosition: 'default' | 'custom';

    protected _$multiSelectTemplate: TemplateFunction | string;

    protected _$footerTemplate: TemplateFunction | string;

    protected _$stickyFooter: boolean;

    protected _$stickyCallback: Function;

    /**
     * Задает доступность чекбокса
     * @protected
     */
    protected _$multiSelectAccessibilityProperty: string;

    protected _$leftPadding: string;

    protected _$rightPadding: string;

    protected _$topPadding: string;

    protected _$bottomPadding: string;

    protected _$itemsSpacing: TOffsetSize;

    protected _$roundBorder: IRoundBorder;

    protected _$itemTemplateOptions: object;

    // До https://online.sbis.ru/opendoc.html?guid=75486181-2f75-4fa6-bd74-79e475f618b9
    protected _$task1184913014: boolean;

    protected _$directionality: string;

    protected _emptyTemplateItem: EmptyTemplateItem;

    protected _$emptyTemplate: TemplateFunction;

    protected _$emptyTemplateOptions: object;

    protected _$theme: string;

    protected _$hoverBackgroundStyle: string;

    protected _$searchValue: string;

    protected _$rowSeparatorSize: string;

    protected _$rowSeparatorVisibility: TRowSeparatorVisibility;

    protected _$itemsSpacingVisibility: TItemsSpacingVisibility;

    protected _$stickyMarkedItem: boolean;

    protected _$stickyHeader: boolean;

    protected _$stickyResults: boolean;

    protected _$stickyGroup: boolean;

    protected _$editingConfig: IEditingConfig;

    protected _$virtualScrolling: boolean;

    protected _$hasMoreData: IHasMoreData;

    protected _$metaResults: EntityModel;

    protected _$collapsedGroups: TArrayGroupKey;

    protected _$hiddenGroupPosition: IHiddenGroupPosition;

    protected _$groupViewMode: string;

    protected _$groupProperty: string;

    protected _$groupingKeyCallback?: GroupFunction<S, T>;

    protected _$compatibleReset: boolean;

    protected _$stickyItemActions: boolean;

    protected _$itemActionsProperty: string;

    protected _$style: string;

    protected _$itemActionsPosition: TItemActionsPosition;

    protected _$itemActionsVisibility: TItemActionsVisibility;

    protected _$navigation: INavigationOptionValue;

    protected _$fadedKeys: CrudEntityKey[];

    protected _$adaptiveMode: AdaptiveModeType;

    /**
     * @cfg {Boolean} Обеспечивать уникальность элементов (элементы с повторяющимися идентфикаторами будут
     * игнорироваться). Работает только если задано {@link keyProperty}.
     * @name Controls/_display/Collection#unique
     */
    protected _$unique: boolean;
    /**
     * Обеспечивает валидацию уникальности ключей элементов.
     * Если коллекция содержит дубли, то будем логировать ошибку.
     * @remark Сделать безусловно не получается, т.к. падают сотни тестов.
     * @protected
     */
    protected _$validateUnique: boolean;

    /**
     * Метод для корректного вывода сообщений об ошибках, возникших в коллекции.
     * @protected
     */
    protected _$logError: TLogError;

    /**
     * @cfg {Array.<String>} Названия свойств элемента коллекции, от которых зависят фильтрация, сортировка, группировка.
     * @name Controls/_display/Collection#importantItemProperties
     * @remark
     * Изменение любого из указанных свойств элемента коллекции приведет к перерасчету фильтрации, сортировки и
     * группировки.
     */
    protected _$importantItemProperties: string[];

    /**
     * Режим отображения кнопки "Ещё"
     */
    protected _$moreButtonVisibility: MoreButtonVisibility;

    /**
     * Отслеживаемые свойства записей
     */
    protected _$trackedProperties: ITrackedPropertiesItem[];

    /**
     * Значения отслеживаемые свойств записей
     */
    protected _trackedValues: Record<string, string>;

    /**
     * Видимость отслеживаемых свойств
     */
    protected _trackedValuesVisible: boolean;

    /**
     * Возвращать локализованные значения для типов, поддерживающих локализацию
     */
    protected _localize: boolean;

    /**
     * Тип элемента проекции
     */
    protected _itemModule: string | Function;
    protected _spaceItemModule: string;

    /**
     * Фабрика элементов проекции
     */
    protected _itemsFactory: ItemsFactory<T>;

    /**
     * Элемент -> уникальный идентификатор
     */
    protected _itemToUid: Map<T, string> = new Map();

    /**
     * Уникальные идентификаторы элементов
     */
    protected _itemsUid: Set<string> = new Set();

    /**
     * Компоновщик стратегий
     */
    protected _composer: ItemsStrategyComposer<S, T>;

    /**
     * Коллекция синхронизирована с проекцией (все события, приходящие от нее, соответсвуют ее состоянию)
     */
    protected _sourceCollectionSynchronized: boolean;

    /**
     * Обработчики событий коллекции, отложенные до момента синхронизации
     */
    protected _sourceCollectionDelayedCallbacks: Function[];

    /**
     * Результат применения фильтра: индекс элемента проекции -> прошел фильтр
     */
    protected _filterMap: boolean[] = [];

    /**
     * Результат применения сортировки: индекс после сортировки -> индекс элемента проекции
     */
    protected _sortMap: number[] = [];

    /**
     * Служебный энумератор для организации курсора
     */
    protected _cursorEnumerator: CollectionEnumerator<T>;

    /**
     * Служебный энумератор для поиска по свойствам и поиска следующего или предыдущего элемента относительно заданного
     */
    protected _utilityEnumerator: CollectionEnumerator<T>;

    /**
     * Обработчик события об изменении коллекции
     */
    protected _onCollectionChange: Function;

    /**
     * Обработчик события об изменении свойства в коллекции
     */
    protected _onCollectionPropertyChange: Function;

    /**
     * Обработчик события об изменении результатов из мета данных коллекции
     */
    protected _onMetaResultsChange: Function;

    /**
     * Обработчик события об изменении элемента коллекции
     */
    protected _onCollectionItemChange: Function;

    /**
     * Обработчик события об изменении генерации событий коллекции
     */
    protected _oEventRaisingChange: Function;

    /**
     * Отключение группировки, когда она не поддерживается.
     * @protected
     */
    protected _disableSupportsGrouping: boolean;

    /**
     * Отключение стратегии отступов, когда она не поддерживается.
     * @protected
     */
    protected _supportItemsSpacing: boolean;
    protected _viewIterator: IViewIterator<T>;

    protected _actionsMenuConfig: any;
    protected _actionsTemplateConfig: IItemActionsTemplateConfig;
    protected _swipeConfig: ISwipeConfig;

    protected _hoveredItem: T;

    /**
     * Модель заголовка футера списка
     */
    protected _footer: Footer;

    /**
     * ссылка на текущий активный Item
     */
    protected _$activeItem: T;

    protected _$isEditing: boolean = false;

    protected _userStrategies: IUserStrategy<S, T>[];

    protected _dragStrategy: StrategyConstructor<DragStrategy> = DragStrategy;
    protected _isDragOutsideList: boolean = false;

    // Фон застиканных записей и лесенки
    protected _$backgroundStyle?: string;
    protected _$footerBackgroundStyle?: string;
    protected _$fixedBackgroundStyle?: string;

    protected _animationItemModule: typeof CollectionItem = AnimatedItem;

    private _firstItem: CollectionItem;

    private _lastItem: CollectionItem;

    constructor(options: IOptions<S, T>) {
        super(options);
        EventRaisingMixin.initMixin(this);

        this._$navigation = options.navigation;
        this._$sort = this._$sort || [];
        this._$importantItemProperties = this._$importantItemProperties || [];

        this._initializeGrouping(options);

        if (options.itemTemplateProperty) {
            this._$itemTemplateProperty = options.itemTemplateProperty;
        }

        if (!options.hoverBackgroundStyle && options.style) {
            this._$hoverBackgroundStyle = options.style;
        }

        this._$collapsedGroups = options.collapsedGroups;

        if (options.rowSeparatorSize) {
            this._$rowSeparatorSize = options.rowSeparatorSize;
        }

        if (options.stickyMarkedItem !== undefined) {
            this._$stickyMarkedItem = options.stickyMarkedItem;
        }

        if (options.stickyHeader !== undefined) {
            this._$stickyHeader = options.stickyHeader;
        }

        if (options.stickyResults !== undefined) {
            this._$stickyResults = options.stickyResults;
        }

        if (options.trackedProperties !== undefined) {
            this._$trackedProperties = this._fixTrackedProperties(options.trackedProperties);
        }

        // Если опция stickyGroup задана, то запоминаем её значение.
        // В противном случае синхронизируем её со значением stickyHeader дабы сохранить старую логику, т.к.
        // раньше прилипание заголовков групп в прямую зависело от того прилипает ли шапка.
        this._$stickyGroup =
            options.stickyGroup !== undefined ? options.stickyGroup : this._$stickyHeader;

        this._$metaResults = this.getMetaData().results;

        this._initializeFilter(this._$filter);
        this._$sort = normalizeHandlers(this._$sort);

        // FIXME: метод для поддержания совместимости с ModerDialog при внедрении. Должен быть удален.
        //  Убрать по задаче https://online.sbis.ru/opendoc.html?guid=7a607ef8-f2bc-461f-9de8-a97e14af88cb
        if (options.itemsFilterMethod) {
            this._setItemsFilterMethod(this._$filter, options.itemsFilterMethod);
        }

        if (this.getKeyProperty()) {
            this._setImportantProperty(this.getKeyProperty());
        }

        this._publish(
            'onCurrentChange',
            'onCollectionChange',
            'onBeforeCollectionChange',
            'onAfterCollectionChange'
        );

        this._switchImportantPropertiesByUserSort(true);
        this._switchImportantPropertiesByGroup(true);

        this._initializeUserStrategies();

        this._bindHandlers();
        this._initializeCollection();

        this._setDefaultViewIterator();

        if (options.itemPadding) {
            this._setItemPadding(options.itemPadding, true);
        }

        if (this._isGrouped()) {
            // TODO What's a better way of doing this?
            this.addFilter(groupingFilter);
        }

        this._footer = this._initializeFooter(options);

        this._updateEdgeItems(true, true);
    }

    private _getUserStrategies(): IUserStrategy<S, T>[] {
        if (!this._userStrategies) {
            this._initializeUserStrategies();
        }
        return this._userStrategies;
    }

    private _initializeSpacingStrategy() {
        if (this._$itemsSpacing && this._supportItemsSpacing !== false) {
            this._composer.append(ItemsSpacingStrategy, {
                display: this,
                spaceItemFactory: this._spaceItemFactory.bind(this),
                itemsSpacingVisibility: this._$itemsSpacingVisibility,
            });
        }
    }

    protected _initializeUserStrategies(): void {
        this._userStrategies = [];
    }

    protected _initializeFilter(userFilter?: FilterFunction<S, T>[]): void {
        this._$filter = normalizeHandlers(userFilter);
        this._$filter.push(this._getCollectionFilter());
    }

    protected _getCollectionFilter(): FilterFunction<S, T> {
        return () => {
            return true;
        };
    }

    private _initializeCollection(): void {
        this._reBuild(true);
        if (this.getSourceCollection()['[Types/_collection/IObservable]']) {
            this.getSourceCollection().subscribe('onCollectionChange', this._onCollectionChange);
            this.getSourceCollection().subscribe(
                'onCollectionItemChange',
                this._onCollectionItemChange
            );

            // Подписка на onPropertyChange коллекции для отслеживания установки/удаления/изменения метаданных.
            // Метаданные нужны списку для отображения результатов.
            // Результаты в метаданных должны быть заданы в формате Types/entity:Model, за изменение модели тоже
            // необходимо следить.
            this.getSourceCollection().subscribe(
                'onPropertyChange',
                this._onCollectionPropertyChange
            );

            this._actualizeSubscriptionOnMetaResults(null, this._$metaResults);
        }
        if (this.getSourceCollection()['[Types/_entity/EventRaisingMixin]']) {
            this.getSourceCollection().subscribe('onEventRaisingChange', this._oEventRaisingChange);
        }
    }

    private _deinitializeCollection(): void {
        if (!(this.getSourceCollection() as DestroyableMixin).destroyed) {
            if (this.getSourceCollection()['[Types/_collection/IObservable]']) {
                this.getSourceCollection().unsubscribe(
                    'onCollectionChange',
                    this._onCollectionChange
                );
                this.getSourceCollection().unsubscribe(
                    'onCollectionItemChange',
                    this._onCollectionItemChange
                );
                this.getSourceCollection().unsubscribe(
                    'onPropertyChange',
                    this._onCollectionPropertyChange
                );

                this._actualizeSubscriptionOnMetaResults(this._$metaResults, null);
            }
            if (this.getSourceCollection()['[Types/_entity/EventRaisingMixin]']) {
                this.getSourceCollection().unsubscribe(
                    'onEventRaisingChange',
                    this._oEventRaisingChange
                );
            }
        }
    }

    setCollection(newCollection: ISourceCollection<S>): void {
        const projectionOldItems = toArray(this) as [];
        this._deinitializeCollection();
        super.setCollection(newCollection);
        this.setMetaData(this.getMetaData());
        this._initializeCollection();
        const projectionNewItems = toArray(this) as [];
        this._notifyBeforeCollectionChange();
        this._notifyCollectionChange(
            IObservable.ACTION_RESET,
            projectionNewItems,
            0,
            projectionOldItems,
            0
        );
        this._handleAfterCollectionChange(undefined, IObservable.ACTION_RESET);
        this._nextVersion();
    }

    destroy(): void {
        this._getItems().forEach((item: T) => {
            return item.destroy();
        });

        this._deinitializeCollection();
        this._unbindHandlers();
        // Удаляем итератор со всеми его методами, которые биндят коллекцию.
        this._resetViewIterator();
        this._composer = null;
        this._filterMap = [];
        this._sortMap = [];
        this._itemToUid = null;
        this._itemsUid = null;
        this._cursorEnumerator = null;
        this._utilityEnumerator = null;
        this._userStrategies = null;
        this._$metaResults = null;

        super.destroy();
    }

    // region mutable

    /**
     * Возвращает элемент проекции с указанным идентификатором экземпляра.
     * @param {String} instanceId Идентификатор экземпляра.
     * @return {Controls/_display/CollectionItem}
     * @state mutable
     */
    getByInstanceId(instanceId: string): T {
        return this.at(this._getUtilityEnumerator().getIndexByValue('instanceId', instanceId));
    }

    /**
     * Возвращает индекс элемента проекции с указанным идентификатором экземпляра.
     * @param {String} instanceId Идентификатор экземпляра.
     * @return {Number}
     * @state mutable
     */
    getIndexByInstanceId(instanceId: string): number {
        return this._getUtilityEnumerator().getIndexByValue('instanceId', instanceId);
    }

    /**
     * Возвращает парамметры для навигации
     * @return {INavigationOptionValue}
     */
    getNavigation(): INavigationOptionValue {
        return this._$navigation;
    }

    /**
     * Возвращает энумератор для перебора элементов проекции
     * @return {Controls/_display/CollectionEnumerator}
     */
    getEnumerator(localize?: boolean): CollectionEnumerator<T> {
        return this._getEnumerator() as any;
    }

    /**
     * Перебирает все элементы проекции, начиная с первого.
     * @param {Function(Controls/_display/CollectionItem, Number)} callback Ф-я обратного вызова для каждого элемента
     * коллекции (аргументами придут элемент коллекции и его порядковый номер)
     * @param {Object} [context] Контекст вызова callback
     * @example
     * Сгруппируем персонажей по полу:
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var list = new collection.List({
     *             items: [
     *                 {name: 'Philip J. Fry', gender: 'M'},
     *                 {name: 'Turanga Leela', gender: 'F'},
     *                 {name: 'Professor Farnsworth', gender: 'M'},
     *                 {name: 'Amy Wong', gender: 'F'},
     *                 {name: 'Bender Bending Rodriguez', gender: 'R'}
     *             ]
     *         });
     *         var display = new display.Collection({
     *             collection: list
     *         });
     *
     *         display.setGroup(function(collectionItem, index, item) {
     *             return collectionItem.gender;
     *         });
     *
     *         display.each(function(item, index) {
     *             if (item['[Controls/_display/GroupItem]']) {
     *                 console.log('[' + item.getContents() + ']');
     *             } else {
     *                 console.log(item.getContents().name);
     *             }
     *         });
     *         //output:
     *         // '[M]', 'Philip J. Fry', 'Professor Farnsworth',
     *         // '[F]', 'Turanga Leela', 'Amy Wong',
     *         // '[R]', 'Bender Bending Rodriguez'
     *     });
     * </pre>
     */
    each(callback: EnumeratorCallback<T>, context?: object): void {
        const enumerator = this.getEnumerator();
        let index;
        while (enumerator.moveNext()) {
            index = enumerator.getCurrentIndex();
            callback.call(context, enumerator.getCurrent(), index);
        }
    }

    find(predicate: (item: T) => boolean): T {
        const enumerator = this.getEnumerator();
        while (enumerator.moveNext()) {
            const current = enumerator.getCurrent();
            if (predicate(current)) {
                return current;
            }
        }
        return null;
    }

    assign(): void {
        throw new Error(MESSAGE_READ_ONLY);
    }

    append(): void {
        throw new Error(MESSAGE_READ_ONLY);
    }

    prepend(): void {
        throw new Error(MESSAGE_READ_ONLY);
    }

    clear(): void {
        throw new Error(MESSAGE_READ_ONLY);
    }

    add(): void {
        throw new Error(MESSAGE_READ_ONLY);
    }

    at(index: number): T {
        return this._getUtilityEnumerator().at(index) as any;
    }

    remove(): boolean {
        throw new Error(MESSAGE_READ_ONLY);
    }

    removeAt(): T {
        throw new Error(MESSAGE_READ_ONLY);
    }

    replace(): T {
        throw new Error(MESSAGE_READ_ONLY);
    }

    move(): void {
        throw new Error(MESSAGE_READ_ONLY);
    }

    getIndex(item: T): number {
        if (!(item instanceof CollectionItem)) {
            return -1;
        }
        return this.getIndexByInstanceId(item.getInstanceId());
    }

    getStartIndex(): number {
        return VirtualScrollController.getStartIndex(this as unknown as IVirtualScrollCollection);
    }

    getStopIndex(): number {
        return VirtualScrollController.getStopIndex(this as unknown as IVirtualScrollCollection);
    }

    getNextStartIndex(): number {
        return VirtualScrollController.getNextStartIndex(
            this as unknown as IVirtualScrollCollection
        );
    }

    getNextStopIndex(): number {
        return VirtualScrollController.getNextStopIndex(
            this as unknown as IVirtualScrollCollection
        );
    }

    /**
     * Возвращает количество элементов проекции.
     * @param {Boolean} [skipGroups=false] Не считать группы
     * @return {Number}
     */
    getCount(skipGroups?: boolean): number {
        let count = 0;
        if (skipGroups && this._isGrouped()) {
            this.each((item) => {
                if (!item['[Controls/_display/GroupItem]']) {
                    count++;
                }
            });
        } else {
            count = this._getUtilityEnumerator().getCount();
        }
        return count;
    }

    // endregion

    // region Public

    // region Access

    getAdaptiveMode(): AdaptiveModeType {
        return this._$adaptiveMode;
    }

    /**
     * Возвращает элементы проекции (без учета сортировки, фильтрации и группировки).
     * @return {Array<Controls/_display/CollectionItem>}
     */
    getItems(): T[] {
        return this._getItems().slice();
    }

    /**
     * Создает элемент проекции
     * @param {Object} options Значения опций
     * @return {Controls/_display/CollectionItem}
     */
    createItem(options: ICollectionItemOptions): T {
        if (!this._itemsFactory) {
            this._itemsFactory = this._getItemsFactory().bind(this);
        }

        return this._itemsFactory(options);
    }

    /**
     * Возвращает псевдоуникальный идентификатор элемента коллекции, основанный на значении опции
     * {@link Controls/_display/CollectionItem#contents}.
     * @param {Controls/_display/CollectionItem} item Элемент коллекции
     * @return {String|undefined}
     */
    getItemUid(item: T): string {
        const itemToUid = this._itemToUid;
        if (itemToUid.has(item)) {
            return itemToUid.get(item);
        }

        let uid = this._extractItemId(item);
        uid = this._searchItemUid(item, uid);

        itemToUid.set(item, uid);

        return uid;
    }

    // endregion Access

    // region Navigation

    /**
     * Возвращает первый элемент
     * @param conditionProperty свойство, по которому происходит отбор элементов.
     * @return {Controls/_display/CollectionItem}
     */
    getFirst(conditionProperty?: string): T {
        const enumerator = this._getUtilityEnumerator();
        if (enumerator.getCount() === 0) {
            return;
        }
        enumerator.setPosition(0);

        const item = enumerator.getCurrent();

        if (conditionProperty && !item[conditionProperty]) {
            return this._getNearbyItem(enumerator, item, true, conditionProperty);
        }

        enumerator.reset();
        return item;
    }

    /**
     * Возвращает последний элемент
     * @param conditionProperty свойство, по которому происходит отбор элементов.
     * @return {Controls/_display/CollectionItem}
     */
    getLast(conditionProperty?: string): T {
        const enumerator = this._getUtilityEnumerator();
        if (enumerator.getCount() === 0) {
            return;
        }
        const lastIndex = enumerator.getCount() - 1;

        if (lastIndex === -1) {
            return;
        }

        enumerator.setPosition(lastIndex);
        const item = enumerator.getCurrent();

        if (conditionProperty && !item[conditionProperty]) {
            return this._getNearbyItem(enumerator, item, false, conditionProperty);
        }

        enumerator.reset();
        return item;
    }

    /**
     * Возвращает следующий элемент относительно item
     * @param {Controls/_display/CollectionItem} item элемент проекции
     * @return {Controls/_display/CollectionItem}
     */
    getNext(item: T): T {
        return this._getNearbyItem(this._getUtilityEnumerator(), item, true, 'EnumerableItem');
    }

    /**
     * Возвращает предыдущий элемент относительно item
     * @param {Controls/_display/CollectionItem} item элемент проекции
     * @return {Controls/_display/CollectionItem}
     */
    getPrevious(item: T): T {
        return this._getNearbyItem(this._getUtilityEnumerator(), item, false, 'EnumerableItem');
    }

    // endregion Navigation

    // region GetItem

    /**
     * @param key
     * @param [withFilter=true] Учитывать {@link setFilter фильтр}
     */
    getItemBySourceKey(key: string | number | CrudEntityKey, withFilter: boolean = true): T {
        if (!this.getSourceCollection()['[Types/_collection/RecordSet]']) {
            // В composite:View вложенные списке не на рекордсете
            return this.find((item) => {
                return item.key === key;
            });
        }

        if (key === undefined) {
            return null;
        }

        const sourceItem = this.getSourceDataStrategy().getSourceItemByKey(key);
        if (!sourceItem) {
            // Если записи нет в наборе данных, то требуется найти добавляемую запись, группу, футер узла и т.д.
            return this.find((item) => {
                return item.key === key;
            });
        }

        if (withFilter) {
            return this.getItemBySourceItem(sourceItem as unknown as S);
        }

        const items = this._getItems();
        // Ищем по getOriginalContents, т.к. в режиме редактирования getContents, вернет нам
        // инстанс редактируемой записи, а не исходной
        return items.find((it) => {
            return it.getOriginalContents() === sourceItem;
        });
    }

    getIndexByKey(key: string | number): number {
        return this.getIndex(this.getItemBySourceKey(key) as T);
    }

    /**
     * Возвращает индекс элемента в коллекции по его индексу в проекции
     * @param {Number} index Индекс элемента в проекции
     * @return {Number} Индекс элемента в коллекции
     */
    getSourceIndexByIndex(index: number): number {
        let sourceIndex = this._getUtilityEnumerator().getSourceByInternal(index);
        sourceIndex = sourceIndex === undefined || sourceIndex === null ? -1 : sourceIndex;
        return this._getSourceIndex(sourceIndex);
    }

    /**
     * Возвращает индекс элемента проекции в коллекции
     * @param {Controls/_display/CollectionItem} item Элемент проекции
     * @return {Number} Индекс элемента проекции в коллекции
     */
    getSourceIndexByItem(item: T): number {
        const index = this.getIndex(item as any);
        return index === -1 ? -1 : this.getSourceIndexByIndex(index);
    }

    /**
     * Возвращает индекс элемента в проекции по индексу в коллекции
     * @param {Number} index Индекс элемента в коллекции
     * @return {Number} Индекс элемента в проекции
     */
    getIndexBySourceIndex(index: number): number {
        index = this._getItemIndex(index);
        const itemIndex = this._getUtilityEnumerator().getInternalBySource(index);

        return itemIndex === undefined || itemIndex === null ? -1 : itemIndex;
    }

    /**
     * Возвращает позицию элемента коллекции в проекции.
     * @param {*} item Элемент коллекции
     * @return {Number} Позиция элемента в проекции или -1, если не входит в проекцию
     */
    getIndexBySourceItem(item: S): number {
        if (!item) {
            return -1;
        }

        let sourceIndex = -1;

        const collection = this.getSourceCollection();
        if (collection && collection['[Types/_collection/IList]']) {
            sourceIndex = this.getSourceDataStrategy().getSourceIndexBySourceItem(item);

            // Если записи нет в наборе данных, то, возможно запрашивается индекс добавляемой в данный момент записи.
            // Такой записи еще нет в наборе данных.
            if (sourceIndex === -1 && this._$isEditing) {
                this.each((el, index: number) => {
                    if (el.isEditing() && el.isAdd && el.contents.getKey() === item.getKey()) {
                        sourceIndex = index;
                    }
                });
                return sourceIndex;
            }
        } else {
            let index = 0;
            (collection as IEnumerable<S>).each(
                (value) => {
                    if (sourceIndex === -1 && value === item) {
                        sourceIndex = index;
                    }
                    index++;
                },
                this,
                this._localize
            );
        }
        return sourceIndex === -1 ? -1 : this.getIndexBySourceIndex(sourceIndex);
    }

    /**
     * Возвращает элемент проекции по индексу коллекции.
     * @param {Number} index Индекс элемента в коллекции
     * @return {Controls/_display/CollectionItem} Элемент проекции или undefined, если index не входит в проекцию
     */
    getItemBySourceIndex(index: number): T {
        index = this.getIndexBySourceIndex(index);
        return index === -1 ? undefined : this.at(index);
    }

    /**
     * Возвращает элемент проекции для элемента коллекции.
     * @param {*} item Элемент коллекции
     * @return {Controls/_display/CollectionItem} Элемент проекции или undefined, если item не входит в проекцию
     */
    getItemBySourceItem(item: S): T {
        const index = this.getIndexBySourceItem(item);
        return index === -1 ? undefined : this.at(index);
    }

    getSourceItemByKey(key: string | number): S {
        return this.getSourceDataStrategy().getSourceItemByKey(key) as unknown as S;
    }

    getSourceItemBySourceIndex(index: number): S {
        return this.getSourceDataStrategy().getSourceItemBySourceIndex(index) as unknown as S;
    }

    getSourceCollectionCount(): number {
        return this.getSourceDataStrategy().getCount();
    }

    // endregion GetItem

    // region Changing

    /**
     * Возвращает пользовательские методы фильтрации элементов проекции
     * @see filter
     * @see setFilter
     * @see addFilter
     * @see removeFilter
     */
    getFilter(): FilterFunction<S>[] {
        return this._$filter.slice();
    }

    getFilterMap(): boolean[] {
        return this._filterMap;
    }

    /**
     * Устанавливает пользовательские методы фильтрации элементов проекции. Вызов метода без аргументов приведет к
     * удалению всех пользовательских фильтров.
     * @param filters Методы фильтрации
     * элементов: аргументами приходят элемент коллекции, позиция в коллекции, элемент проекции, позиция в проекции.
     * Должен вернуть Boolean - признак, что элемент удовлетворяет условиям фильтрации.
     * @see filter
     * @see getFilter
     * @see addFilter
     * @see removeFilter
     * @example
     * Отберем персонажей женского пола:
     * <pre>
     *     require([
     *         'Types/collection'
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var list = new collection.List({
     *                 items: [
     *                     {name: 'Philip J. Fry', gender: 'M'},
     *                     {name: 'Turanga Leela', gender: 'F'},
     *                     {name: 'Professor Farnsworth', gender: 'M'},
     *                     {name: 'Amy Wong', gender: 'F'},
     *                     {name: 'Bender Bending Rodriguez', gender: 'R'}
     *                 ]
     *             }),
     *             display = new display.Collection({
     *                 collection: list
     *             });
     *
     *         display.setFilter(function(collectionItem, index, item) {
     *             return collectionItem.gender === 'F';
     *         });
     *
     *         display.each(function(item) {
     *             console.log(item.getContents().name);
     *         });
     *         //output: 'Turanga Leela', 'Amy Wong'
     *     });
     * </pre>
     */
    setFilter(...args: FilterFunction<S>[]): void {
        let filters;
        if (args[0] instanceof Array) {
            filters = args[0];
        } else {
            filters = args;
        }

        if (this._$filter.length === filters.length) {
            let changed = false;
            for (let i = 0; i < filters.length; i++) {
                if (this._$filter[i] !== filters[i]) {
                    changed = true;
                    break;
                }
            }

            if (!changed) {
                return;
            }
        }

        this._$filter = filters.filter((item) => {
            return typeof item === 'function';
        });

        const session = this._startUpdateSession();
        this._reFilter();
        this._finishUpdateSession(session);
        this._nextVersion();
    }

    /**
     * Добавляет пользовательский метод фильтрации элементов проекции, если такой еще не был задан.
     * @param filter Метод фильтрации элементов:
     * аргументами приходят элемент коллекции, позиция в коллекции, элемент проекции, позиция в проекции. Должен вернуть
     * Boolean - признак, что элемент удовлетворяет условиям фильтрации.
     * @param [at] Порядковый номер метода (если не передан, добавляется в конец)
     * @param reFilter
     * @see filter
     * @see getFilter
     * @see setFilter
     * @see removeFilter
     * @example
     * Отберем персонажей женского пола:
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var list = new collection.List({
     *                 items: [
     *                     {name: 'Philip J. Fry', gender: 'M'},
     *                     {name: 'Turanga Leela', gender: 'F'},
     *                     {name: 'Professor Farnsworth', gender: 'M'},
     *                     {name: 'Amy Wong', gender: 'F'},
     *                     {name: 'Bender Bending Rodriguez', gender: 'R'}
     *                 ]
     *             }),
     *             display = new display.Collection({
     *                 collection: list
     *             });
     *
     *         display.addFilter(function(collectionItem, index, item) {
     *             return collectionItem.gender === 'F';
     *         });
     *
     *         display.each(function(item) {
     *             console.log(item.getContents().name);
     *         });
     *         //output: 'Turanga Leela', 'Amy Wong'
     *     });
     * </pre>
     */
    addFilter(filter: FilterFunction<S>, at?: number, reFilter: boolean = true): void {
        if (this._$filter.indexOf(filter) > -1) {
            return;
        }
        if (at === undefined) {
            this._$filter.push(filter);
        } else {
            this._$filter.splice(at, 0, filter);
        }

        if (reFilter) {
            const session = this._startUpdateSession();
            this._reFilter();
            this._finishUpdateSession(session);
        }
        this._nextVersion();
    }

    /**
     * Удаляет пользовательский метод фильтрации элементов проекции.
     * @param filter Метод фильтрации элементов:
     * аргументами приходят элемент коллекции, позиция в коллекции, элемент проекции, позиция в проекции. Должен вернуть
     * Boolean - признак, что элемент удовлетворяет условиям фильтрации.
     * @return Был ли установлен такой метод фильтрации
     * @see filter
     * @see getFilter
     * @see setFilter
     * @see addFilter
     * @example
     * Уберем фильтрацию персонажей по полу:
     * <pre>
     *     require([
     *         'Types/collection'
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var filter = function(collectionItem, index, item) {
     *                 return collectionItem.gender === 'F';
     *             }),
     *             list = new collection.List({
     *                 items: [
     *                     {name: 'Philip J. Fry', gender: 'M'},
     *                     {name: 'Turanga Leela', gender: 'F'},
     *                     {name: 'Professor Farnsworth', gender: 'M'},
     *                     {name: 'Amy Wong', gender: 'F'},
     *                     {name: 'Bender Bending Rodriguez', gender: 'R'}
     *                 ]
     *             }),
     *             display = new display.Collection({
     *                 collection: list,
     *                 filter: filter
     *             });
     *
     *         display.each(function(item) {
     *             console.log(item.getContents().name);
     *         });
     *         //output: 'Turanga Leela', 'Amy Wong'
     *
     *         display.removeFilter(filter);
     *
     *         display.each(function(item) {
     *             console.log(item.getContents().name);
     *         });
     *         //output: 'Philip J. Fry', 'Turanga Leela', 'Professor Farnsworth', 'Amy Wong', 'Bender Bending Rodriguez'
     *     });
     * </pre>
     */
    removeFilter(filter: FilterFunction<S>, reFilter: boolean = true): boolean {
        const at = this._$filter.indexOf(filter);
        if (at === -1) {
            return false;
        }

        this._$filter.splice(at, 1);

        if (reFilter) {
            const session = this._startUpdateSession();
            this._reFilter();
            this._finishUpdateSession(session);
        }
        this._nextVersion();

        return true;
    }

    setGroupProperty(groupProperty: string): boolean {
        // todo Сейчас группировка не поддержана для Columns/View. Будем делать поддержку по результатам поручения:
        // https://online.sbis.ru/opendoc.html?guid=37b14566-12c3-44ed-ac0b-0cd7e0ae5c9d
        if (this._disableSupportsGrouping) {
            return;
        }
        if (this._$groupProperty !== groupProperty && groupProperty !== undefined) {
            this._$groupProperty = groupProperty;
            const groupCallback = this._createGroupFunctor();
            this.setGroup(this._$groupProperty ? groupCallback : null);
            this._nextVersion();
            return true;
        }
        return false;
    }

    private _createGroupFunctor(): GroupFunction<S, T> {
        return functor.Compute.create(
            (item) => {
                const group = item.get(this._$groupProperty);
                if (group === undefined) {
                    Logger.error(
                        `Значение поля ${this._$groupProperty} не может быть undefined. ` +
                            `Проверьте запись с ключом ${item.get(this.getKeyProperty())}`,
                        this
                    );
                }
                return group;
            },
            [this._$groupProperty]
        );
    }

    getGroupProperty(): string {
        return this._$groupProperty;
    }

    getGroupViewMode(): TGroupViewMode {
        return this._$groupViewMode;
    }

    setGroupViewMode(groupViewMode: string): void {
        if (this._$groupViewMode !== groupViewMode) {
            this._$groupViewMode = groupViewMode;
        }
    }

    protected _getGroupItemConstructor(): new () => GroupItem<T> {
        return GroupItem;
    }

    protected _hasStickyGroup(): boolean {
        return !!(this.at(0) && this.at(0)['[Controls/_display/GroupItem]'] && this._$stickyGroup);
    }

    getAdditionalGroupConstructorParams(): object {
        return {
            multiSelectVisibility: this.getMultiSelectVisibility(),
            itemTemplateOptions: this._$itemTemplateOptions,
            backgroundStyle: this.getBackgroundStyle(),
            metaResults: this.getMetaResults(),
            task1184913014: this._$task1184913014,
            directionality: this._$directionality,
        };
    }

    /**
     * Возвращает метод группировки элементов проекции
     * @see group
     * @see setGroup
     */
    getGroup(): GroupFunction<S, T> {
        return this._$group;
    }

    /**
     * Устанавливает метод группировки элементов проекции. Для сброса ранее установленной группировки следует вызвать
     * этот метод без параметров.
     * @param group Метод группировки элементов:
     * аргументами приходят элемент коллекции, его позиция, элемент проекции. Должен вернуть String|Number - группу,
     * в которую входит элемент.
     * @see group
     * @see getGroup
     */
    setGroup(group?: GroupFunction<S, T>): void {
        // Группировка не поддерживвается в горизонтальной плитке
        if (this._disableSupportsGrouping) {
            return;
        }
        if (this._$group === group) {
            return;
        }

        this._switchImportantPropertiesByGroup(false);

        if (!!group) {
            this.addFilter(groupingFilter);
        } else {
            this.removeFilter(groupingFilter);
        }

        if (!this._composer) {
            this._$group = group;
            if (!!group) {
                this._switchImportantPropertiesByGroup(true);
            }
            return;
        }

        const session = this._startUpdateSession();
        this._$group = group;

        this._composer.update(GroupItemsStrategy, {
            handler: this._$group,
        });
        if (group) {
            this._switchImportantPropertiesByGroup(true);
        }

        this._getItemsStrategy().invalidate();
        this._reSort();
        this._reFilter();

        this._finishUpdateSession(session);
    }

    protected _initializeGrouping(): void {
        // region grouping
        if (this._$groupProperty) {
            this._$group = this._createGroupFunctor();
        }

        // Support of 'groupingKeyCallback' option
        if (!this._$group && this._$groupingKeyCallback) {
            this._$group = this._$groupingKeyCallback;
        }
        // endregion
    }

    /**
     * Возвращает элементы группы. Учитывается сортировка и фильтрация.
     * @param {String} groupId Идентификатор группы, элементы которой требуется получить
     * @return {Array.<Controls/_display/CollectionItem>}
     * @example
     * Получим персонажей мужского пола:
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var list = new collection.List({
     *                 items: [
     *                     {name: 'Philip J. Fry', gender: 'M'},
     *                     {name: 'Turanga Leela', gender: 'F'},
     *                     {name: 'Professor Farnsworth', gender: 'M'},
     *                     {name: 'Amy Wong', gender: 'F'},
     *                     {name: 'Bender Bending Rodriguez', gender: 'R'}
     *                 ]
     *             }),
     *             display = new display.Collection({
     *                 collection: list
     *             });
     *
     *         display.setGroup(function(collectionItem, index, item) {
     *             return collectionItem.gender;
     *         });
     *
     *         var males = display.getGroupItems('M'),
     *             male,
     *             i;
     *         for (i = 0; i < males.length; i++) {
     *             male = males[i].getContents();
     *             console.log(male.name);
     *         }
     *         //output: 'Philip J. Fry', 'Professor Farnsworth'
     *     });
     * </pre>
     */
    getGroupItems(groupId: GroupId): T[] {
        const items = [];
        let currentGroupId;
        this.each((item) => {
            if (item['[Controls/_display/GroupItem]']) {
                currentGroupId = item.getContents();
                return;
            }
            if (currentGroupId === groupId) {
                items.push(item);
            }
        });
        return items;
    }

    /**
     * Возвращает идентификтор группы по индексу элемента в проекции
     * @param {Number} index Индекс элемента в проекции
     * @return {String|Number}
     * @example
     * Сгруппируем персонажей по полу:
     * <pre>
     *     require([
     *         'Types/collection'
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var list = new collection.List({
     *                 items: [
     *                     {name: 'Philip J. Fry', gender: 'M'},
     *                     {name: 'Turanga Leela', gender: 'F'},
     *                     {name: 'Professor Farnsworth', gender: 'M'},
     *                     {name: 'Amy Wong', gender: 'F'},
     *                     {name: 'Bender Bending Rodriguez', gender: 'R'}
     *                 ]
     *             }),
     *             display = new display.Collection({
     *                 collection: list
     *             });
     *
     *         display.setGroup(function(collectionItem, index, item) {
     *             return collectionItem.gender;
     *         });
     *
     *         var enumerator = display.getEnumerator(),
     *             index = 0,
     *             item,
     *             group,
     *             contents;
     *         while (enumerator.moveNext()) {
     *             item = enumerator.getCurrent();
     *             group = display.getGroupByIndex(index);
     *             contents = item.getContents();
     *             console.log(group + ': ' + contents.name);
     *             index++;
     *         }
     *         // output:
     *         // 'M: Philip J. Fry',
     *         // 'M: Professor Farnsworth',
     *         // 'F: Turanga Leela',
     *         // 'F: Amy Wong',
     *         // 'R: Bender Bending Rodriguez'
     *     });
     * </pre>
     */
    getGroupByIndex(index: number): string | number {
        let currentGroupId;
        const enumerator = this.getEnumerator();
        let item;
        let itemIndex = 0;
        while (enumerator.moveNext()) {
            item = enumerator.getCurrent();
            if (item['[Controls/_display/GroupItem]']) {
                currentGroupId = item.getContents();
            }
            if (itemIndex === index) {
                break;
            }
            itemIndex++;
        }

        return currentGroupId;
    }

    /**
     * Возвращает пользовательские методы сортировки элементов проекции
     * @see sort
     * @see setSort
     * @see addSort
     */
    getSort(): SortFunction<S, T>[] {
        return this._$sort.slice();
    }

    /**
     * Устанавливает пользовательские методы сортировки элементов проекции. Вызов метода без аргументов приведет к
     * удалению всех пользовательских сортировок.
     * @param sort Методы сортировки элементов: аргументами
     * приходят 2 объекта типа {@link UserSortItem}, должен вернуть -1|0|1 (см. Array.prototype.sort())
     * @see sort
     * @see getSort
     * @see addSort
     * @see removeSort
     * @example
     * Отсортируем коллекцию по возрастанию значения поля title:
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var display = new display.Collection({
     *             collection: new collection.List({
     *                 items: [
     *                     {id: 1, title: 'foo'},
     *                     {id: 2, title: 'bar'}
     *                 ]
     *             })
     *         });
     *
     *         display.setSort(function(a, b) {
     *             return a.collectionItem.title > b.collectionItem.title;
     *         });
     *
     *         display.each(function(item) {
     *             console.log(item.getContents().title;
     *         });
     *         //output: 'bar', 'foo'
     *     });
     * </pre>
     * Отсортируем коллекцию сначала по title, а потом - по id:
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var display = new display.Collection({
     *             collection: new collection.List({
     *                 items: [
     *                     {id: 4, title: 'foo'},
     *                     {id: 3, title: 'bar'},
     *                     {id: 2, title: 'foo'}
     *                 ]
     *             })
     *         });
     *
     *         display.setSort(function(a, b) {
     *             return a.collectionItem.title -> b.collectionItem.title;
     *         }, function(a, b) {
     *             return a.collectionItem.id - b.collectionItem.id;
     *         });
     *
     *         display.each(function(item) {
     *             console.log(item.getContents().id;
     *         });
     *         //output: 3, 2, 4
     *     });
     * </pre>
     */
    setSort(...args: SortFunction<S, T>[]): void {
        const session = this._startUpdateSession();
        const sorts = args[0] instanceof Array ? args[0] : args;

        if (this._$sort.length === sorts.length) {
            let changed = false;
            for (let i = 0; i < sorts.length; i++) {
                if (this._$sort[i] !== sorts[i]) {
                    changed = true;
                    break;
                }
            }

            if (!changed) {
                return;
            }
        }

        this._switchImportantPropertiesByUserSort(false);
        this._$sort.length = 0;
        this._$sort.push.apply(this._$sort, normalizeHandlers(sorts));
        this._switchImportantPropertiesByUserSort(true);

        this._getItemsStrategy().invalidate();

        this._reSort();
        if (this._isFiltered()) {
            this._reFilter();
        }

        this._finishUpdateSession(session);
    }

    /**
     * Добавляет пользовательский метод сортировки элементов проекции, если такой еще не был задан.
     * @param sort Метод сортировки элементов:
     * аргументами приходят 2 объекта типа {@link UserSortItem}, должен вернуть -1|0|1 (см. Array.prototype.sort())
     * @param [at] Порядковый номер метода (если не передан, добавляется в конец)
     * @see sort
     * @see getSort
     * @see setSort
     * @see removeSort
     * @example
     * Отсортируем коллекцию по возрастанию значения поля id
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var display = new display.Collection({
     *             collection: new collection.List({
     *                 items: [
     *                     {id: 1, title: 'foo'},
     *                     {id: 2, title: 'bar'}
     *                 ]
     *             })
     *         });
     *
     *         display.addSort(function(a, b) {
     *             return a.collectionItem.id - b.collectionItem.id
     *         });
     *     });
     * </pre>
     */
    addSort(sort: SortFunction<S, T>, at?: number): void {
        if (this._$sort.indexOf(sort) > -1) {
            return;
        }

        const session = this._startUpdateSession();

        this._switchImportantPropertiesByUserSort(false);
        if (at === undefined) {
            this._$sort.push(sort);
        } else {
            this._$sort.splice(at, 0, sort);
        }
        this._switchImportantPropertiesByUserSort(true);

        this._getItemsStrategy().invalidate();

        this._reSort();
        if (this._isFiltered()) {
            this._reFilter();
        }

        this._finishUpdateSession(session);
    }

    /**
     * Удаляет пользовательский метод сортировки элементов проекции.
     * @param sort Метод сортировки элементов:
     * аргументами приходят 2 объекта типа {@link UserSortItem}, должен вернуть -1|0|1 (см. Array.prototype.sort())
     * @return Был ли установлен такой метод сортировки
     * @see sort
     * @see getSort
     * @see setSort
     * @see addSort
     * @example
     * Отсортируем коллекцию по возрастанию значения поля id
     * <pre>
     *     require([
     *         'Types/collection',
     *         'Controls/display'
     *     ], function(collection, display) {
     *         var handler = function(a, b) {
     *             return a.item.id - b.item.id
     *         };
     *         var display = new display.Collection({
     *             collection: new collection.List({
     *                 items: [
     *                     {id: 1, title: 'foo'},
     *                     {id: 2, title: 'bar'}
     *                 ]
     *             }),
     *             sort: handler
     *         });
     *
     *         //...
     *         display.removeSort(handler);
     *     });
     * </pre>
     */
    removeSort(sort: SortFunction<S, T>): boolean {
        const at = this._$sort.indexOf(sort);
        if (at === -1) {
            return false;
        }

        const session = this._startUpdateSession();

        this._switchImportantPropertiesByUserSort(false);
        this._$sort.splice(at, 1);
        this._switchImportantPropertiesByUserSort(true);

        this._getItemsStrategy().invalidate();
        this._reSort();
        if (this._isFiltered()) {
            this._reFilter();
        }

        this._finishUpdateSession(session);

        return true;
    }

    setKeyProperty(keyProperty: string): void {
        super.setKeyProperty(keyProperty);
        if (keyProperty !== this.getKeyProperty()) {
            this._composer.getInstance<DirectItemsStrategy<S, T>>(DirectItemsStrategy).keyProperty =
                keyProperty;
        }
    }

    /**
     * Возвращает признак обеспечивания уникальности элементов
     * @return {Boolean}
     */
    isUnique(): boolean {
        return this._$unique;
    }

    /**
     * Возвращает признак обеспечивания уникальности элементов
     * @param {Boolean} unique Обеспечивать уникальность элементов
     */
    setUnique(unique: boolean): void {
        if (this._$unique === unique) {
            return;
        }

        const session = this._startUpdateSession();

        this._$unique = unique;
        this._composer.getInstance<DirectItemsStrategy<S, T>>(DirectItemsStrategy).unique = unique;
        this._getItemsStrategy().invalidate();
        this._reSort();

        this._finishUpdateSession(session);
    }

    /**
     * Уведомляет подписчиков об изменении элемента коллекции
     * @param {Controls/_display/CollectionItem} item Элемент проекции
     * @param {Object} [properties] Изменившиеся свойства
     */
    notifyItemChange(item: T, properties: string): void {
        const isFiltered = this._isFiltered();
        const isGrouped = this._isGrouped();
        const shouldRebuild = REBUILD_ITEM_PROPERTIES.indexOf(properties) !== -1;
        if ((isFiltered || isGrouped) && shouldRebuild) {
            const session = this._startUpdateSession();

            if (isGrouped) {
                this._reGroup();
                this._reSort();
            }

            if (isFiltered) {
                this._reFilter();
            }
            this._finishUpdateSession(session);
        }

        if (!this.isEventRaising()) {
            return;
        }

        const index = this.getIndex(item as any);
        const items: ISessionItems<T> = [item];
        items.properties = properties;

        this._notifyBeforeCollectionChange();
        this._notifyCollectionChange(IObservable.ACTION_CHANGE, items, index, items, index);
        this._handleAfterCollectionChange(items);

        if (VERSION_UPDATE_ITEM_PROPERTIES.indexOf(properties as unknown as string) >= 0) {
            this._nextVersion();
        }
    }

    // endregion

    // region Drag-N-Drop

    getItemsDragNDrop(): boolean {
        return this._$itemsDragNDrop;
    }

    setDraggedItems(draggableItem: T, draggedItemsKeys: CrudEntityKey[]): void {
        const draggableItemIndex = this.getIndex(draggableItem);

        let targetIndex;
        if (!this.getCount()) {
            targetIndex = 0;
        } else if (draggableItemIndex > -1) {
            targetIndex = draggableItemIndex;
        } else {
            // когда перетаскиваем в другой список, изначальная позиция будет в конце списка
            targetIndex = this.getCount() - 1;
        }

        this.appendStrategy(this._dragStrategy as StrategyConstructor<any>, {
            draggedItemsKeys,
            draggableItem,
            targetIndex,
        });
        this._reIndex();
    }

    setDragPosition(position: IDragPosition<T>): void {
        const strategy = this.getStrategyInstance(this._dragStrategy) as DragStrategy;
        if (strategy && position) {
            strategy.setPosition(position);
            this._reIndex();
            this._reFilter();
            this.nextVersion();
        }
    }

    resetDraggedItems(): void {
        const strategy = this.getStrategyInstance(this._dragStrategy) as DragStrategy;
        if (strategy) {
            strategy.destroy();
            this.removeStrategy(this._dragStrategy);
            this._reIndex();
            this._updateEdgeItems();
        }
    }

    getDraggedItemsCount(): number {
        const strategy = this.getStrategyInstance(this._dragStrategy) as DragStrategy;
        return strategy ? strategy.getDraggedItemsCount() : 0;
    }

    /**
     * Устанавливает признак, что запись утащили за пределы списка
     * @param outside
     */
    setDragOutsideList(outside: boolean): void {
        if (this._isDragOutsideList !== outside) {
            this._isDragOutsideList = outside;
            const strategy = this.getStrategyInstance(this._dragStrategy) as DragStrategy;
            if (strategy && strategy.avatarItem) {
                strategy.avatarItem.setDragOutsideList(outside);
                this._nextVersion();
            }
        }
    }

    isDragOutsideList(): boolean {
        return this._isDragOutsideList;
    }

    isDragging(): boolean {
        return !!this.getStrategyInstance(this._dragStrategy);
    }

    getDraggableItem(): T {
        const strategy = this.getStrategyInstance(this._dragStrategy);
        return strategy?.avatarItem as T;
    }

    // endregion Drag-N-Drop

    getFadedKeys(): CrudEntityKey[] {
        return this._$fadedKeys || [];
    }

    setFadedKeys(fadedKeys: CrudEntityKey[]): void {
        this._$fadedKeys = [...fadedKeys];
    }

    getItemTemplateProperty(): string {
        return this._$itemTemplateProperty;
    }

    setDisplayProperty(displayProperty: string): void {
        if (this._$displayProperty !== displayProperty && displayProperty !== undefined) {
            this._$displayProperty = displayProperty;
            this._nextVersion();
        }
    }

    getDisplayProperty(): string {
        return this._$displayProperty;
    }

    getItemCounters(): ICollectionCounters[] {
        const result: ICollectionCounters[] = [];
        this.each((item: unknown) => {
            const i = item as CollectionItem<S>;
            result.push({
                key: i.getUid(),
                counters: i.getCounters(),
            });
        });
        return result;
    }

    isStickyMarkedItem(): boolean {
        return this._$stickyMarkedItem;
    }

    isStickyHeader(): boolean {
        return this._$stickyHeader;
    }

    isStickyResults(): boolean {
        return this._$stickyResults;
    }

    isStickyGroup(): boolean {
        return this._$stickyGroup;
    }

    isStickyFooter(): boolean {
        return this._$stickyFooter;
    }

    setItemTemplateOptions(itemTemplateOptions: object): void {
        if (!isEqual(this._$itemTemplateOptions, itemTemplateOptions)) {
            this._$itemTemplateOptions = itemTemplateOptions;
            this._updateItemsProperty(
                'setItemTemplateOptions',
                this._$itemTemplateOptions,
                '[Controls/_display/CollectionItem]'
            );
            this._nextVersion();
        }
    }

    // region RoundBorder

    setRoundBorder(roundBorder: IRoundBorder): void {
        if (!isEqual(this._$roundBorder, roundBorder)) {
            this._$roundBorder = roundBorder;
            this._updateItemsProperty('setRoundBorder', this._$roundBorder, 'setRoundBorder');
            this._nextVersion();
        }
    }

    getRoundAngleBL(): string {
        return this._$roundBorder?.bl || 'null';
    }

    getRoundAngleBR(): string {
        return this._$roundBorder?.br || 'null';
    }

    getRoundAngleTL(): string {
        return this._$roundBorder?.tl || 'null';
    }

    getRoundAngleTR(): string {
        return this._$roundBorder?.tr || 'null';
    }

    // endregion RoundBorder

    getRowSeparatorSize(): string {
        return this._$rowSeparatorSize;
    }

    setRowSeparatorSize(rowSeparatorSize: string): void {
        if (this._$rowSeparatorSize !== rowSeparatorSize && rowSeparatorSize !== undefined) {
            this._$rowSeparatorSize = rowSeparatorSize;
            this._nextVersion();
            this._updateEdgeItems(true, true);
            this._updateItemsProperty('setRowSeparatorSize', this._$rowSeparatorSize);
        }
    }

    setRowSeparatorVisibility(rowSeparatorVisibility: TRowSeparatorVisibility): void {
        if (
            this._$rowSeparatorVisibility !== rowSeparatorVisibility &&
            rowSeparatorVisibility !== undefined
        ) {
            this._$rowSeparatorVisibility = rowSeparatorVisibility;
            const firstItem = this.getFirst('EdgeRowSeparatorItem');
            const lastItem = this.getLast('EdgeRowSeparatorItem');
            let considerHiddenGroup = (firstItem as unknown as GroupItem)?.isHiddenGroup?.();

            // Обновление разделитей всех записей, кроме первой и последней
            this._getItems().forEach((item: CollectionItem<S>) => {
                // Обновление разделитей первой, не единственной записи
                if (item === firstItem && item !== lastItem) {
                    item.setTopSeparatorEnabled(this._shouldAddListTopSeparator());
                    item.setBottomSeparatorEnabled(false);

                    item.setTopSeparatorEnabledReact?.(true);
                    item.setBottomSeparatorEnabledReact?.(
                        this._$rowSeparatorVisibility !== 'edges'
                    );

                    // Обновление разделитей последней, не единственной записи
                } else if (item === lastItem && item !== firstItem) {
                    item.setTopSeparatorEnabled(rowSeparatorVisibility !== 'edges');
                    item.setBottomSeparatorEnabled(this._shouldAddListBottomSeparator());

                    item.setTopSeparatorEnabledReact?.(false);
                    item.setBottomSeparatorEnabledReact?.(this._shouldAddListBottomSeparator());

                    // Обновление разделитей единственной записи
                } else if (item === lastItem && item === firstItem) {
                    item.setTopSeparatorEnabled(this._shouldAddListTopSeparator());
                    item.setBottomSeparatorEnabled(this._shouldAddListBottomSeparator());

                    item.setTopSeparatorEnabledReact?.(this._shouldAddListTopSeparator());
                    item.setBottomSeparatorEnabledReact?.(this._shouldAddListBottomSeparator());

                    // Обновление разделитей всех хаписей, кроме первой и последней
                } else {
                    let shouldAddTopSeparator = rowSeparatorVisibility !== 'edges';

                    // Учитываем "скрытую" группу. В этом случае вторая запись должна вести себя как первая.
                    if (considerHiddenGroup) {
                        shouldAddTopSeparator = this._shouldAddListTopSeparator();
                        considerHiddenGroup = false;
                    }

                    item.setTopSeparatorEnabled(shouldAddTopSeparator);
                    item.setBottomSeparatorEnabled(false);

                    item.setTopSeparatorEnabledReact?.(false);
                    item.setBottomSeparatorEnabledReact?.(rowSeparatorVisibility !== 'edges');
                }
            });
            this._nextVersion();
        }
    }

    getMultiSelectVisibility(): string {
        return this._$multiSelectVisibility;
    }

    setMultiSelectVisibility(visibility: string): void {
        if (this._$multiSelectVisibility === visibility || visibility === undefined) {
            return;
        }
        this._$multiSelectVisibility = visibility;
        this._nextVersion();

        // Выключаем события, т.к. начинаем зацикливаться:
        // Collection::setMultiSelectVisibility -> Item::setMultiSelectVisibility ->
        // Item::notifyToOwner -> Collection::handleAfterCollectionChange -> Collection::setMultiSelectVisibility.
        // Выключение событий - явно не выход, по крайней мере тут, но более безопасного решения нет.
        // Добавлено по https://online.sbis.ru/opendoc.html?guid=ded4fe9e-8efc-4642-9ab7-b9db0fcc11d5&client=3
        const isEventRaising = this.isEventRaising();
        if (isEventRaising) {
            this.setEventRaising(false, true);
        }
        // Нельзя проверять SelectableItem, т.к. элементы которые нельзя выбирать
        // тоже должны перерисоваться при изменении видимости чекбоксов
        this._updateItemsProperty(
            'setMultiSelectVisibility',
            this._$multiSelectVisibility,
            'setMultiSelectVisibility'
        );
        if (isEventRaising) {
            this.setEventRaising(true, true);
        }
    }

    getTrackedProperties(): ITrackedPropertiesItem[] {
        return this._$trackedProperties;
    }

    setTrackedProperties(trackedProperties: string[] | ITrackedPropertiesItem[]): void {
        if (isEqual(this._$trackedProperties, trackedProperties)) {
            return;
        }
        this._$trackedProperties = this._fixTrackedProperties(trackedProperties);
        this._nextVersion();
    }

    protected _fixTrackedProperties(
        trackedProperties: string[] | ITrackedPropertiesItem[]
    ): ITrackedPropertiesItem[] {
        if (trackedProperties && typeof trackedProperties[0] === 'string') {
            return (trackedProperties as string[]).map((property: string) => {
                return {
                    propertyName: property,
                };
            });
            Logger.warn(
                'ITrackedProperties: Значение в формате строки не поддерживаются. Используйте ITrackedPropertiesItem[]'
            );
        } else {
            return trackedProperties as ITrackedPropertiesItem[];
        }
    }

    updateTrackedValues(item: T): void {
        let isChanged = false;
        if (item && this._$trackedProperties) {
            let dataItem = item;
            if (item['[Controls/_display/GroupItem]']) {
                dataItem = this.at(this.getIndex(item) + 1);
            }
            if (dataItem) {
                const record: S = dataItem.contents;
                if (record instanceof Model) {
                    const trackedValues = {};
                    this._$trackedProperties.forEach((property) => {
                        trackedValues[property.propertyName] = record.get(property.propertyName);
                        isChanged =
                            isChanged ||
                            trackedValues[property.propertyName] !==
                                this._trackedValues?.[property.propertyName];
                    });
                    this._trackedValues = trackedValues;
                }
            }
        } else {
            isChanged = !!this._trackedValues;
            this._trackedValues = null;
        }
        if (isChanged && this.isTrackedValuesVisible()) {
            this._notify('trackedValuesChanged', this._trackedValues);
            this._nextVersion();
        }
    }

    getTrackedValues(): Record<string, string> {
        return this._trackedValues;
    }

    isTrackedValuesVisible(): boolean {
        return this._trackedValues && this._trackedValuesVisible;
    }

    setTrackedValuesVisible(trackedValuesVisible: boolean): boolean {
        if (this._trackedValuesVisible !== trackedValuesVisible) {
            this._trackedValuesVisible = trackedValuesVisible;
            this._nextVersion();
            return true;
        }
        return false;
    }

    setMultiSelectAccessibilityProperty(property: string): void {
        if (this._$multiSelectAccessibilityProperty === property) {
            return;
        }
        this._$multiSelectAccessibilityProperty = property;
        this._nextVersion();
        this._updateItemsProperty(
            'setMultiSelectAccessibilityProperty',
            this._$multiSelectAccessibilityProperty,
            'setMultiSelectAccessibilityProperty'
        );
    }

    getMultiSelectAccessibilityProperty(): string {
        return this._$multiSelectAccessibilityProperty;
    }

    setMultiSelectPosition(position: 'default' | 'custom'): boolean {
        if (this._$multiSelectPosition === position) {
            return false;
        }
        this._$multiSelectPosition = position;
        this._nextVersion();
        return true;
    }

    getMultiSelectPosition(): 'default' | 'custom' {
        return this._$multiSelectPosition;
    }

    getMultiSelectTemplate(): TemplateFunction | string {
        return this._$multiSelectTemplate;
    }

    protected _setItemPadding(itemPadding: IItemPadding, silent?: boolean): void {
        this._$topPadding = itemPadding.top || 'default';
        this._$bottomPadding = itemPadding.bottom || 'default';
        this._$leftPadding = itemPadding.left || 'default';
        this._$rightPadding = itemPadding.right || 'default';

        this._updateItemsProperty('setItemPadding', itemPadding, 'setItemPadding', silent);
    }

    setItemPadding(itemPadding: IItemPadding): void {
        this._setItemPadding(itemPadding);
        this._nextVersion();
    }

    setItemsSpacing(itemsSpacing: TOffsetSize): void {
        if (this._$itemsSpacing === itemsSpacing) {
            return;
        }
        const setSpacing = !this._$itemsSpacing && itemsSpacing;
        const unsetSpacing = this._$itemsSpacing && !itemsSpacing;
        const changedSpacing = !setSpacing && !unsetSpacing;

        this._$itemsSpacing = itemsSpacing;

        if (setSpacing || unsetSpacing) {
            const session = this._startUpdateSession();
            if (this._composer) {
                if (setSpacing) {
                    this._composer.append(ItemsSpacingStrategy, {
                        spaceItemFactory: this._spaceItemFactory.bind(this),
                        itemsSpacingVisibility: this._$itemsSpacingVisibility,
                    });
                } else {
                    this._composer.remove(ItemsSpacingStrategy);
                }
                this._reBuild();
            }
            this._finishUpdateSession(session);
        }
        if (changedSpacing) {
            this._updateItemsProperty(
                'setItemsSpacing',
                itemsSpacing,
                '[Controls/_display/SpaceCollectionItem]'
            );
        }

        this._nextVersion();
    }

    /**
     * Метод возвращает итем коллекции по которому строиться отступ между записями с данными
     * @param {T} item - запись, после которой будет вставлена новая пустая строка
     */
    protected _spaceItemFactory(item: T): SpaceCollectionItem {
        const keyProperty = this.getKeyProperty();
        const contents = new Model({
            keyProperty,
            rawData: {
                [keyProperty]: `space-collection-item-${item.key}`,
            },
        });

        return this.createItem({
            itemModule: this._spaceItemModule,
            itemsSpacing: this._$itemsSpacing,
            contents,
        }) as unknown as SpaceCollectionItem;
    }

    setMarkedKey(key: string | number, status: boolean): void {
        const item = this.getItemBySourceKey(key);
        if (item && item.Markable) {
            item.setMarked(status);
        }
    }

    getTheme(): string {
        return this._$theme;
    }

    getStyle(): string {
        return this._$style;
    }

    getHoverBackgroundStyle(): string {
        return this._$hoverBackgroundStyle;
    }

    setHoverBackgroundStyle(hoverBackgroundStyle: string): void {
        if (
            this._$hoverBackgroundStyle === hoverBackgroundStyle ||
            hoverBackgroundStyle === undefined
        ) {
            return;
        }

        this._$hoverBackgroundStyle = hoverBackgroundStyle;
        if (this._actionsTemplateConfig) {
            this._actionsTemplateConfig.style = hoverBackgroundStyle;
        }
        this._updateItemsProperty(
            'setHoverBackgroundStyle',
            hoverBackgroundStyle,
            'setHoverBackgroundStyle'
        );
        this.nextVersion();
    }

    setBackgroundStyle(backgroundStyle: TBackgroundStyle): void {
        if (this._$backgroundStyle !== backgroundStyle && backgroundStyle !== undefined) {
            this._$backgroundStyle = backgroundStyle;
            this.getItems().forEach((item) => {
                item.setBackgroundStyle(backgroundStyle);
            });
            this.nextVersion();
        }
    }

    getBackgroundStyle(): TBackgroundStyle {
        return this._$backgroundStyle && this._$backgroundStyle !== 'default'
            ? this._$backgroundStyle
            : this._$style;
    }

    setFixedBackgroundStyle(fixedBackgroundStyle: TBackgroundStyle): void {
        if (
            this._$fixedBackgroundStyle !== fixedBackgroundStyle &&
            fixedBackgroundStyle !== undefined
        ) {
            this._$fixedBackgroundStyle = fixedBackgroundStyle;
            this.getItems().forEach((item) => {
                item.setBackgroundStyle(fixedBackgroundStyle);
            });
            this.nextVersion();
        }
    }

    getFixedBackgroundStyle(fixedBackgroundStyle?: string): TBackgroundStyle {
        return fixedBackgroundStyle || this._$fixedBackgroundStyle;
    }

    setFooterBackgroundStyle(footerBackgroundStyle: TBackgroundStyle): void {
        if (this._$footerBackgroundStyle !== footerBackgroundStyle) {
            this._$footerBackgroundStyle = footerBackgroundStyle;
            if (this.getFooter()) {
                this.getFooter().setBackgroundStyle(footerBackgroundStyle);
            }
            this.nextVersion();
        }
    }

    getEditingBackgroundStyle(): string {
        const editingConfig = this.getEditingConfig();
        if (editingConfig) {
            return editingConfig.backgroundStyle || 'default';
        }
        return 'default';
    }

    setTheme(theme: string): boolean {
        if (this._$theme !== theme && theme !== undefined) {
            this._$theme = theme;
            this._nextVersion();
            return true;
        }
        return false;
    }

    getTopPadding(): string {
        return this._$topPadding;
    }

    getBottomPadding(): string {
        return this._$bottomPadding;
    }

    getLeftPadding(): string {
        return this._$leftPadding;
    }

    getRightPadding(): string {
        return this._$rightPadding;
    }

    getEmptyTemplateItem(): EmptyTemplateItem {
        if (!this._emptyTemplateItem && this._$emptyTemplate) {
            this._emptyTemplateItem = new EmptyTemplateItem({
                owner: this,
                template: this._$emptyTemplate,
                itemTemplateOptions: this._$emptyTemplateOptions,
                rowSeparatorSize: this._$rowSeparatorSize,
            });
        }
        return this._emptyTemplateItem;
    }

    setEmptyTemplate(emptyTemplate: TemplateFunction): boolean {
        if (this._$emptyTemplate !== emptyTemplate) {
            this._$emptyTemplate = emptyTemplate;
            this._emptyTemplateItem = null;
            this._nextVersion();
            return true;
        }
        return false;
    }

    setEmptyTemplateOptions(options: object): boolean {
        if (!isEqual(this._$emptyTemplateOptions, options)) {
            this._$emptyTemplateOptions = options;
            this._nextVersion();
            return true;
        }
        return false;
    }

    setEditingConfig(config: IEditingConfig): boolean {
        if (this._$editingConfig === config) {
            return false;
        }
        this._$editingConfig = config;
        this._nextVersion();
        return true;
    }

    getEditingConfig(): IEditingConfig {
        return this._$editingConfig;
    }

    setSearchValue(searchValue: string): void {
        if (this._$searchValue !== searchValue) {
            this._$searchValue = searchValue;
            this._updateItemsProperty('setSearchValue', this._$searchValue, 'DisplaySearchValue');
            this._nextVersion();
        }
    }

    getSearchValue(): string {
        return this._$searchValue || '';
    }

    isVisibleItem(key: CrudEntityKey): boolean {
        const index = this.getSourceDataStrategy().getSourceIndexByKey(key);
        return this._filterMap[index];
    }

    protected _updateEdgeItems(force?: boolean, silent?: boolean): void {
        const firstItem = this.getFirst('EdgeRowSeparatorItem');
        const lastItem = this.getLast('EdgeRowSeparatorItem');

        if (firstItem !== this._firstItem || force) {
            if (this._$rowSeparatorSize && this._$rowSeparatorSize !== 'null') {
                const args: [CollectionItem, CollectionItem, boolean, boolean] = [
                    this._firstItem,
                    firstItem,
                    this._shouldAddListTopSeparator(),
                    silent,
                ];

                this._updateTopItemSeparator(...args);
                this._updateTopItemSeparatorReact(...args);

                // Учитываем "скрытую" группу. В этом случае вторая запись должна вести себя как первая.
                if ((firstItem as unknown as GroupItem)?.isHiddenGroup?.()) {
                    const nextItem = this.getNext(firstItem);
                    const args: [CollectionItem, CollectionItem, boolean, boolean] = [
                        null,
                        nextItem,
                        this._shouldAddListTopSeparator(),
                        silent,
                    ];

                    this._updateTopItemSeparator(...args);
                    this._updateTopItemSeparatorReact(...args);
                }
            }
            this._updateFirstItem(this._firstItem, firstItem, silent);
        }

        if (lastItem !== this._lastItem || force) {
            if (this._$rowSeparatorSize && this._$rowSeparatorSize !== 'null') {
                this._updateBottomItemSeparator(
                    this._lastItem,
                    lastItem,
                    this._shouldAddListBottomSeparator(),
                    silent
                );
                this._updateBottomItemSeparatorReact?.(
                    this._lastItem,
                    lastItem,
                    this._$rowSeparatorVisibility !== 'items' || !!this.getFooter(),
                    silent
                );
            }
            this._updateLastItem(this._lastItem, lastItem, silent);
        }
    }

    private _updateLastItem(
        oldItem: CollectionItem,
        newItem: CollectionItem,
        silent?: boolean
    ): void {
        // @TODO https://online.sbis.ru/opendoc.html?guid=ef1556f8-fce4-401f-9818-f4d1f8d8789a
        if (oldItem) {
            oldItem.setLastItem(false, silent);
        }
        if (newItem) {
            newItem.setLastItem(true, silent);
        }
        this._lastItem = newItem;
    }

    private _updateFirstItem(
        oldItem: CollectionItem,
        newItem: CollectionItem,
        silent?: boolean
    ): void {
        // @TODO https://online.sbis.ru/opendoc.html?guid=ef1556f8-fce4-401f-9818-f4d1f8d8789a
        if (oldItem) {
            oldItem.setFirstItem(false, silent);
        }
        if (newItem) {
            newItem.setFirstItem(true, silent);
        }
        this._firstItem = newItem;
    }

    private _updateBottomItemSeparator(
        oldItem: CollectionItem,
        newItem: CollectionItem,
        newState: boolean,
        silent?: boolean
    ): void {
        if (oldItem) {
            oldItem.setBottomSeparatorEnabled(false, silent);
        }
        if (newItem) {
            newItem.setBottomSeparatorEnabled(newState, silent);
        }
    }

    private _updateBottomItemSeparatorReact(
        oldItem: CollectionItem,
        newItem: CollectionItem,
        newState: boolean,
        silent?: boolean
    ): void {
        if (oldItem) {
            oldItem.setBottomSeparatorEnabledReact(true, silent);
        }
        if (newItem) {
            newItem.setBottomSeparatorEnabledReact(newState, silent);
        }
    }

    private _updateTopItemSeparator(
        oldItem: CollectionItem,
        newItem: CollectionItem,
        newState: boolean,
        silent?: boolean
    ): void {
        if (oldItem) {
            oldItem.setTopSeparatorEnabled(true, silent);
        }
        if (newItem) {
            newItem.setTopSeparatorEnabled(newState, silent);
        }
    }

    private _updateTopItemSeparatorReact(
        oldItem: CollectionItem,
        newItem: CollectionItem,
        newState: boolean,
        silent?: boolean
    ): void {
        if (oldItem) {
            oldItem.setTopSeparatorEnabledReact?.(false, silent);
        }
        if (newItem) {
            newItem.setTopSeparatorEnabledReact?.(newState, silent);
        }
    }

    protected _shouldAddListTopSeparator(): boolean {
        return this._$rowSeparatorVisibility !== 'items' || !!this.getFooter();
    }

    protected _shouldAddListBottomSeparator(): boolean {
        const navigation = this.getNavigation();
        // Мы проверяем именно данные вниз,
        // т.к. для нижнего разделителя важно, что нет данных именно внизу.
        const noMoreData = !navigation || navigation.view !== 'infinity' || !this.hasMoreDataDown();
        return noMoreData && this._shouldAddListTopSeparator();
    }

    getMoreButtonVisibility(): MoreButtonVisibility {
        return this._$moreButtonVisibility;
    }

    getHasMoreData(): IHasMoreData {
        return this._$hasMoreData;
    }

    setHasMoreData(hasMoreData: IHasMoreData): void {
        if (!isEqual(this._$hasMoreData, hasMoreData)) {
            this._$hasMoreData = hasMoreData;
            this._updateEdgeItems(true);
            this._nextVersion();
        }
    }

    hasMoreData(): boolean {
        return this.hasMoreDataUp() || this.hasMoreDataDown();
    }

    hasMoreDataUp(): boolean {
        return !!this._$hasMoreData?.up;
    }

    hasMoreDataDown(): boolean {
        return !!this._$hasMoreData?.down;
    }

    setMetaData(metaData: { results?: EntityModel }): void {
        this._actualizeSubscriptionOnMetaResults(this._$metaResults, metaData.results);
        this.setMetaResults(metaData.results);

        this.getTopIndicator().setMetaData(metaData);
        this.getBottomIndicator().setMetaData(metaData);

        // Этот метод вызывается из подписки onPropertyChanged, оторая происходит всегда только при изменении.
        // Поэтому безусловно поднимаем версию, т.к. metaData гарантированно изменилась.
        this._nextVersion();
    }

    setMetaResults(metaResults: EntityModel): void {
        if (!isEqual(this._$metaResults, metaResults) || this._$metaResults !== metaResults) {
            this._setMetaResults(metaResults);
        }
    }

    protected _setMetaResults(metaResults: EntityModel): void {
        this._$metaResults = metaResults;
        // Для обновления metaResults в группах
        this._updateItemsProperty('setMetaResults', this._$metaResults, 'setMetaResults');
        this._nextVersion();
    }

    getMetaResults(): EntityModel {
        return this._$metaResults;
    }

    getMetaData(): Record<string, unknown> {
        return this.getSourceDataStrategy().getMetaData();
    }

    private _actualizeSubscriptionOnMetaResults(thisMetaResults: object, newMetaResults: object) {
        if (thisMetaResults !== newMetaResults) {
            if (thisMetaResults && thisMetaResults['[Types/_entity/IObservableObject]']) {
                thisMetaResults.unsubscribe('onPropertyChange', this._onMetaResultsChange);
            }
            if (newMetaResults && newMetaResults['[Types/_entity/IObservableObject]']) {
                newMetaResults.subscribe('onPropertyChange', this._onMetaResultsChange);
            }
        }
    }

    private _setItemsFilterMethod(filter: FilterFunction<S>[], method: FilterFunction<S>): void {
        // FIXME: метод для поддержания совместимости с ModerDialog при внедрении. Должен быть удален.
        //  Убрать по задаче https://online.sbis.ru/opendoc.html?guid=7a607ef8-f2bc-461f-9de8-a97e14af88cb
        if (typeof method === 'function') {
            filter.push((item) => {
                const result = method(item);
                return typeof result === 'boolean' ? result : true;
            });
        }
    }

    getCollapsedGroups(): TArrayGroupKey {
        return this._$collapsedGroups;
    }

    setCollapsedGroups(collapsedGroups: TArrayGroupKey): void {
        this._$collapsedGroups = collapsedGroups;
        const session = this._startUpdateSession();
        this._composer.update(GroupItemsStrategy, {
            collapsedGroups: this._$collapsedGroups,
        });
        // Сбрасываем кэш расчётов по всем стратегиям, чтобы спровацировать полный пересчёт с актуальными данными
        this._getItemsStrategy().invalidate();
        this._reGroup();
        this._reSort();
        this._reFilter();
        this._finishUpdateSession(session);
        this._nextVersion();
    }

    isAllGroupsCollapsed(): boolean {
        const itemsCount = this.getCount();
        for (let idx = 0; idx < itemsCount; idx++) {
            const item = this.at(idx);
            if (!item['[Controls/_display/GroupItem]'] || item.isExpanded()) {
                return false;
            }
        }
        return true;
    }

    setCompatibleReset(compatible: boolean): void {
        this._$compatibleReset = compatible;
    }

    setViewIterator(viewIterator: IViewIterator<T>): void {
        this._resetViewIterator();
        this._viewIterator = viewIterator;
    }

    _setDefaultViewIterator(): void {
        this._viewIterator = {
            each: this.each.bind(this),
            setIndices: () => {
                return false;
            },
            setNextIndices: () => {
                return false;
            },
            isItemAtIndexHidden: () => {
                return false;
            },
        };
    }

    // Публичный метод для сброса итератора к дефолтному состоянию.
    resetViewIterator(): void {
        this._resetViewIterator();
        this._setDefaultViewIterator();
    }

    // Метод зануляющий итератор и рвущий круговую ссылку на коллекцию, т.к. итератор её биндит
    // (collection->_viewIterator->each->collection).
    private _resetViewIterator(): void {
        if (this._viewIterator) {
            Object.keys(this._viewIterator).forEach((key) => {
                delete this._viewIterator[key];
            });

            this._viewIterator = null;
        }
    }

    setNextIndexes(start: number, stop: number, shiftDirection: IDirection): void {
        this.getViewIterator().setNextIndices(start, stop);
        this._notify('nextIndexesChanged', start, stop, shiftDirection);
    }

    setIndexes(start: number, stop: number, shiftDirection: IDirection): void {
        this.getViewIterator().setIndices(start, stop);
        this._notify('indexesChanged', start, stop, shiftDirection);
        // Нельзя проверять SelectableItem, т.к. элементы которые нельзя выбирать
        // тоже должны перерисоваться при изменении видимости чекбоксов
        this._updateItemsProperty(
            'setMultiSelectVisibility',
            this._$multiSelectVisibility,
            'setMultiSelectVisibility'
        );
        this._updateRenderedItemsOutsideVirtualRange(start, stop);
    }

    protected _updateRenderedItemsOutsideVirtualRange(start: number, stop: number): void {
        const hasEditing = !!this.getEditingConfig();
        const hasStickyItem =
            (this.isStickyMarkedItem() !== false && this.getStyle() === 'master') ||
            !!this._$stickyCallback;
        const hasStickyGroup = this._hasStickyGroup();
        if (!hasEditing && !hasStickyItem && !hasStickyGroup) {
            return;
        }

        let lastBeforeRange: CollectionItem = null;
        let firstAfterRange: CollectionItem = null;
        this.each((item, index) => {
            const insideRange = index >= start && index < stop;
            if (insideRange || (!item.isSticked() && !item.isEditing())) {
                item.setRenderedOutsideRange(false);
                return;
            }

            if (index < start) {
                if (lastBeforeRange) {
                    lastBeforeRange.setRenderedOutsideRange(false);
                }
                lastBeforeRange = item;
            }
            if (index >= stop) {
                if (!firstAfterRange) {
                    firstAfterRange = item;
                } else {
                    item.setRenderedOutsideRange(false);
                }
            }
        });

        lastBeforeRange?.setRenderedOutsideRange(true);
        if (!firstAfterRange?.['[Controls/_display/GroupItem]']) {
            firstAfterRange?.setRenderedOutsideRange(true);
        }
    }

    resetRenderedItems(): void {
        const start = this.getStartIndex();
        const stop = this.getStopIndex();
        this.each((item, index) => {
            if (index < start || index >= stop) {
                item.setRendered(false);
            }
        });
    }

    getViewIterator(): IViewIterator<T> {
        return this._viewIterator;
    }

    nextVersion(): void {
        this._nextVersion();
    }

    getActionsVisibility(): TItemActionsVisibility {
        if (this._$itemActionsPosition === 'custom') {
            return 'hidden';
        }
        if (this._$itemActionsVisibility === 'visible') {
            return 'visible';
        }
        return 'onhover';
    }

    getActionsDisplayDelay(): boolean {
        return this._$itemActionsVisibility === 'delayed';
    }

    getActionsMenuConfig(): any {
        return this._actionsMenuConfig;
    }

    setActionsMenuConfig(config: any): void {
        this._actionsMenuConfig = config;
    }

    getActionsTemplateConfig(templateOptions?: any): IItemActionsTemplateConfig {
        // Не нужно изменять _actionsTemplateConfig, т.к. для разных элементов он будет разный
        const config = { ...this._actionsTemplateConfig };
        if (templateOptions && config) {
            if (templateOptions.actionStyle) {
                config.actionStyle = templateOptions.actionStyle;
            }
            if (templateOptions.editingStyle) {
                config.editingStyle = templateOptions.editingStyle;
            }
            if (templateOptions.actionPadding) {
                config.actionPadding = templateOptions.actionPadding;
            }
            if (templateOptions.iconStyle) {
                config.iconStyle = templateOptions.iconStyle;
            }
            if (templateOptions.actionMode) {
                config.actionMode = templateOptions.actionMode;
            }
            if (templateOptions.itemActionsClass) {
                config.itemActionsClass = templateOptions.itemActionsClass;
            }
        }
        return config;
    }

    setActionsTemplateConfig(config: IItemActionsTemplateConfig, silent?: boolean): void {
        if (!isEqual(this._actionsTemplateConfig, config)) {
            this._actionsTemplateConfig = config;
            if (!silent) {
                this._nextVersion();
            }
        }
    }

    setItemActionsPosition(itemActionsPosition: TItemActionsPosition): void {
        if (
            this._$itemActionsPosition === itemActionsPosition ||
            itemActionsPosition === undefined
        ) {
            return;
        }
        this._$itemActionsPosition = itemActionsPosition;
        this._nextVersion();
    }

    getItemActionsPosition(): TItemActionsPosition {
        return this._$itemActionsPosition;
    }

    setHoveredItem(item: T): void {
        if (this._hoveredItem === item) {
            return;
        }
        if (this._hoveredItem) {
            this._hoveredItem.setHovered(false);
        }
        if (item) {
            item.setHovered(true);
        }
        this._hoveredItem = item;
        this._nextVersion();
    }

    getHoveredItem(): T {
        return this._hoveredItem;
    }

    /**
     * Устанавливает флаг активности переданному элементу коллекции
     * @param item Элемент коллекции, для которого нужно обновить операции с записью
     * TODO работа с activeItem Должна производиться через item.isActive(),
     *  но из-за того, как в TileView организована работа с isHovered, isScaled и isAnimated
     *  мы не можем снять эти состояния при клике внутри ItemActions
     */
    setActiveItem(item: T): void {
        const oldActiveItem = this.getActiveItem();

        if (oldActiveItem) {
            oldActiveItem.setActive(false);
        }
        if (item) {
            item.setActive(true);
        }
        this._$activeItem = item;
        this._nextVersion();
    }

    /**
     * Получает текущий активный элемент коллекции
     * this.find((item) => item.isActive())
     */
    getActiveItem(): T {
        return this._$activeItem;
    }

    enableAnimation(animation): void {
        if (!this.getStrategyInstance(Animation)) {
            this.appendStrategy(Animation, { animation, itemModule: this._animationItemModule });
            this._nextVersion();
        }
    }

    disableAnimation(): void {
        if (this.getStrategyInstance(Animation)) {
            const strategy = this._composer.getInstance(Animation) as Animation;
            this.removeStrategy(Animation);
            strategy.destroy();
            this._reBuild(true);
            this._nextVersion();
        }
    }

    /**
     * Возвращает состояние "Модель в режиме редактирования".
     * В случае создания нового Item этот Item отсутствует в коллекции и мы не можем
     * в контроллере ItemActions определить, надо ли скрывать у остальных элементов его опции.
     * Если true, опции ItemActions не дожны быть отрисованы
     */
    isEditing(): boolean {
        return this._$isEditing;
    }

    /**
     * Устанавливает состояние "Модель в режиме редактирования".
     * В случае создания нового Item этот Item отсутствует в коллекции и мы не можем
     * в контроллере ItemActions определить, надо ли скрывать у остальных элементов его опции
     * Если true, опции ItemActions не дожны быть отрисованы
     */
    setEditing(editing: boolean): void {
        this._$isEditing = editing;
    }

    setAddingItem(item: T, options: { position: 'top' | 'bottom'; index?: number }): void {
        this._prependStrategy(
            AddStrategy,
            {
                item,
                addPosition: options.position,
                addIndex: options.index,
                groupMethod: this.getGroup(),
            },
            GroupItemsStrategy
        );
        this._updateEdgeItems();
    }

    resetAddingItem(): void {
        if (this.getStrategyInstance(AddStrategy)) {
            this.removeStrategy(AddStrategy);
            this._updateEdgeItems();
        }
    }

    getSwipeConfig(): ISwipeConfig {
        return this._swipeConfig;
    }

    setSwipeConfig(config: ISwipeConfig): void {
        if (!isEqual(this._swipeConfig, config)) {
            this._swipeConfig = config;
            this._nextVersion();
        }
    }

    protected _prependStrategy(
        strategy: new () => IItemsStrategy<S, T>,
        options?: object,
        before?: Function
    ): void {
        const strategyOptions = { ...options, display: this };
        let index = 0;

        const userStrategies = this._getUserStrategies();

        if (typeof before === 'function') {
            userStrategies.forEach((strObject, strIndex) => {
                if (strObject.strategy === before) {
                    index = strIndex;
                }
            });
        }

        userStrategies.splice(index, 0, {
            strategy,
            options: strategyOptions,
        });

        const session = this._startUpdateSession();
        if (this._composer) {
            this._composer.prepend(strategy, strategyOptions, before);
            this._reBuild();
        }
        this._finishUpdateSession(session);

        this.nextVersion();
    }

    appendStrategy(
        strategy: new () => IItemsStrategy<S, T>,
        options?: object,
        withSession: boolean = true
    ): void {
        const strategyOptions = { ...options, display: this };

        this._getUserStrategies().push({
            strategy,
            options: strategyOptions,
        });

        const session = withSession && this._startUpdateSession();
        if (this._composer) {
            this._composer.append(strategy, strategyOptions);
            this._reBuild();
        }
        this._finishUpdateSession(session);

        this.nextVersion();
    }

    getStrategyInstance<F extends IItemsStrategy<S, T>>(strategy: StrategyConstructor<F>): F {
        return this._composer.getInstance(strategy);
    }

    removeStrategy(strategy: new () => IItemsStrategy<S, T>, withSession: boolean = true): void {
        const userStrategies = this._getUserStrategies();
        const idx = userStrategies.findIndex((us) => {
            return us.strategy === strategy;
        });
        if (idx >= 0) {
            userStrategies.splice(idx, 1);

            const session = withSession && this._startUpdateSession();
            if (this._composer) {
                this._composer.remove(strategy);
                this._reBuild();
            }
            this._finishUpdateSession(session);

            this.nextVersion();
        }
    }

    reCreateStrategy(strategy: new () => IItemsStrategy<S, T>, options?: object): void {
        const instance = this.getStrategyInstance(strategy);
        if (instance) {
            const session = this._startUpdateSession();
            this.removeStrategy(strategy, false);
            this.appendStrategy(strategy, options, false);
            this._finishUpdateSession(session);
        }
    }

    getItemActionsProperty(): string {
        return this._$itemActionsProperty;
    }

    isStickyItemActions(): boolean {
        return this._$stickyItemActions;
    }

    /**
     * Возвращает модель для рендера футера списка
     */
    getFooter(): Footer {
        return this._footer;
    }

    /**
     * Пересоздает модель по которой рендерится футера списка
     */
    setFooter(options: IOptions<S, T>): void {
        let hasChanges: boolean;
        const footer = this.getFooter();

        // Если футер уже есть и в новых опциях задан шаблон для футера, то нужно обновить данные футера
        if (footer && options.footerTemplate) {
            hasChanges =
                this._$stickyFooter !== options.stickyFooter ||
                this._$footerTemplate !== options.footerTemplate;

            this._$stickyFooter = options.stickyFooter;
            this._$footerTemplate = options.footerTemplate;

            footer.setStickedToBottom(options.stickyFooter);
            footer.setContentTemplate(options.footerTemplate);
        }

        // Если футер уже есть и в новых опциях не задан шаблон для футера, то нужно сбросить футер
        if (footer && !options.footerTemplate) {
            hasChanges = true;
            this._footer = null;
            this._$stickyFooter = false;
            this._$footerTemplate = null;
        }

        // Если футера не было и в новых опциях он есть, то нужно создать его
        if (!footer && options.footerTemplate) {
            hasChanges = true;
            this._$stickyFooter = options.stickyFooter;
            this._$footerTemplate = options.footerTemplate;
            this._footer = this._initializeFooter(options);
        }

        if (hasChanges) {
            this._nextVersion();
        }
    }

    setStickyCallback(stickyCallback: Function): void {
        if (this._$stickyCallback !== stickyCallback) {
            this._$stickyCallback = stickyCallback;
            this._updateItemsProperty(
                'setStickyCallback',
                this._$stickyCallback,
                'setStickyCallback'
            );
            this._nextVersion();
        }
    }

    // region SerializableMixin

    _getSerializableState(state: IDefaultSerializableState): ISerializableState<S, T> {
        const resultState = SerializableMixin.prototype._getSerializableState.call(
            this,
            state
        ) as ISerializableState<S, T>;

        resultState._composer = this._composer;

        return resultState;
    }

    _setSerializableState(state: ISerializableState<S, T>): Function {
        const fromSerializableMixin = SerializableMixin.prototype._setSerializableState(state);
        return function (): void {
            fromSerializableMixin.call(this);

            this._composer = state._composer;

            if (this._composer) {
                // Restore link to _$sort in UserItemsStrategy instance
                const userStrategy = this._composer.getInstance(UserItemsStrategy);
                if (userStrategy) {
                    userStrategy.handlers = this._$sort;
                }

                // Restore link to _$group in GroupItemsStrategy instance
                const groupStrategy = this._composer.getInstance(GroupItemsStrategy);
                if (groupStrategy) {
                    groupStrategy.handler = this._$group;
                    groupStrategy.collapsedGroups = this._$collapsedGroups;
                }

                // Restore items contents before the getCollection() will be affected
                if (this._composer) {
                    const restoreItemsContents = (items, owner) => {
                        items.forEach((item) => {
                            if (item._contentsIndex !== undefined) {
                                item._$owner = owner; // Link to _$owner is not restored yet, force it
                                item.getContents(); // Force resolving item contents
                            }
                        });
                    };

                    try {
                        let itemsHolder = this._composer.getResult();
                        do {
                            if (itemsHolder._items) {
                                restoreItemsContents(itemsHolder._items, this);
                            }
                            itemsHolder = itemsHolder.source;
                        } while (itemsHolder);
                    } catch (err) {
                        if (typeof LOGGER !== undefined) {
                            LOGGER.error(err);
                        }
                    }
                }
            }
        };
    }

    /**
     * Рассчитывает идентификатор элемента коллекции.
     */
    protected _extractItemId(item: T): string {
        const contents = item.getContents();
        let uid;
        if (contents['[Types/_entity/Model]']) {
            uid = (contents as any).getId();
        } else if (this.getKeyProperty()) {
            uid = object.getPropertyValue(contents, this.getKeyProperty());
        } else {
            throw new Error('Option "keyProperty" must be defined to extract item unique id.');
        }

        return String(uid);
    }

    /**
     * Рассчитывает уникальный идентификатор элемента коллекции.
     * @param item Элемент коллекции
     * @param baseId Базовое значение
     */
    protected _searchItemUid(item: T, baseId: string): string {
        let uid = baseId;
        const itemsUid = this._itemsUid;
        let count = 0;
        while (itemsUid.has(uid)) {
            uid = baseId.concat('-', String(++count));
        }
        itemsUid.add(uid);

        return uid;
    }

    // endregion

    // endregion

    // region EventRaisingMixin

    protected _analizeUpdateSession(session: IEnumerableComparatorSession): void {
        if (session) {
            this._notifyBeforeCollectionChange();
        }

        super._analizeUpdateSession.call(this, session);

        if (session) {
            this._handleAfterCollectionChange();
        }
    }

    protected _notifyCollectionChange(
        action: string,
        newItems: ISessionItems<T>,
        newItemsIndex: number,
        oldItems: ISessionItems<T>,
        oldItemsIndex: number,
        reason?: string
    ): void {
        if (!this._isNeedNotifyCollectionChange()) {
            return;
        }

        this._notifyLater(
            'onCollectionChange',
            action,
            newItems,
            newItemsIndex,
            oldItems,
            oldItemsIndex,
            reason
        );
    }

    protected _notifyCollectionChangeBySession(
        session: IEnumerableComparatorSession,
        action: string,
        newItems: T[],
        newItemsIndex: number,
        oldItems: T[],
        oldItemsIndex: number
    ): void {
        if (!this._isNeedNotifyCollectionChange()) {
            return;
        }
        if (!session) {
            this._notifyLater(
                'onCollectionChange',
                action,
                newItems,
                newItemsIndex,
                oldItems,
                oldItemsIndex
            );
            return;
        }

        this._notifyCollectionChange(action, newItems, newItemsIndex, oldItems, oldItemsIndex);
    }

    // endregion

    // region Protected methods

    protected _updateItemsProperty(
        updateMethodName: string,
        newPropertyValue: any,
        conditionProperty?: string,
        silent?: boolean
    ): boolean {
        let wasUpdated = false;
        this._getItems().forEach((item: CollectionItem<S>) => {
            // todo Разобраться, почему item === undefined по
            //  https://online.sbis.ru/opendoc.html?guid=9018fdea-5de1-4b89-9f48-fb8ded0673cd
            if (item && (!conditionProperty || item[conditionProperty])) {
                item[updateMethodName](newPropertyValue, silent);
                wasUpdated = true;
            }
        });

        return wasUpdated;
    }

    // region Access

    /**
     * Добавляет свойство в importantItemProperties, если его еще там нет
     * @param name Название свойства
     * @protected
     */
    protected _setImportantProperty(name: string): void {
        const index = this._$importantItemProperties.indexOf(name);
        if (index === -1) {
            this._$importantItemProperties.push(name);
        }
    }

    /**
     * Удаляет свойство из importantItemProperties, если оно там есть
     * @param name Название свойства
     * @protected
     */
    protected _unsetImportantProperty(name: string): void {
        const index = this._$importantItemProperties.indexOf(name);
        if (index !== -1) {
            this._$importantItemProperties.splice(index, 1);
        }
    }

    /**
     * Модифицирует список важных свойств по наличию функторов среди пользовательских сортировок
     * @param add Добавить или удалить свойства
     * @protected
     */
    protected _switchImportantPropertiesByUserSort(add: boolean): void {
        for (let i = 0; i < this._$sort.length; i++) {
            functorToImportantProperties.call(this, this._$sort[i], add);
        }
    }

    /**
     * Модифицирует список важных свойств по функтору группировки
     * @param add Добавить или удалить свойства
     * @protected
     */
    protected _switchImportantPropertiesByGroup(add: boolean): void {
        functorToImportantProperties.call(this, this._$group, add);
    }

    /**
     * Настраивает контекст обработчиков
     * @protected
     */
    protected _bindHandlers(): void {
        this._onCollectionChange = onCollectionChange.bind(this);
        this._onCollectionItemChange = onCollectionItemChange.bind(this);
        this._oEventRaisingChange = onEventRaisingChange.bind(this);
        this._onCollectionPropertyChange = onCollectionPropertyChange.bind(this);
        this._onMetaResultsChange = onMetaResultsChange.bind(this);
    }

    protected _unbindHandlers(): void {
        this._onCollectionChange = null;
        this._onCollectionItemChange = null;
        this._oEventRaisingChange = null;
        this._onCollectionPropertyChange = null;
        this._onMetaResultsChange = null;
    }

    // endregion

    // region Initialization
    protected _initializeFooter(options: IOptions<S, T>): Footer {
        if (!options.footerTemplate) {
            return;
        }

        return new Footer(this._getFooterOptions(options));
    }

    protected _getFooterOptions(options: IOptions): IFooterOptions {
        return {
            owner: this,
            sticky: options.stickyFooter,
            backgroundStyle: options.footerBackgroundStyle,
            contentTemplate: options.footerTemplate,
            style: this.getStyle(),
            theme: this.getTheme(),
        };
    }

    // endregion

    // region Navigation

    /**
     * Возвращает элементы проекции (без учета сортировки, фильтрации и группировки)
     * @protected
     */
    protected _getItems(): T[] {
        return this._getItemsStrategy().items;
    }

    /**
     * Возвращает функцию, создающую элементы проекции
     * @protected
     */
    protected _getItemsFactory(): ItemsFactory<T> {
        return function CollectionItemsFactory(options?: ICollectionItemOptions<S>): T {
            options.owner = this;
            options.multiSelectVisibility = this._$multiSelectVisibility;
            options.multiSelectAccessibilityProperty = this._$multiSelectAccessibilityProperty;
            options.backgroundStyle = this.getBackgroundStyle();
            options.theme = this._$theme;
            options.style = this._$style;
            options.leftPadding = this._$leftPadding;
            options.rightPadding = this._$rightPadding;
            options.topPadding = this._$topPadding;
            options.bottomPadding = this._$bottomPadding;
            options.searchValue = this._$searchValue;
            options.roundBorder = this._$roundBorder;
            options.itemTemplateOptions = this._$itemTemplateOptions;
            options.hasMoreDataUp = this.hasMoreDataUp();
            options.isTopSeparatorEnabled = this._$rowSeparatorVisibility !== 'edges';
            options.isBottomSeparatorEnabled = false;
            options.isTopSeparatorEnabledReact = false;
            options.isBottomSeparatorEnabledReact = this._$rowSeparatorVisibility !== 'edges';
            options.isFirstItem = false;
            options.isLastItem = false;
            options.stickyCallback = this._$stickyCallback;
            options.rowSeparatorSize = this._$rowSeparatorSize;
            options.hoverBackgroundStyle = this._$hoverBackgroundStyle;
            options.directionality = this._$directionality;
            const key = options.contents && options.contents.getKey && options.contents.getKey();
            options.faded = this.getFadedKeys().includes(key);

            return create(options.itemModule || this._itemModule, options);
        };
    }

    /**
     * Возвращает cтратегию получения элементов проекции
     * @protected
     */
    protected _getItemsStrategy(): IItemsStrategy<S, T> {
        if (!this._composer) {
            this._composer = this._createComposer();
            this._initializeSpacingStrategy();
        }

        return this._composer.getResult();
    }

    /**
     * Сбрасывает построенную cтратегию получения элементов проекции
     * @protected
     */
    protected _resetItemsStrategy(): void {
        this._composer = null;
        this._userStrategies = null;
    }

    /**
     * Создает компоновщик стратегий
     * @protected
     */
    protected _createComposer(): ItemsStrategyComposer<S, T> {
        const composer = new ItemsStrategyComposer<S, T>();

        composer
            .append(DirectItemsStrategy, {
                display: this,
                localize: this._localize,
                keyProperty: this.getKeyProperty(),
                unique: this._$unique,
                validateUnique: this._$validateUnique,
                logError: this._$logError,
            })
            .append(UserItemsStrategy, {
                handlers: this._$sort,
            })
            .append(GroupItemsStrategy, {
                handler: this._$group,
                collapsedGroups: this._$collapsedGroups,
                hiddenGroupPosition: this._$hiddenGroupPosition,
                groupConstructor: this._getGroupItemConstructor(),
                groupViewMode: this._$groupViewMode,
                spaceItemModule: this._spaceItemModule,
                blocksGap: 's',
            });

        this._getUserStrategies().forEach((us) => {
            return composer.append(us.strategy, us.options);
        });

        return composer;
    }

    /**
     * Возвращает энумератор
     * @param unlink Отвязать от состояния проекции
     * @protected
     */
    protected _getEnumerator(unlink?: boolean): CollectionEnumerator<T> {
        return this._buildEnumerator(
            unlink ? this._getItems().slice() : this._getItems.bind(this),
            unlink ? this._filterMap.slice() : this._filterMap,
            unlink ? this._sortMap.slice() : this._sortMap
        );
    }

    /**
     * Конструирует энумератор по входным данным
     * @param items Элементы проекции
     * @param filterMap Фильтр: индекс в коллекции -> прошел фильтр
     * @param sortMap Сортировка: индекс в проекции -> индекс в коллекции
     * @protected
     */
    protected _buildEnumerator(
        items: T[],
        filterMap: boolean[],
        sortMap: number[]
    ): CollectionEnumerator<T> {
        return new CollectionEnumerator<T>({
            items,
            filterMap,
            sortMap,
        });
    }

    /**
     * Возвращает служебный энумератор для организации курсора
     * @protected
     */
    protected _getCursorEnumerator(): CollectionEnumerator<T> {
        return this._cursorEnumerator || (this._cursorEnumerator = this._getEnumerator());
    }

    /**
     * Возвращает служебный энумератор для поиска по свойствам и поиска следующего или предыдущего элемента
     * относительно заданного
     * @protected
     */
    protected _getUtilityEnumerator(): CollectionEnumerator<T> {
        return this._utilityEnumerator || (this._utilityEnumerator = this._getEnumerator());
    }

    /**
     * Возвращает соседний элемент проекции
     * @param enumerator Энумератор элементов
     * @param item Элемент проекции относительно которого искать
     * @param isNext Следующий или предыдущий элемент
     * @param [conditionProperty] Свойство, по которому происходит отбор элементов
     * @protected
     */
    protected _getNearbyItem(
        enumerator: CollectionEnumerator<T>,
        item: T,
        isNext: boolean,
        conditionProperty?: string
    ): T {
        return getFlatNearbyItem(enumerator, item, isNext, conditionProperty);
    }

    /**
     * Возвращает индекс элемента проекции по индексу в коллекции
     * @param index Индекс в коллекции
     * @protected
     */
    protected _getItemIndex(index: number): number {
        return this._getItemsStrategy().getDisplayIndex(index);
    }

    /**
     * Возвращает индекс в коллекции по индексу в проекции
     * @param index Индекс в проекции
     * @protected
     */
    protected _getSourceIndex(index: number): number {
        return this._getItemsStrategy().getCollectionIndex(index);
    }

    // endregion

    // region Calculation

    /**
     * Перерасчитывает все данные заново
     * @param [reset=false] Сбросить все созданные элементы
     * @protected
     */
    protected _reBuild(reset?: boolean): void {
        const itemsStrategy = this._getItemsStrategy();
        this._reIndex();

        if (reset) {
            this._itemsUid.clear();
            this._itemToUid.clear();
            itemsStrategy.reset();
        }

        this._reGroup();
        this._reSort();

        this._resetFilter(itemsStrategy.count);
        if (this._isFiltered()) {
            this._reFilter();
        }
    }

    /**
     * Производит фильтрацию и сортировку и анализ изменений для набора элементов проекции
     * @param [start=0] Начальный индекс (в коллекции)
     * @param [count] Кол-во элементов (по умолчанию - все)
     * @protected
     */
    protected _reAnalize(start?: number, count?: number): void {
        start = start || 0;

        const itemsStrategy = this._getItemsStrategy();
        const session = this._startUpdateSession();

        const indexBefore = itemsStrategy.getDisplayIndex(start);
        itemsStrategy.invalidate();
        const indexAfter = itemsStrategy.getDisplayIndex(start);

        if (count === undefined) {
            count = itemsStrategy.count - indexAfter;
        }

        this._reGroup(start, count);
        this._reSort();

        // If element is moved or user filter uses element indices then re-filter whole collection
        if (indexBefore !== indexAfter || this._isFilteredByIndex()) {
            this._reFilter();
        } else {
            this._reFilter(indexAfter, count);
        }

        this._finishUpdateSession(session);
    }

    /**
     * Вызывает переиндексацию
     * @protected
     */
    protected _reIndex(): void {
        this._getUtilityEnumerator().reIndex();
    }

    // endregion

    // region Changing

    /**
     * Сбрасывает фильтр: помечает все элементы как прошедшие фильтрацию
     * @protected
     */
    protected _resetFilter(count: number): void {
        this._filterMap.length = 0;
        for (let index = 0; index < count; index++) {
            this._filterMap.push(true);
        }
        this._reIndex();
    }

    /**
     * Производит фильтрацию для набора элементов проекции
     * @param [start=0] Начальный индекс
     * @param [count] Кол-во элементов (по умолчанию - все)
     * @protected
     */
    protected _reFilter(start?: number, count?: number): void {
        start = start || 0;
        count = count || this._getItemsStrategy().count - start;

        const filters = this._$filter;
        const filtersLength = filters.length;
        const items = this._getItems();
        const sortMap = this._sortMap;
        const sortMapLength = sortMap.length;
        const filterMap = this._filterMap;
        const processedIndices = new Set();
        const finish = start + count;
        let changed = false;
        let item;
        let position;
        let index;
        let prevGroup: GroupItem;
        let prevGroupIndex = -1;
        let prevGroupPosition = -1;
        let prevGroupHasMembers = false;
        let match;
        const isMatch = (itemLocal, indexLocal, positionLocal, hasMembers?: boolean) => {
            let result = true;
            let filter;
            for (let filterIndex = 0; filterIndex < filtersLength; filterIndex++) {
                filter = filters[filterIndex];
                const isAddingItem =
                    this.getStrategyInstance(AddStrategy) &&
                    this.getStrategyInstance(AddStrategy).getAddingItem() === itemLocal;
                result =
                    isAddingItem ||
                    filter(
                        itemLocal.getContents(),
                        indexLocal,
                        itemLocal,
                        positionLocal,
                        hasMembers,
                        prevGroup
                    );
                if (!result) {
                    break;
                }
            }
            return result;
        };
        const applyMatch = (matchLocal, indexLocal) => {
            const oldMatch = filterMap[indexLocal];
            if (matchLocal === oldMatch) {
                return false;
            }
            if (matchLocal) {
                filterMap[indexLocal] = matchLocal;
                return true;
            } else if (oldMatch !== undefined) {
                filterMap[indexLocal] = matchLocal;
                return true;
            }
            return false;
        };

        // Lookup every item in _sortMap order
        for (position = 0; position < sortMapLength; position++) {
            index = sortMap[position];

            // Check item index in range
            if (index === undefined || index < start || index >= finish) {
                continue;
            }

            processedIndices.add(index);
            item = items[index];
            match = true;
            if (item['[Controls/_display/SearchSeparator]']) {
                changed = applyMatch(true, index) || changed;
            } else if (item['[Controls/_display/GroupItem]']) {
                // A new group begin, check match for previous
                if (prevGroup) {
                    match = isMatch(
                        prevGroup,
                        prevGroupIndex,
                        prevGroupPosition,
                        prevGroupHasMembers
                    );

                    // Показываем группу только если у нее отображаются дети и она не свернута
                    // У свернутой группы тоже не отображаются дети, но мы должны эту группу отобразить
                    if (match) {
                        match = !prevGroup.isExpanded() || prevGroupHasMembers;
                    }
                    changed = applyMatch(match, prevGroupIndex) || changed;
                }

                // Remember current group as previous
                prevGroup = item;
                prevGroupIndex = index;
                prevGroupPosition = position;
                prevGroupHasMembers = false;
            } else {
                // Check item match
                match = isMatch(item, index, position);
                changed = applyMatch(match, index) || changed;
                if (match) {
                    prevGroupHasMembers = true;
                }
            }
        }

        for (index = start; index < finish; index++) {
            if (!processedIndices.has(index)) {
                filterMap[index] = undefined;
            }
        }

        // Check last group match
        if (prevGroup) {
            match = isMatch(prevGroup, prevGroupIndex, prevGroupPosition, prevGroupHasMembers);
            changed = applyMatch(match, prevGroupIndex) || changed;
        }

        if (changed) {
            this._reIndex();
        }
    }

    /**
     * Производит сортировку элементов
     * @protected
     */
    protected _reSort(): void {
        this._sortMap.length = 0;
        const items = this._buildSortMap();
        this._sortMap.push(...items);

        this._reIndex();
    }

    /**
     * Производит построение sortMap
     * @protected
     */
    protected _buildSortMap(): number[] {
        return this._getItems().map((item, index) => {
            return index;
        });
    }

    /**
     * Производит группировку для набора элементов проекции
     * @param [start=0] Начальный индекс (в коллекции)
     * @param [count] Кол-во элементов (по умолчанию - все)
     * @protected
     */
    protected _reGroup(start?: number, count?: number): void {
        if (!this._composer) {
            return;
        }
        this._composer.getResult().invalidate();
    }

    /**
     * Проверяет, что используется фильтрация
     * @protected
     */
    protected _isFiltered(): boolean {
        return this._$filter.length > 0;
    }

    /**
     * Проверяет, что хотя бы в один из методов фильтрации использует аргумент index
     * @protected
     */
    protected _isFilteredByIndex(): boolean {
        return this._$filter.some((filter) => {
            return this._isFilterUseIndex(filter);
        });
    }

    /**
     * Проверяет, что метод фильтрации использует аргумент index
     * @protected
     */
    protected _isFilterUseIndex(filter: FilterFunction<S>): boolean {
        return filter.length > 3;
    }

    /**
     * Проверяет, что используется группировка
     * @protected
     */
    protected _isGrouped(): boolean {
        return !!this._$group;
    }

    /**
     * Дробавляет набор элементов коллекции в проекцию
     * @param start Начальный индекс (в коллекции)
     * @param items Элементы
     * @return Начальный индекс (в проекциии)
     * @protected
     */
    protected _addItems(start: number, items: S[]): number {
        const isFiltered = this._isFiltered();
        const strategy = this._getItemsStrategy();
        const filterMap = [];
        const sortMap = [];
        const groupMap = [];

        strategy.splice(start, 0, items);
        const innerIndex = strategy.getDisplayIndex(start);

        items.forEach((item, index) => {
            filterMap.push(!isFiltered);
            sortMap.push(innerIndex + index);
            groupMap.push(undefined);
        });

        this._filterMap.splice(innerIndex, 0, ...filterMap);
        this._sortMap.splice(innerIndex, 0, ...sortMap);

        return innerIndex;
    }

    /**
     * Удаляет набор элементов проекции
     * @param start Начальный индекс (в коллекции)
     * @param [count] Кол-во элементов (по умолчанию - все)
     * @return Удаленные элементы
     * @protected
     */
    protected _removeItems(start: number, count?: number): T[] {
        start = start || 0;

        const strategy = this._getItemsStrategy();

        count = count === undefined ? strategy.count - start : count;

        const result = strategy.splice(start, count, []);
        const innerIndex = (result.start = strategy.getDisplayIndex(start));

        this._filterMap.splice(innerIndex, count);
        this._removeFromSortMap(innerIndex, count);

        return result;
    }

    /**
     * Заменяет набор элементов проекции
     * @param start Начальный индекс (в коллекции)
     * @param newItems Замененные элементы
     * @return Замененные элементы
     * @protected
     */
    protected _replaceItems(start: number, newItems: S[]): void {
        const strategy = this._getItemsStrategy();

        for (let index = 0; index < newItems.length; index++) {
            const sourceIndex = start + index;
            const displayIndex = strategy.getDisplayIndex(sourceIndex);
            const sourceItem = newItems[index];
            const displayItem = strategy.at(displayIndex);
            if (!displayItem['[Controls/_baseTree/BreadcrumbsItem]']) {
                displayItem.setContents(sourceItem);
            }
        }

        strategy.invalidate();
        this._nextVersion();
    }

    /**
     * Перемещает набор элементов проекции
     * @param newIndex Старый индекс (в коллекции)
     * @param oldIndex Новый индекс (в коллекции)
     * @param items Перемещаемые элементы
     * @return Перемещенные элементы
     * @protected
     */
    protected _moveItems(newIndex: number, oldIndex: number, items: any[]): T[] {
        const length = items.length;
        const strategy = this._getItemsStrategy();

        const movedItems = strategy.splice(oldIndex, length, []);
        strategy.splice(newIndex, 0, movedItems);
        movedItems.oldIndex = strategy.getDisplayIndex(oldIndex);

        return movedItems;
    }

    /**
     * Удаляет из индекса сортировки срез элементов
     * @param start Начальный индекс (в коллекци)
     * @param count Кол-во элементов
     * @protected
     */
    protected _removeFromSortMap(start: number, count: number): object {
        start = start || 0;
        count = count || 0;
        const finish = start + count;
        let index;
        let sortIndex;
        const toRemove = [];
        const removed = {};

        // Collect indices to remove
        for (index = start; index < finish; index++) {
            sortIndex = this._sortMap.indexOf(index);
            if (sortIndex > -1) {
                toRemove.push(sortIndex);
                removed[sortIndex] = this._sortMap[sortIndex];
            }
        }

        // Remove collected indices from _sortMap
        toRemove.sort((a, b) => {
            return a - b;
        });
        for (index = toRemove.length - 1; index >= 0; index--) {
            this._sortMap.splice(toRemove[index], 1);
        }

        // Shift _sortMap values by count from start index
        for (index = 0; index < this._sortMap.length; index++) {
            if (this._sortMap[index] >= start) {
                this._sortMap[index] -= count;
            }
        }

        this._reIndex();

        return removed;
    }

    /**
     * Возвращает набор контрольных свойств элемента проекции для анализа его состояния
     * @param item Элемент проекции
     * @protected
     */
    protected _getItemState(item: T): ISessionItemState<T> {
        return {
            item,
            selected: item.isSelected(),
        };
    }

    /**
     * Возвращает состояния элементов
     * @param items Элементы проекции
     * @protected
     */
    protected _getItemsState(items: T[]): ISessionItemState<T>[] {
        return items.map(this._getItemState);
    }

    /**
     * Возвращает разницу между двумя состояниями элементов (результатами работы метода _getItemsState)
     * @param before Состояния до изменений
     * @param after Состояния после изменений
     * @return Отличающиеся состояния
     * @protected
     */
    protected _getItemsDiff(before: ISessionItemState<T>[], after: ISessionItemState<T>[]): T[] {
        return after
            .filter((itemNow, index) => {
                const itemThen = before[index];
                return Object.keys(itemNow).some((prop) => {
                    return itemNow[prop] !== itemThen[prop];
                });
            })
            .map((element) => {
                return element.item;
            });
    }

    /**
     * Генерирует события об изменении элементов проекции при изменении их состояния
     * @param session Сессия изменений
     * @param items Измененные элементы
     * @param state Состояние элементов до изменений
     * @param beforeCheck Функция обратного вызова перед проверкой изменений состояния
     * @protected
     */
    protected _checkItemsDiff(
        session: IEnumerableComparatorSession,
        items: T[],
        state: any[],
        beforeCheck: Function
    ): void {
        const diff = state ? this._getItemsDiff(state, this._getItemsState(items)) : [];

        if (beforeCheck) {
            beforeCheck(diff, items);
        }

        // Notify changes by the diff
        if (diff.length) {
            this._notifyBeforeCollectionChange();
            this._extractPacksByList(this, diff, (itemsLocal, indexLocal) => {
                this._notifyCollectionChangeBySession(
                    session,
                    IObservable.ACTION_CHANGE,
                    itemsLocal,
                    indexLocal,
                    itemsLocal,
                    indexLocal
                );
            });
            this._handleAfterCollectionChange(items);
        }
    }

    /**
     * Нотифицирует событие change для измененных элементов
     * @param changed Измененные элементы исходной коллекции.
     * @param index Индекс исходной коллекции, в котором находятся элементы.
     * @protected
     */
    protected _notifyCollectionItemsChange(
        changed: any[],
        index: number,
        session: IEnumerableComparatorSession
    ): void {
        const items = this._getItems();
        const last = index + changed.length;
        const changedItems = [];

        // Extract display items contains changed
        for (let i = index; i < last; i++) {
            changedItems.push(items[this._getItemIndex(i)]);
        }

        this._notifyBeforeCollectionChange();
        this._extractPacksByList(this, changedItems, (pack, idx) => {
            this._notifyCollectionChangeBySession(
                session,
                IObservable.ACTION_CHANGE,
                pack,
                idx,
                pack,
                idx
            );
        });
        this._handleAfterCollectionChange(changedItems);
    }

    /**
     * Генерирует событие об изменении элемента проекции
     * @param event Дескриптор события.
     * @param item Измененный элемент коллекции.
     * @param index Индекс измененного элемента.
     * @param [properties] Изменившиеся свойства
     * @protected
     */
    protected _notifySourceCollectionItemChange(
        event: EventObject,
        item: any,
        index: number,
        properties?: object
    ): void {
        const enumerator = this._getUtilityEnumerator();
        const internalItems = this._getItems();
        const internalIndexBefore = this._getItemIndex(index);
        const internalItem = internalItems[internalIndexBefore];
        const indexBefore = enumerator.getInternalBySource(internalIndexBefore);
        const isEventRaising = this.isEventRaising();
        const session = this._startUpdateSession();
        let state;

        // Only changes of important properties can run analysis
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (this._$importantItemProperties.indexOf(key) > -1) {
                    if (isEventRaising) {
                        // Fix the state before analysis
                        state = this._getItemsState(internalItems);
                    }
                    this._reAnalize(index, 1);
                    break;
                }
            }
        }

        // Return here if events are disabled
        if (!isEventRaising) {
            return;
        }

        this._finishUpdateSession(session, false);

        // Check changes by state
        const internalIndexAfter = this._getItemIndex(index);
        const indexAfter = enumerator.getInternalBySource(internalIndexAfter);
        const isMoved = indexBefore !== indexAfter;
        this._checkItemsDiff(session, internalItems, state, (diff) => {
            // Some hard logic related with the character of item change.
            const internalItemIndex = diff.indexOf(internalItem);
            if (isMoved) {
                // Item change the position
                if (internalItemIndex > -1 && indexBefore > indexAfter) {
                    // Changed item is presented in the diff and moved up.
                    // It will be presented as a move event with that item in _finishUpdateSession.
                    // We should not notify about item change with the diff.
                    diff.splice(internalItemIndex, 1);
                } else if (internalItemIndex === -1 && indexBefore < indexAfter) {
                    // Changed item isn't presented in the diff and moved down.
                    // It won't be presented as a move event with that item in _finishUpdateSession (items after will
                    // move up). We should notify about item change with the diff.
                    diff.push(internalItem);
                }
            } else if (!isMoved && internalItemIndex === -1) {
                // Changed item don't change the position and not presented in the diff.
                // We should notify about item change with the diff.
                diff.push(internalItem);
            }
        });
    }

    /**
     * Генерирует событие о начале изменений коллекции
     * @protected
     */
    protected _notifyBeforeCollectionChange(): void {
        if (!this.isEventRaising()) {
            return;
        }
        this._notifyLater('onBeforeCollectionChange');
    }

    /**
     * Генерирует событие об окончании изменений коллекции
     * @protected
     */
    protected _notifyAfterCollectionChange(): void {
        if (!this.isEventRaising()) {
            return;
        }
        this._notify('onAfterCollectionChange');
    }

    protected _handleAfterCollectionChange(
        changedItems: ISessionItems<T> = [],
        changeAction?: string
    ): void {
        this._notifyAfterCollectionChange();
        // Нельзя проверять SelectableItem, т.к. элементы которые нельзя выбирать
        // тоже должны перерисоваться при изменении видимости чекбоксов
        this._updateItemsProperty(
            'setMultiSelectVisibility',
            this._$multiSelectVisibility,
            'setMultiSelectVisibility'
        );
        this._updateEdgeItems();
        this.getViewIterator().setIndices(this.getStartIndex(), this.getStopIndex());
    }

    protected _handleAfterCollectionItemChange(item: T, index: number, properties?: object): void {
        /* For override  */
    }

    protected _handleCollectionActionChange(newItems: T[]): void {
        /* For override  */
    }

    // region ItemsChanges

    // Методы вызываются непосредственно сразу после изменения элементов.
    // Используется, чтобы сделать дополнительные изменения в одной сессии.
    // В этом случае мы отправим только одно событие об изменении - это требование скролл контроллера

    protected _handleCollectionChangeAdd(): void {
        /* For override  */
    }

    protected _handleCollectionChangeRemove(): void {
        /* For override  */
    }

    protected _handleCollectionChangeReplace(): void {
        /* For override  */
    }

    // endregion ItemsChanges

    // endregion

    // endregion
}

Object.assign(Collection.prototype, {
    '[Controls/_display/Collection]': true,
    _moduleName: 'Controls/display:Collection',
    _$filter: null,
    _$group: null,
    _$sort: null,
    _$groupViewMode: null,
    _$groupProperty: null,
    _$groupingKeyCallback: null,
    _$displayProperty: 'title',
    _$itemTemplateProperty: '',
    _$itemsDragNDrop: false,
    _$multiSelectVisibility: 'hidden',
    _$multiSelectPosition: 'default',
    _$leftPadding: 'default',
    _$rightPadding: 'default',
    _$topPadding: 'default',
    _$bottomPadding: 'default',
    _$itemsSpacing: undefined,
    _$itemTemplateOptions: null,
    _$stickyMarkedItem: true,
    _$searchValue: '',
    _$editingConfig: undefined,
    _$unique: false,
    _$validateUnique: false,
    _$logError: null,
    _$importantItemProperties: null,
    _$hasMoreData: { up: false, down: false },
    _$compatibleReset: false,
    _$contextMenuConfig: null,
    _$itemActionsProperty: '',
    _$stickyItemActions: false,
    _$multiSelectAccessibilityProperty: '',
    _$multiSelectTemplate: null,
    _$style: 'default',
    _$theme: 'default',
    _$hoverBackgroundStyle: 'default',
    _$backgroundStyle: 'default',
    _$footerBackgroundStyle: 'default',
    _$fixedBackgroundStyle: null,
    _$rowSeparatorSize: null,
    _$rowSeparatorVisibility: 'all',
    _$itemsSpacingVisibility: 'items',
    _$hiddenGroupPosition: 'first',
    _$footerTemplate: null,
    _$stickyFooter: false,
    _$stickyCallback: undefined,
    _$fadedKeys: [],
    _$moreButtonVisibility: MoreButtonVisibility.visible,
    _$trackedProperties: null,
    _localize: false,
    _itemModule: 'Controls/display:CollectionItem',
    _spaceItemModule: 'Controls/display:SpaceCollectionItem',
    _itemsFactory: null,
    _composer: null,
    _sourceCollectionSynchronized: true,
    _sourceCollectionDelayedCallbacks: null,
    _utilityEnumerator: null,
    _onCollectionChange: null,
    _onCollectionItemChange: null,
    _oEventRaisingChange: null,
    _viewIterator: null,
    _actionsMenuConfig: null,
    _actionsTemplateConfig: null,
    _swipeConfig: null,
    _userStrategies: null,
    _disableSupportsGrouping: false,
    _$emptyTemplate: null,
    _$emptyTemplateOptions: null,
    _$itemActionsPosition: 'inside',
    _$itemActionsVisibility: 'onhover',
    _$roundBorder: null,
    _$task1184913014: false,
    _$directionality: null,
    _$adaptiveMode: null,
    getIdProperty: Collection.prototype.getKeyProperty,
});
