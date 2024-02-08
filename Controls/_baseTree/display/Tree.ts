/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import {
    CollectionEnumerator,
    Collection,
    ICollectionOptions,
    CollectionItem,
    itemsStrategy,
    IItemsStrategy,
    ISourceDataStrategy as IDataStrategy,
    ItemsFactory,
    ICollectionSerializableState as IDefaultSerializableState,
    ISessionItemState,
    StrategyConstructor,
    IDragPosition,
    ISourceCollection,
} from 'Controls/display';

import HierarchyDataStrategy from './dataStrategies/HierarchyDataStrategy';
import NodeFooter from './strategies/NodeFooter';
import NodeHeader from './strategies/NodeHeader';
import TreeDrag from './strategies/TreeDrag';
import AdjacencyListStrategy from './strategies/AdjacencyList';
import MaterializedPathStrategy from './strategies/MaterializedPath';
import RootStrategy from './strategies/Root';

import TreeItem, { IHasMore } from './TreeItem';
import { SpaceCollectionItem } from './SpaceCollectionItem';
import TreeChildren from './TreeChildren';
import { getTreeNearbyItem } from './NearbyItemUtils';
import { object } from 'Types/util';
import { Object as EventObject } from 'Env/Event';
import { TemplateFunction } from 'UI/Base';
import { CrudEntityKey } from 'Types/source';
import { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { IObservable, RecordSet } from 'Types/collection';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { TExpanderIconSize, TExpanderIconStyle, TSize, TKey } from 'Controls/interface';
import { TExpanderPosition, TExpanderVisibility } from '../interface/ITree';

type ItemsStrategyComposer = typeof itemsStrategy.Composer;
const DirectItemsStrategy = itemsStrategy.Direct;
const AddStrategy = itemsStrategy.Add;

export type TNodeFooterVisibilityCallback<S extends Model = Model> = (contents: S) => boolean;

export interface IHasMoreStorage {
    [key: string]: IHasMore;
}

export interface ISerializableState<S, T> extends IDefaultSerializableState<S, T> {
    _root: T;
}

export interface ITreeSessionItemState<T> extends ISessionItemState<T> {
    parent: T;
    childrenCount: number;
    level: number;
    node: boolean;
    expanded: boolean;
}

interface IItemsFactoryOptions<S> {
    contents?: S;
    nodeProperty?: string;
    hasChildrenProperty?: string;
    hasChildrenByRecordSet?: boolean;
    displayExpanderPadding?: boolean;
    expanded?: boolean;
    hasMore?: boolean;
    expanderPosition?: TExpanderPosition;
    expanderIconSize?: TExpanderIconSize;
    expanderIconStyle?: TExpanderIconStyle;
}

/**
 * Опции для создания Tree коллекции
 * @private
 */
export interface IOptions<S extends Model = Model, T extends TreeItem = TreeItem>
    extends ICollectionOptions<S, T> {
    parentProperty?: string;
    nodeProperty?: string;
    childrenProperty?: string;
    hasChildrenProperty?: string;
    loadedProperty?: string;
    root?: T | any;
    rootEnumerable?: boolean;
    hasMoreStorage?: IHasMoreStorage;
    expandedItems?: CrudEntityKey[];
    collapsedItems?: CrudEntityKey[];
    nodeFooterVisibilityCallback?: TNodeFooterVisibilityCallback;
    expanderSize?: string;
}

/**
 * Константа для типа узла: группа
 */
export const NODE_TYPE_PROPERTY_GROUP = 'group';

/**
 * Обрабатывает событие об изменении коллекции
 * @param event Дескриптор события.
 * @param action Действие, приведшее к изменению.
 * @param newItems Новые элементы коллекции.
 * @param newItemsIndex Индекс, в котором появились новые элементы.
 * @param oldItems Удаленные элементы коллекции.
 * @param oldItemsIndex Индекс, в котором удалены элементы.
 * @param reason
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
    // Fix state of all nodes
    const nodes = this.instance._getItems().filter((item) => {
        return item.isNode && item.isNode();
    });
    const state = this.instance._getItemsState(nodes);
    const session = this.instance._startUpdateSession();

    this.instance._reIndex();
    this.prev(event, action, newItems, newItemsIndex, oldItems, oldItemsIndex, reason);

    // Check state of all nodes. They can change children count (include hidden by filter).
    this.instance._finishUpdateSession(session, false);
    this.instance._checkItemsDiff(session, nodes, state);

    if (
        action === IObservable.ACTION_RESET ||
        action === IObservable.ACTION_ADD ||
        action === IObservable.ACTION_REMOVE
    ) {
        if (this.instance.getExpanderVisibility() === 'hasChildren') {
            this.instance._recountHasNodeWithChildren();
            if (!this.instance.getHasChildrenProperty()) {
                this.instance._recountHasChildrenByRecordSet();
            }
        }
        this.instance._recountHasNode();
    }

    if (action === IObservable.ACTION_CHANGE) {
        if (this.instance._isChangedValueInParentProperty(oldItems, newItems)) {
            this.instance._reCountHierarchy();
        }
    }
}

/**
 * Обрабатывает событие об изменении элемента коллекции
 * @param event Дескриптор события.
 * @param item Измененный элемент коллекции.
 * @param index Индекс измененного элемента.
 * @param properties Объект содержащий измененные свойства элемента
 */
function onCollectionItemChange<T extends Model>(
    event: EventObject,
    item: T,
    index: number,
    properties: Object
): void {
    this.instance._reIndex();
    this.prev(event, item, index, properties);

    if (properties.hasOwnProperty(this.instance.getNodeProperty())) {
        this.instance._recountHasNode();
    }

    if (this.instance.getExpanderVisibility() === 'hasChildren') {
        if (
            !this.instance.getHasChildrenProperty() &&
            (properties.hasOwnProperty(this.instance.getParentProperty()) ||
                properties.hasOwnProperty(this.instance.getNodeProperty()))
        ) {
            this.instance._recountHasChildrenByRecordSet();

            // нужно пересчитать, т.к. hasNodeWithChildren может считаться по рекордсету, если нет hasChildrenProperty
            this.instance._recountHasNodeWithChildren();
        } else if (properties.hasOwnProperty(this.instance.getHasChildrenProperty())) {
            this.instance._recountHasNodeWithChildren();
        }
    }

    if (this.instance._isChangedValueInParentProperty(null, null, properties)) {
        this.instance._reCountHierarchy();
    }
}

/**
 * Возвращает имя совйства с инвертированным смыслом
 */
function invertPropertyLogic(name: string): string {
    return name[0] === '!' ? name.slice(1) : '!' + name;
}

function validateOptions<S, T>(options: IOptions<S, T>): IOptions<S, T> {
    return options;
}

/**
 * Проекция в виде дерева - предоставляет методы навигации, фильтрации и сортировки, не меняя при этом оригинальную
 * коллекцию.
 * @remark
 * Дерево может строиться по алгоритму
 * {@link https://en.wikipedia.org/wiki/Adjacency_list Adjacency List} или
 * {@link https://docs.mongodb.com/v3.2/tutorial/model-tree-structures-with-materialized-paths/ Materialized Path}.
 * Выбор алгоритма выполняется в зависимости от настроек.
 * @extends Controls/_display/Collection
 * @public
 */
export default class Tree<
    S extends Model = Model,
    T extends TreeItem<S> = TreeItem<S>
> extends Collection<S, T> {
    readonly SupportNodeFooters: boolean;
    readonly SupportNodeHeaders: boolean;

    /**
     * @cfg {String} Название свойства, содержащего идентификатор родительского узла. Дерево в этом случае строится
     * по алгоритму Adjacency List (список смежных вершин). Также требуется задать {@link keyProperty}
     * @name Controls/_display/Tree#parentProperty
     */
    protected _$parentProperty: string;

    /**
     * @cfg {String} Название свойства, содержащего признак узла. Требуется для различения узлов и листьев.
     * @name Controls/_display/Tree#nodeProperty
     */
    protected _$nodeProperty: string;

    /**
     * @cfg {String} Название свойства, содержащего дочерние элементы узла. Дерево в этом случае строится по алгоритму
     * Materialized Path (материализованный путь).
     * @remark Если задано, то опция {@link parentProperty} не используется.
     * @name Controls/_display/Tree#childrenProperty
     */
    protected _$childrenProperty: string;

    /**
     * @cfg {String} Название свойства, содержащего признак наличия детей у узла
     * @name Controls/_display/Tree#hasChildrenProperty
     * @example
     * Зададим поле "Раздел$" отвечающим за признак загруженности:
     * <pre>
     *     new Tree({
     *         parentProperty: 'Раздел',
     *         hasChildrenProperty: 'Раздел$'
     *     })
     * </pre>
     *
     */
    protected _$hasChildrenProperty: string;

    /**
     * @cfg {Controls/_display/TreeItem|*} Корневой узел или его содержимое
     * @name Controls/_display/Tree#root
     */
    protected _$root: T | S;

    /**
     * Позиция экспандера
     */
    protected _$expanderPosition: TExpanderPosition;

    /**
     * Видимость экспандера
     */
    protected _$expanderVisibility: TExpanderVisibility;

    /**
     * Иконка экспандера
     */
    protected _$expanderIcon: string;

    /**
     * Размер экспандера
     */
    protected _$expanderSize: TSize;

    /**
     * Размер иконки разворота узла
     */
    protected _$expanderIconSize: TExpanderIconSize;

    /**
     * Стиль цвета иконки разворота узла
     */
    protected _$expanderIconStyle: TExpanderIconStyle;

    protected _$nodeMoreCaption: string;

    protected _$withoutLevelPadding: boolean;

    /**
     * @cfg {Boolean} Включать корневой узел в список элементов
     * @name Controls/_display/Tree#rootEnumerable
     * @example
     * Получим корень как первый элемент проекции:
     * <pre>
     *     var tree = new Tree({
     *         root: {id: null, title: 'Root'},
     *         rootEnumerable: true
     *     });
     *     tree.at(0).getContents().title;//'Root'
     * </pre>
     *
     */
    protected _$rootEnumerable: boolean;

    /**
     * Корневой элемент дерева
     */
    protected _root: T;

    /**
     * Соответствие узлов и их потомков
     */
    protected _childrenMap: object = {};
    /**
     * Объект, в котором хранится навигация для узлов
     * @protected
     */
    protected _$hasMoreStorage: IHasMoreStorage;

    /**
     * Темплейт заголовка узла
     * @protected
     */
    protected _$nodeHeaderTemplate: TemplateFunction;

    /**
     * Темплейт подвала узла
     * @protected
     */
    protected _$nodeFooterTemplate: TemplateFunction;

    /**
     * Колбэк, определяющий для каких узлов нужен подвал
     * @protected
     */
    protected _$nodeFooterVisibilityCallback: TNodeFooterVisibilityCallback;

    protected _$moreFontColorStyle: string;

    /**
     * Стратегия перетаскивания записей
     * @protected
     */
    protected _dragStrategy: StrategyConstructor<TreeDrag> = TreeDrag;
    private _$expandedItems: CrudEntityKey[];
    private _$collapsedItems: CrudEntityKey[];

    /**
     * Признак, означающий что есть узел с детьми
     * @protected
     */
    protected _hasNodeWithChildren: boolean;

    /**
     * Признак, означающий что в списке есть узел
     * @protected
     */
    protected _hasNode: boolean = null;

    /**
     * Признак, означающий что отступ вместо экспандеров нужно рисовать
     * @protected
     */
    protected _displayExpanderPadding: boolean;

    /**
     * Название модуля элементы, который будет создаваться в стратегии NodeFooter.
     * Задается с помощью Object.assign
     * @private
     */
    private _nodeFooterModule: string;

    /**
     * Название модуля элементы, который будет создаваться в стратегии NodeHeader.
     * Задается с помощью Object.assign
     * @private
     */
    private _nodeHeaderModule: string;

    /**
     * @cfg {String} Название свойства, содержащего тип узла.
     * @name Controls/_display/Tree#nodeTypeProperty
     * @see nodeProperty
     */
    protected _$nodeTypeProperty: string;

    getCurrent: () => T;

    // endregion Expanded/Collapsed

    // endregion

    // region Protected methods

    protected _getItemsStrategy: () => IItemsStrategy<S, T>;

    constructor(options?: IOptions<S, T>) {
        super(validateOptions<S, T>(options));

        if (this._$parentProperty) {
            this._setImportantProperty(this._$parentProperty);
        }
        if (this._$childrenProperty) {
            this._setImportantProperty(this._$childrenProperty);
        }

        if (this.getExpanderVisibility() === 'hasChildren') {
            this._recountHasNodeWithChildren();
        } else {
            this._recountHasNode();
        }
    }

    destroy(): void {
        this._childrenMap = {};

        super.destroy();
    }

    protected _initializeUserStrategies() {
        super._initializeUserStrategies();

        if (this.SupportNodeHeaders) {
            this._userStrategies.unshift({
                strategy: this.getNodeHeaderStrategyCtor(),
                options: {
                    display: this,
                    extraItemModule: this._nodeHeaderModule,
                },
            });
        }

        if (this.SupportNodeFooters) {
            this._userStrategies.unshift({
                strategy: this.getNodeFooterStrategyCtor(),
                options: {
                    display: this,
                    extraItemVisibilityCallback: this._$nodeFooterVisibilityCallback,
                    extraItemModule: this._nodeFooterModule,
                },
            });
        }

        if (!this._$childrenProperty) {
            this._userStrategies.unshift({
                strategy: AdjacencyListStrategy,
                options: {
                    keyProperty: this.getKeyProperty(),
                    parentProperty: this._$parentProperty,
                    nodeProperty: this._$nodeProperty,
                    hasChildrenProperty: this._$hasChildrenProperty,
                },
            });
        }
    }

    protected _createDataStrategy(options: IOptions<S>): IDataStrategy {
        return new HierarchyDataStrategy(options);
    }

    // region SerializableMixin

    _getSerializableState(state: IDefaultSerializableState<S, T>): ISerializableState<S, T> {
        const resultState = super._getSerializableState(state) as ISerializableState<S, T>;

        resultState._root = this._root;

        return resultState;
    }

    _setSerializableState(state: ISerializableState<S, T>): Function {
        const fromSuper = super._setSerializableState(state);
        return function (): void {
            this._root = state._root;
            fromSuper.call(this);
        };
    }
    // endregion

    // region Collection

    // region Expander

    getExpanderPosition(): TExpanderPosition {
        return this._$expanderPosition;
    }

    setExpanderPosition(position: TExpanderPosition) {
        if (this._$expanderPosition === position) {
            return false;
        }

        this._$expanderPosition = position;
        this._updateItemsProperty('setExpanderPosition', position, '[Controls/_display/TreeItem]');
        this._nextVersion();
    }

    getExpanderVisibility(): TExpanderVisibility {
        return this._$expanderVisibility;
    }

    setExpanderVisibility(expanderVisibility: string): void {
        if (this._$expanderVisibility !== expanderVisibility) {
            this._$expanderVisibility = expanderVisibility;
            this._nextVersion();

            if (expanderVisibility === 'hasChildren') {
                this._recountHasNodeWithChildren();
            }
        }
    }

    getExpanderIcon(): string {
        return this._$expanderIcon;
    }

    setExpanderSize(newSize: TSize): void {
        if (this._$expanderSize !== newSize) {
            this._$expanderSize = newSize;
            this._nextVersion();
        }
    }

    getExpanderSize(): TSize {
        return this._$expanderSize;
    }

    setExpanderIconSize(expanderIconSize: TExpanderIconSize): void {
        if (this._$expanderIconSize !== expanderIconSize) {
            this._$expanderIconSize = expanderIconSize;
            this._updateItemsProperty(
                'setExpanderIconSize',
                expanderIconSize,
                'setExpanderIconSize'
            );
            this._nextVersion();
        }
    }

    setWithoutLevelPadding(withoutLevelPadding: boolean): void {
        if (this._$withoutLevelPadding !== withoutLevelPadding) {
            this._$withoutLevelPadding = withoutLevelPadding;
            this._updateItemsProperty(
                'setWithoutLevelPadding',
                withoutLevelPadding,
                'setWithoutLevelPadding'
            );
            this._nextVersion();
        }
    }

    setExpanderIconStyle(expanderIconStyle: TExpanderIconStyle): void {
        if (this._$expanderIconStyle !== expanderIconStyle) {
            this._$expanderIconStyle = expanderIconStyle;
            this._updateItemsProperty(
                'setExpanderIconStyle',
                expanderIconStyle,
                'setExpanderIconStyle'
            );
            this._nextVersion();
        }
    }

    protected _recountDisplayExpanderPadding(): void {
        const newValue =
            this.getExpanderIcon() !== 'none' &&
            this.getExpanderPosition() === 'default' &&
            (this.areNotAtRoot() ||
                (this.getExpanderVisibility() === 'hasChildren'
                    ? this.hasNodeWithChildren()
                    : this.hasNode()));
        this._setDisplayExpanderPadding(newValue);
    }

    protected _setDisplayExpanderPadding(newValue: boolean): void {
        if (this._displayExpanderPadding !== newValue) {
            this._displayExpanderPadding = newValue;
            this._updateItemsProperty(
                'setDisplayExpanderPadding',
                newValue,
                'setDisplayExpanderPadding'
            );
            this._nextVersion();
        }
    }

    areNotAtRoot(): boolean {
        const breadCrumbsPath = this?.getMetaData()?.path;
        let breadCrumbsCount = 0;
        if (breadCrumbsPath instanceof RecordSet) {
            breadCrumbsCount = breadCrumbsPath.getCount();
        } else if (breadCrumbsPath instanceof Array) {
            breadCrumbsCount = breadCrumbsPath.length;
        }
        return breadCrumbsCount > 0;
    }

    // endregion Expander

    // region Drag-n-drop

    setDragPosition(position: IDragPosition<T>): void {
        const dragStrategy = this.getStrategyInstance(this._dragStrategy) as TreeDrag;

        if (dragStrategy) {
            const targetNode = this._getDragTargetNode();
            if (targetNode) {
                targetNode.setDragTargetNode(false);
                this._nextVersion();
            }

            if (position.position === 'on') {
                if (
                    dragStrategy.avatarItem !== position.dispItem &&
                    !position.dispItem.isDragTargetNode()
                ) {
                    position.dispItem.setDragTargetNode(true);
                    this._nextVersion();
                }
                return;
            }

            super.setDragPosition(position);
        }
    }

    resetDraggedItems(): void {
        const dragStrategy = this.getStrategyInstance(this._dragStrategy) as TreeDrag;

        if (dragStrategy) {
            const targetNode = this._getDragTargetNode();
            if (targetNode) {
                targetNode.setDragTargetNode(false);
            }
            super.resetDraggedItems();
        }
    }

    protected _getDragTargetNode(): TreeItem {
        // Выполняем поиск, т.к. позиция может смениться сразу на несколько элементов
        // и не факт, что в предыдущей позиции был targetNode
        return this.find((item) => {
            return item.DraggableItem && item.isDragTargetNode();
        });
    }

    // endregion Drag-n-drop

    // region nodeTypeProperty

    setNodeTypeProperty(nodeTypeProperty: string): void {
        this._$nodeTypeProperty = nodeTypeProperty;
        this._nextVersion();
    }

    getNodeTypeProperty(): string {
        return this._$nodeTypeProperty;
    }

    // endregion

    // region NodeFooter

    getNodeMoreCaption(): string {
        return this._$nodeMoreCaption;
    }

    getNodeFooterTemplate(): TemplateFunction {
        return this._$nodeFooterTemplate;
    }

    getNodeHeaderTemplate(): TemplateFunction {
        return this._$nodeHeaderTemplate;
    }

    setNodeFooterTemplate(nodeFooterTemplate: TemplateFunction): void {
        // Нас интересует только скрытие или показ футера. Во всех остальных случаях ничего не делаем,
        // т.к. контентная опция на каждый рендер имеет новую ссылку. Вызывать пересчет на каждый рендер нет смысла.
        const shouldRebuildNodeFooters =
            (!this._$nodeFooterTemplate && nodeFooterTemplate) ||
            (this._$nodeFooterTemplate && !nodeFooterTemplate);

        if (this._$nodeFooterTemplate !== nodeFooterTemplate) {
            this._$nodeFooterTemplate = nodeFooterTemplate;
            this._updateItemsProperty(
                'setNodeFooterTemplate',
                nodeFooterTemplate,
                '[Controls/tree:TreeNodeFooterItem]'
            );
            this._nextVersion();
        }

        if (shouldRebuildNodeFooters) {
            // reset=true - нужно сразу пересчитать футеры, т.к. наличие/отсутствие темплейта
            // может показать/скрыть футеры. А если пересчет вызовется в for-е, то не будет события об изменения items.
            this._reBuildNodeFooters(true);
        }
    }

    setNodeHeaderTemplate(nodeHeaderTemplate: TemplateFunction): void {
        // Нас интересует только скрытие или показ футера. Во всех остальных случаях ничего не делаем,
        // т.к. контентная опция на каждый рендер имеет новую ссылку. Вызывать пересчет на каждый рендер нет смысла.
        const shouldRebuildNodeFooters =
            (!this._$nodeHeaderTemplate && nodeHeaderTemplate) ||
            (this._$nodeHeaderTemplate && !nodeHeaderTemplate);

        if (this._$nodeHeaderTemplate !== nodeHeaderTemplate) {
            this._$nodeHeaderTemplate = nodeHeaderTemplate;
            this._updateItemsProperty(
                'setNodeHeaderTemplate',
                nodeHeaderTemplate,
                '[Controls/tree:TreeNodeHeaderItem]'
            );
            this._nextVersion();
        }

        if (shouldRebuildNodeFooters) {
            // reset=true - нужно сразу пересчитать футеры, т.к. наличие/отсутствие темплейта
            // может показать/скрыть футеры. А если пересчет вызовется в for-е, то не будет события об изменения items.
            this._reBuildNodeHeaders(true);
        }
    }

    setNodeFooterVisibilityCallback(callback: TNodeFooterVisibilityCallback): void {
        if (this._$nodeFooterVisibilityCallback !== callback) {
            this._$nodeFooterVisibilityCallback = callback;

            // Нужно пересоздавать стратегию, чтобы Composer правильно запомнил опции для нее
            this.reCreateStrategy(this.getNodeFooterStrategyCtor(), {
                extraItemVisibilityCallback: callback,
                extraItemModule: this._nodeFooterModule,
            });

            this._nextVersion();
        }
    }

    setHasMoreStorage(storage: IHasMoreStorage, reBuildNodeFooters: boolean = false): void {
        if (!isEqual(this._$hasMoreStorage, storage)) {
            this._$hasMoreStorage = storage;
            this._updateItemsHasMore(storage);
            if (reBuildNodeFooters) {
                this._reBuildNodeHeaders(true);
                this._reBuildNodeFooters(true);
            }
            this._nextVersion();
        }
    }

    getHasMoreStorage(): IHasMoreStorage {
        return this._$hasMoreStorage;
    }

    getMoreFontColorStyle(): string {
        return this._$moreFontColorStyle;
    }

    setMoreFontColorStyle(moreFontColorStyle: string): void {
        if (this._$moreFontColorStyle !== moreFontColorStyle) {
            this._$moreFontColorStyle = moreFontColorStyle;
            this._updateItemsProperty(
                'setMoreFontColorStyle',
                moreFontColorStyle,
                '[Controls/tree:TreeNodeFooterItem]'
            );
            this._nextVersion();
        }
    }

    private _updateItemsHasMore(storage: IHasMoreStorage): void {
        Object.keys(storage).forEach((key) => {
            // hasMoreStorage обновляется до expandedItems, поэтому вложенный узел может быть еще скрыт фильтром,
            // но для него нужно обновить hasMore
            const item = this.getItemBySourceKey(key, false);
            if (item && item['[Controls/_display/TreeItem]']) {
                item.setHasMoreStorage(storage[key]);
            }
        });
    }

    // endregion NodeFooter

    // region NodeHeader

    hasNodeHeaderConfig(): boolean {
        return false;
    }

    // endregion NodeHeader

    setCollection(newCollection: ISourceCollection<S>): void {
        super.setCollection(newCollection);
        if (this.getExpanderVisibility() === 'hasChildren') {
            this._recountHasNodeWithChildren();
            if (!this.getHasChildrenProperty()) {
                this._recountHasChildrenByRecordSet();
            }
        }
        this._recountHasNode();
    }

    getIndexBySourceItem(item: any): number {
        if (this._$rootEnumerable && this.getRoot().getContents() === item) {
            return 0;
        }
        return super.getIndexBySourceItem(item);
    }

    setKeyProperty(keyProperty: string): void {
        super.setKeyProperty(keyProperty);
        const adjacencyList =
            this._composer.getInstance<AdjacencyListStrategy<S, T>>(AdjacencyListStrategy);
        if (adjacencyList) {
            adjacencyList.keyProperty = keyProperty;
        }
    }

    protected _extractItemId(item: T): string {
        const path = [super._extractItemId(item)];

        let parent: T;
        while (
            item instanceof TreeItem &&
            (parent = item.getParent() as T) &&
            parent instanceof TreeItem &&
            !parent.isRoot()
        ) {
            path.push(super._extractItemId(parent));
            item = parent;
        }

        return path.join(':');
    }

    // endregion

    // region Public methods

    // region ParentProperty

    /**
     * Возвращает название свойства, содержащего идентификатор родительского узла
     */
    getParentProperty(): string {
        return this._$parentProperty;
    }

    /**
     * Устанавливает название свойства, содержащего идентификатор родительского узла
     */
    setParentProperty(name: string): void {
        if (this._$parentProperty !== name) {
            const session = this._startUpdateSession();
            this._unsetImportantProperty(this._$parentProperty);
            this._$parentProperty = name;

            this._resetItemsStrategy();
            this._setImportantProperty(name);
            this._reBuild(true);
            this._finishUpdateSession(session, true);
        }
    }

    /**
     * @param oldItems
     * @param newItems
     * @param changedProperties Объект содержащий измененные свойства элемента
     * @private
     */
    protected _isChangedValueInParentProperty(
        oldItems?: S[],
        newItems?: S[],
        changedProperties?: Object
    ): boolean {
        if (changedProperties) {
            return changedProperties.hasOwnProperty(this.getParentProperty());
        } else {
            let changed = false;

            for (let i = 0; i < oldItems.length; i++) {
                // oldItem и newItem в событии приходят как один и тот же рекорд, поэтому мы не можем узнать
                // так старое значение, но у нас есть CollectionItem, в котором хрантся старое значение
                const oldCollectionItem = this.getItemBySourceItem(oldItems[i]);
                // элемента может не быть, например если у нового элемента задали parent и он не отобразился
                // и сразу же в нем что-то изменили. И сюда может прийти, например, группа -> проверяем на TreeItem
                if (!oldCollectionItem || !oldCollectionItem['[Controls/_display/TreeItem]']) {
                    continue;
                }

                const newValue = newItems[i].get(this.getParentProperty());
                if (this._changedParent(oldCollectionItem, newValue)) {
                    changed = true;
                    break;
                }
            }

            return changed;
        }
    }

    protected _changedParent(oldItem: T, newParentValue: boolean): boolean {
        const oldItemParent = oldItem.getParent();
        const oldValue = oldItemParent.isRoot()
            ? oldItemParent.getContents()
            : oldItemParent.getContents().getKey();
        return newParentValue !== oldValue;
    }

    protected _reCountHierarchy(): void {
        const session = this._startUpdateSession();

        // invalidate нужно позвать у всех стратегий, а не только начиная c AdjacencyListStrategy
        const itemsStrategy = this._getItemsStrategy();
        itemsStrategy.invalidate();
        this._childrenMap = {};

        this._finishUpdateSession(session, true);
    }

    // endregion ParentProperty

    /**
     * Возвращает название свойства, содержащего признак узла
     */
    getNodeProperty(): string {
        return this._$nodeProperty;
    }

    setNodeProperty(nodeProperty: string): void {
        if (this._$nodeProperty !== nodeProperty) {
            const session = this._startUpdateSession();
            this._$nodeProperty = nodeProperty;
            this._reBuild(true);
            this._nextVersion();
            this._finishUpdateSession(session, true);
        }
    }

    /**
     * Возвращает название свойства, содержащего дочерние элементы узла
     */
    getChildrenProperty(): string {
        return this._$childrenProperty;
    }

    setChildrenProperty(childrenProperty: string): void {
        if (this._$childrenProperty !== childrenProperty) {
            this._$childrenProperty = childrenProperty;
            this.getSourceDataStrategy().updateOptions({ childrenProperty });
            this._nextVersion();
        }
    }

    /**
     * Возвращает название свойства, содержащего признак наличия детей у узла
     */
    getHasChildrenProperty(): string {
        return this._$hasChildrenProperty;
    }

    setHasChildrenProperty(hasChildrenProperty: string): void {
        if (this._$hasChildrenProperty !== hasChildrenProperty) {
            this._$hasChildrenProperty = hasChildrenProperty;
            this._updateItemsProperty(
                'setHasChildrenProperty',
                hasChildrenProperty,
                '[Controls/_display/TreeItem]'
            );
            this._nextVersion();

            if (this.getExpanderVisibility() === 'hasChildren') {
                this._recountHasNodeWithChildren();
                if (!this.getHasChildrenProperty()) {
                    this._recountHasChildrenByRecordSet();
                }
            }
        }
    }

    /**
     * Возвращает корневой узел дерева
     */
    getRoot(): T {
        if (this._root === null) {
            this._root = this._$root;
            if (!(this._root instanceof TreeItem)) {
                this._root = new TreeItem<S>({
                    contents: this._root,
                    owner: this as any,
                    expanded: true,
                    hasChildren: false,
                }) as T;
            }
        }

        return this._root;
    }

    /**
     * Устанавливает корневой узел дерева
     * @param root Корневой узел или его содержимое
     * @param reBuild
     */
    setRoot(root: T | any, reBuild: boolean = true): void {
        if (this._$root === root) {
            return;
        }

        this._$root = root;
        this._root = null;

        if (reBuild) {
            this._reBuildNodeHeaders(true);
            this._reBuildNodeFooters(true);
            this._reIndex();
            this._reAnalize();
            this._updateEdgeItems();
            this._recountHasNode();
        }
    }

    /**
     * Возвращает признак, что корневой узел включен в список элементов
     */
    isRootEnumerable(): boolean {
        return this._$rootEnumerable;
    }

    /**
     * Устанавливает признак, что корневой узел включен в список элементов
     * @param enumerable Корневой узел включен в список элементов
     */
    setRootEnumerable(enumerable: boolean): void {
        if (this._$rootEnumerable === enumerable) {
            return;
        }

        const session = this._startUpdateSession();

        this._$rootEnumerable = enumerable;
        if (enumerable) {
            this._wrapRootStrategy(this._composer);
        } else {
            this._unwrapRootStrategy(this._composer);
        }

        this._reSort();
        this._reFilter();
        this._finishUpdateSession(session);
    }

    /**
     * Возвращает уровень вложенности корня дерева
     */
    getRootLevel(): number {
        return this.isRootEnumerable() ? 1 : 0;
    }

    /**
     * Возвращает коллекцию потомков элемента коллекции
     * @param parent Родительский узел
     * @param [withFilter=true] Учитывать {@link setFilter фильтр}
     */
    getChildren(parent: T, withFilter?: boolean): TreeChildren<S> {
        return new TreeChildren<S>({
            owner: parent,
            items: this._getChildrenArray(parent, withFilter),
        });
    }

    // region Expanded/Collapsed

    getExpandedItems(): CrudEntityKey[] {
        return this._$expandedItems || [];
    }

    getCollapsedItems(): CrudEntityKey[] {
        return this._$collapsedItems || [];
    }

    setExpandedItems(expandedKeys: TKey[]): void {
        if (isEqual(this.getExpandedItems(), expandedKeys)) {
            return;
        }

        const diff = ArraySimpleValuesUtil.getArrayDifference(
            this.getExpandedItems(),
            expandedKeys
        );
        const expandAll = diff.added[0] === null;

        // запоминаем все изменения и отправляем их за один раз. Вместо множества событий от каждого элемента
        const session = this._startUpdateSession();

        // region Удаленные ключи нужно свернуть
        // удаленные ключи сворачиваем только, если не развернули все узлы
        if (!expandAll) {
            if (diff.removed[0] === null) {
                this._getItems().forEach((item) => {
                    // TODO: не должен общий модуль знать про конкретную реализацию TreeGridNodeFooterRow
                    //  getContents() у TreeGridNodeFooterRow должен придерживаться контракта и возвращать
                    //  Model а не строку
                    if (
                        !item['[Controls/_display/TreeItem]'] ||
                        item['[Controls/treeGrid:TreeGridNodeFooterRow]'] ||
                        item['[Controls/treeGrid:TreeGridNodeHeaderRow]']
                    ) {
                        return;
                    }

                    const key = item.key;
                    if (diff.added.includes(key)) {
                        return;
                    }

                    item.setExpanded(false, true);
                });
            } else {
                diff.removed.forEach((id) => {
                    const item = this.getItemBySourceKey(id, false);
                    if (item && item['[Controls/_display/TreeItem]']) {
                        item.setExpanded(false, true);
                    }
                });
            }
        }
        // endregion

        // region Добавленные ключи нужно развернуть
        if (expandAll) {
            this._getItems().forEach((item) => {
                if (!item['[Controls/_display/TreeItem]'] || item.isNode() === null) {
                    return;
                }

                item.setExpanded(true, true);
            });
        } else {
            diff.added.forEach((id) => {
                const item = this.getItemBySourceKey(id, false);
                if (item && item['[Controls/_display/TreeItem]']) {
                    item.setExpanded(true, true);
                }
            });
        }
        // endregion

        this._$expandedItems = [...expandedKeys];

        // пересчитываем все один раз вместо множества пересчетов на каждое событие об изменении элемента
        this._reBuildNodeHeaders();
        this._reBuildNodeFooters();
        this._reSort();
        this._reFilter();

        this._finishUpdateSession(session);
        this._nextVersion();

        this._updateEdgeItems();
    }

    setCollapsedItems(collapsedKeys: TKey[]): void {
        if (isEqual(this.getCollapsedItems(), collapsedKeys)) {
            return;
        }

        // TODO зарефакторить по задаче https://online.sbis.ru/opendoc.html?guid=5d8d38d0-3ade-4393-bced-5d7fbd1ca40b
        const diff = ArraySimpleValuesUtil.getArrayDifference(
            this.getCollapsedItems(),
            collapsedKeys
        );

        // запоминаем все изменения и отправляем их за один раз. Вместо множества событий от каждого элемента
        const session = this._startUpdateSession();

        diff.removed.forEach((it) => {
            const item = this.getItemBySourceKey(it);
            if (item && item['[Controls/_display/TreeItem]']) {
                item.setExpanded(true, true);
            }
        });

        collapsedKeys.forEach((key) => {
            const item = this.getItemBySourceKey(key);
            if (item && item['[Controls/_display/TreeItem]']) {
                item.setExpanded(false, true);
            }
        });

        this._$collapsedItems = [...collapsedKeys];

        // пересчитываем все один раз вместо множества пересчетов на каждое событие об изменении элемента
        this._reBuildNodeHeaders();
        this._reBuildNodeFooters();
        this._reSort();
        this._reFilter();

        this._finishUpdateSession(session);
        this._nextVersion();

        this._updateEdgeItems();
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const parent = super._getItemsFactory();

        return function TreeItemsFactory(options: IItemsFactoryOptions<S>): T {
            options.nodeProperty = this.getNodeProperty();
            options.hasChildrenProperty = this.getHasChildrenProperty();
            options.displayExpanderPadding = this._displayExpanderPadding;
            options.expanderPosition = this.getExpanderPosition();
            options.expanderIconStyle = this._$expanderIconStyle;
            options.expanderIconSize = this._$expanderIconSize;
            options.withoutLevelPadding = this._$withoutLevelPadding;
            options.nodeHeaderTemplate = this.getNodeHeaderTemplate();
            options.nodeFooterTemplate = this.getNodeFooterTemplate();

            const key = object.getPropertyValue<CrudEntityKey>(
                options.contents,
                this.getKeyProperty()
            );
            options.expanded =
                this.getExpandedItems().includes(key) ||
                (this.getExpandedItems().includes(null) && !this.getCollapsedItems().includes(key));

            if (this.getHasMoreStorage() && this.getHasMoreStorage()[key]) {
                options.hasMore = this.getHasMoreStorage()[key];
            }

            return parent.call(this, options);
        };
    }

    protected _createComposer(): ItemsStrategyComposer<S, T> {
        const composer = super._createComposer();

        if (this._$childrenProperty) {
            composer.remove(DirectItemsStrategy);
            composer.prepend(MaterializedPathStrategy, {
                display: this,
                childrenProperty: this._$childrenProperty,
                nodeProperty: this._$nodeProperty,
                hasChildrenProperty: this._$hasChildrenProperty,
                root: this.getRoot.bind(this),
            });
        }

        this._wrapRootStrategy(composer);

        return composer;
    }

    protected _wrapRootStrategy(composer: ItemsStrategyComposer<S, CollectionItem<S>>): void {
        if (this._$rootEnumerable && !composer.getInstance(RootStrategy)) {
            composer.append(RootStrategy, {
                root: this.getRoot.bind(this),
            });
        }
    }

    protected _unwrapRootStrategy(composer: ItemsStrategyComposer<S, CollectionItem<S>>): void {
        if (!this._$rootEnumerable) {
            composer.remove(RootStrategy);
        }
    }

    protected _spaceItemFactory(item: T): SpaceCollectionItem {
        const spaceItem = super._spaceItemFactory(item);
        const parent = item['[Controls/_display/TreeItem]'] ? item.getParent() : this.getRoot();
        spaceItem.setParent(parent);
        return spaceItem;
    }

    protected _reIndex(): void {
        super._reIndex();
        this._childrenMap = {};
    }

    protected getNodeFooterStrategyCtor(): typeof NodeFooter {
        return NodeFooter;
    }

    protected getNodeHeaderStrategyCtor(): typeof NodeHeader {
        return NodeHeader;
    }

    protected _reBuildNodeHeaders(reset: boolean = false): void {
        if (this.SupportNodeHeaders) {
            const itemsStrategy = this._getItemsStrategy();

            if (reset) {
                const session = this._startUpdateSession();
                itemsStrategy.reset();
                this._reSort();
                this._reFilter();
                this._finishUpdateSession(session, true);
            } else {
                itemsStrategy.invalidate();
            }
        }
    }

    protected _reBuildNodeFooters(reset: boolean = false): void {
        if (this.SupportNodeFooters) {
            const itemsStrategy = this._getItemsStrategy();

            if (reset) {
                const session = this._startUpdateSession();
                itemsStrategy.reset();
                this._reSort();
                this._reFilter();
                this._finishUpdateSession(session, true);
            } else {
                itemsStrategy.invalidate();
            }
        }
    }

    protected _bindHandlers(): void {
        super._bindHandlers();

        this._onCollectionChange = onCollectionChange.bind({
            instance: this,
            prev: this._onCollectionChange,
        });

        this._onCollectionItemChange = onCollectionItemChange.bind({
            instance: this,
            prev: this._onCollectionItemChange,
        });
    }

    protected _getItemState(item: T): ITreeSessionItemState<T> {
        const state = super._getItemState(item) as ITreeSessionItemState<T>;

        if (item instanceof TreeItem) {
            state.parent = item.getParent() as T;
            state.childrenCount = item.getOwner()._getChildrenArray(item, false).length;
            state.level = item.getLevel();
            state.node = item.isNode();
            state.expanded = item.isExpanded();
        }

        return state;
    }

    /**
     * Проверяет валидность элемента проекции
     * @protected
     */
    protected _checkItem(item: CollectionItem<S>): void {
        if (!item || !(item instanceof CollectionItem)) {
            throw new Error(
                `${this._moduleName}::_checkItem(): item should be in instance of Controls/_display/CollectionItem`
            );
        }
    }

    /**
     * Возвращает массив детей для указанного родителя
     * @param parent Родительский узел
     * @param [withFilter=true] Учитывать фильтр
     * @protected
     */
    protected _getChildrenArray(parent: T, withFilter?: boolean): T[] {
        this._checkItem(parent);

        withFilter = withFilter === undefined ? true : !!withFilter;
        const iid = parent.getInstanceId();
        const key = iid + '|' + withFilter;

        if (!(key in this._childrenMap)) {
            const children = [];
            let enumerator;

            if (withFilter) {
                enumerator = this.getEnumerator();
            } else {
                enumerator = this._buildEnumerator(
                    this._getItems.bind(this),
                    this._filterMap.map(() => {
                        return true;
                    }),
                    this._sortMap
                );
            }

            enumerator.setCurrent(parent);
            if (enumerator.getCurrent() === parent || parent.isRoot()) {
                let item;
                while (enumerator.moveNext()) {
                    item = enumerator.getCurrent();
                    if (
                        item['[Controls/treeGrid:TreeGridNodeHeaderRow]'] ||
                        item['[Controls/treeGrid:TreeGridNodeFooterRow]'] ||
                        item['[Controls/_display/SpaceCollectionItem]'] ||
                        (!(item instanceof TreeItem) &&
                            !item['[Controls/_baseTree/BreadcrumbsItem]'])
                    ) {
                        continue;
                    }
                    // В expandedCompositeTree parent может прийти из вложенного списка.
                    // Поэтому по ссылке они будут отличаться, но по ключи одинаковые.
                    const isChild =
                        item.getParent() === parent ||
                        (item.getParent()?.key !== undefined &&
                            item.getParent().key === parent.key);
                    if (isChild) {
                        children.push(item);
                    } else if (item.getLevel() === parent.getLevel()) {
                        break;
                    }
                }
            }

            this._childrenMap[key] = children;
        }

        return this._childrenMap[key];
    }

    getChildrenByRecordSet(parent: T | S | CrudEntityKey): T[] {
        let treeItemParent: T;

        if (parent && parent['[Types/_entity/Model]']) {
            treeItemParent = this.getItemBySourceKey((parent as unknown as Model).getKey());
        } else if (parent && parent['[Controls/_display/TreeItem]']) {
            treeItemParent = parent as T;
        } else if (parent === this.getRoot().key) {
            treeItemParent = this.getRoot();
        } else {
            treeItemParent = this.getItemBySourceKey(parent as CrudEntityKey);
        }

        return treeItemParent ? this._getChildrenArray(treeItemParent, false) : [];
    }

    private _recountHasChildrenByRecordSet(): void {
        const nodes = this._getItems().filter((it) => {
            return it['[Controls/_display/TreeItem]'] && it.isNode() !== null;
        });
        let changed = false;

        nodes.forEach((it) => {
            const hasChildrenByRecordSet = !!this.getChildrenByRecordSet(it).length;
            changed = it.setHasChildrenByRecordSet(hasChildrenByRecordSet) || changed;
        });

        // Добавляемого элемента нет в рекордсете, поэтому учитываем его отдельно
        if (this.getStrategyInstance(AddStrategy)) {
            const parentOfAddingItem = this._getParentOfAddingItem();
            if (parentOfAddingItem) {
                const hasChildrenByRecordSet = parentOfAddingItem.hasChildrenByRecordSet();
                changed = hasChildrenByRecordSet === false;
                parentOfAddingItem.setHasChildrenByRecordSet(true);
            }
        }

        if (changed) {
            this._nextVersion();
        }
    }

    getNextInRecordSetProjection(key: CrudEntityKey, expandedItems: CrudEntityKey[]): S {
        const projection = this.getRecordSetProjection(null, expandedItems);
        const nextItemIndex =
            projection.findIndex((record) => {
                return record.getKey() === key;
            }) + 1;
        return projection[nextItemIndex];
    }
    getPrevInRecordSetProjection(key: CrudEntityKey, expandedItems: CrudEntityKey[]): S {
        const projection = this.getRecordSetProjection(null, expandedItems);
        const prevItemIndex =
            projection.findIndex((record) => {
                return record.getKey() === key;
            }) - 1;
        return projection[prevItemIndex];
    }

    getRecordSetProjection(
        root: CrudEntityKey | null = null,
        expandedItems: CrudEntityKey[] = []
    ): S[] {
        const collection = this.getSourceCollection() as unknown as RecordSet;
        if (!collection || !collection.getCount()) {
            return [];
        }
        const projection = [];
        const isExpandAll = expandedItems.indexOf(null) !== -1;
        const children = this.getChildrenByRecordSet(root);
        for (let i = 0; i < children.length; i++) {
            const contents = children[i].contents;
            const key = contents.getKey();
            projection.push(contents);
            if (isExpandAll || expandedItems.indexOf(key) !== -1) {
                projection.push(...this.getRecordSetProjection(key, expandedItems));
            }
        }
        return projection;
    }

    /**
     * Возвращает соседний элемент проекции в рамках одного парента с исходным
     * @param enumerator Энумератор элементов
     * @param item Элемент проекции относительно которого искать
     * @param isNext Искать следующий или предыдущий элемент
     * @param [conditionProperty] Свойство, по которому происходит отбор элементов
     */
    protected _getNearbyItem(
        enumerator: CollectionEnumerator<T>,
        item: T,
        isNext: boolean,
        conditionProperty?: string
    ): T {
        return getTreeNearbyItem(this.getRoot(), enumerator, item, isNext, conditionProperty);
    }

    // endregion

    // region HasNodeWithChildren

    protected _recountHasNodeWithChildren(): void {
        // hasNodeWithChildren нужно считать по рекордсету,
        // т.к. ,когда срабатывает событие reset, элементы проекции еще не созданы
        if (!this.getSourceCollection().getCount()) {
            return;
        }

        let hasNodeWithChildren = false;

        const collection = this.getSourceCollection();
        for (let i = 0; i < collection.getCount(); i++) {
            const item = collection.at(i);
            const isNode = item.get(this.getNodeProperty()) !== null;
            const isGroupNode = item.get(this.getNodeTypeProperty()) === NODE_TYPE_PROPERTY_GROUP;
            const hasChildren = this.getHasChildrenProperty()
                ? item.get(this.getHasChildrenProperty())
                : !!this.getChildrenByRecordSet(item).length;
            if (isNode && hasChildren && !isGroupNode) {
                hasNodeWithChildren = true;
                break;
            }
        }

        // Добавляемого элемента нет в рекордсете, поэтому учитываем его отдельно
        if (this.getStrategyInstance(AddStrategy) && !hasNodeWithChildren) {
            const parentOfAddingItem = this._getParentOfAddingItem();
            hasNodeWithChildren = parentOfAddingItem && !parentOfAddingItem.isRoot();
        }

        this._setHasNodeWithChildren(hasNodeWithChildren);
    }

    protected _setHasNodeWithChildren(hasNodeWithChildren: boolean): void {
        if (this._hasNodeWithChildren !== hasNodeWithChildren) {
            this._hasNodeWithChildren = hasNodeWithChildren;
            this._recountDisplayExpanderPadding();
            this._nextVersion();
        }
    }

    hasNodeWithChildren(): boolean {
        return this._hasNodeWithChildren;
    }

    // endregion HasNodeWithChildren

    // region HasNode

    protected _recountHasNode(): void {
        const itemsInRoot = this.getChildren(this.getRoot());

        let hasNode = false;
        for (let i = 0; i < itemsInRoot.getCount(); i++) {
            const item = itemsInRoot.at(i);
            if (item['[Controls/_display/TreeItem]'] && item.isNode() !== null) {
                hasNode = true;
                break;
            }
        }

        this._setHasNode(hasNode);
    }

    protected _setHasNode(hasNode: boolean): void {
        if (this._hasNode !== hasNode) {
            this._hasNode = hasNode;
            this._recountDisplayExpanderPadding();
            this._nextVersion();
        }
    }

    hasNode(): boolean {
        return this._hasNode;
    }

    // endregion HasNode

    // region Adding

    setAddingItem(item: T, options: { position: 'top' | 'bottom'; index?: number }): void {
        super.setAddingItem(item, options);
        if (this._shouldRecountExpanderByAddInPlace()) {
            this._recountHasNodeWithChildren();
            this._recountHasChildrenByRecordSet();
        }
    }

    resetAddingItem(): void {
        const shouldRecountExpander = this._shouldRecountExpanderByAddInPlace();
        super.resetAddingItem();
        if (shouldRecountExpander) {
            this._recountHasNodeWithChildren();
            this._recountHasChildrenByRecordSet();
        }
    }

    protected _shouldRecountExpanderByAddInPlace(): boolean {
        const addStrategy = this.getStrategyInstance(AddStrategy) as AddStrategy<S, T>;
        if (!addStrategy) {
            return;
        }
        const addingItem = addStrategy.getAddingItem();
        return addingItem.getContents().get(this.getParentProperty()) !== undefined;
    }

    protected _getParentOfAddingItem(): T {
        let parent = null;

        const addStrategy = this.getStrategyInstance(AddStrategy) as AddStrategy<S, T>;
        if (addStrategy) {
            const addingItem = addStrategy.getAddingItem();
            const parentKey = addingItem.getContents().get(this.getParentProperty());
            parent = this.getItemBySourceKey(parentKey);

            // У добавляемой записи и у рута может быть одинаковый ключ - null.
            // Поэтому по ключу получим добавляему запись в первую очередь, но она не может быть родителем себя же.
            if (parent === addingItem) {
                parent = this.getRoot();
            }
        }

        return parent;
    }

    // endregion Adding

    protected _reBuild(reset?: boolean): void {
        super._reBuild(reset);
        this._recountHasChildrenByRecordSet();
    }

    // region ItemsChanges

    protected _handleCollectionChangeAdd(): void {
        super._handleCollectionChangeAdd();

        this._reBuildNodeFooters();
        this._reBuildNodeHeaders();
    }

    protected _handleCollectionChangeRemove(): void {
        super._handleCollectionChangeRemove();

        this._reBuildNodeFooters();
        this._reBuildNodeHeaders();
    }

    protected _handleCollectionChangeReplace(): void {
        super._handleCollectionChangeReplace();

        this._reBuildNodeFooters();
        this._reBuildNodeHeaders();
    }

    // endregion ItemsChanges
}

Object.assign(Tree.prototype, {
    '[Controls/_display/Tree]': true,
    SupportNodeFooters: true,
    SupportNodeHeaders: true,
    _moduleName: 'Controls/display:Tree',
    _itemModule: 'Controls/display:TreeItem',
    _spaceItemModule: 'Controls/baseTree:SpaceCollectionItem',
    _nodeFooterModule: 'Controls/display:NodeFooter',
    _nodeHeaderModule: 'Controls/display:NodeHeader',
    _$parentProperty: '',
    _$nodeProperty: '',
    _$childrenProperty: '',
    _$hasChildrenProperty: '',
    _$nodeTypeProperty: null,
    _$expanderPosition: 'default',
    _$expanderVisibility: 'visible',
    _$expanderSize: undefined,
    _$expanderIcon: undefined,
    _$expanderIconSize: 'default',
    _$expanderIconStyle: 'default',
    _$withoutLevelPadding: false,
    _$root: undefined,
    _$rootEnumerable: false,
    _$nodeHeaderTemplate: null,
    _$nodeFooterTemplate: null,
    _$nodeFooterVisibilityCallback: null,
    _$nodeMoreCaption: null,
    _$moreFontColorStyle: null,
    _$hasMoreStorage: {},
    _$collapsedItems: [],
    _$expandedItems: [],
    _root: null,
});
