/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import cClone = require('Core/core-clone');
import { SyntheticEvent } from 'UI/Vdom';
import { EventUtils } from 'UI/Events';
import { constants } from 'Env/Env';
import { CrudEntityKey, QueryWhereExpression } from 'Types/source';
import { isEqual } from 'Types/object';
import { IObservable, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Direction, IBaseSourceConfig, ISelectionObject, TKey } from 'Controls/interface';
import {
    BaseControl,
    getKey,
    getPlainItemContents,
    IDirection,
    IReloadItemOptions,
    ISiblingStrategy,
    JS_NAVIGATION_BUTTON_SELECTOR,
} from 'Controls/baseList';
import type { Collection, CollectionItem, IDragPosition } from 'Controls/display';
import Tree, { IOptions as ITreeCollectionOptions, IHasMoreStorage } from './display/Tree';
import TreeItem from './display/TreeItem';
import { ISourceControllerOptions, NewSourceController } from 'Controls/dataSource';
import { MouseButtons, MouseUp } from 'Controls/popup';
import { TreeSiblingStrategy } from './display/strategies/TreeSiblingStrategy';
import { ExpandController } from 'Controls/expandCollapse';
import { Logger } from 'UI/Utils';
import { applyReloadedNodes, getReloadItemsHierarchy, getRootsForHierarchyReload } from './utils';
import { IDragObject } from 'Controls/dragnDrop';
import { IOptions as ITreeControlOptions } from './interface/ITree';
import {
    FlatSelectionStrategy,
    ISelectionControllerOptions,
    ISelectionStrategy,
    ITreeSelectionStrategyOptions,
    TreeSelectionStrategy,
} from 'Controls/multiselection';
import { factory } from 'Types/chain';
import 'css!Controls/itemActions';
import 'css!Controls/CommonClasses';
// Нужно только для CharacteristicsTemplate
// Будет удалено по https://online.sbis.ru/opendoc.html?guid=988447f1-6e8d-4d35-b8e0-1e2b83170222&client=3
import 'css!Controls/list';
import 'css!Controls/baseTree';

const HOT_KEYS = {
    _expandMarkedItem: constants.key.right,
    _collapseMarkedItem: constants.key.left,
};

const EXPAND_ON_DRAG_DELAY = 1000;
const DEFAULT_COLUMNS_VALUE = [];

const _private = {
    hasInParents(collection: Collection, childKey, stepParentKey): boolean {
        const child = collection.getItemBySourceKey(childKey);
        const targetParent = collection.getItemBySourceKey(stepParentKey);

        let current = child;
        do {
            current = current.getParent();
            if (!current.isRoot() && current === targetParent) {
                return true;
            }
        } while (!current.isRoot());
        return false;
    },

    loadNodeChildren(
        self: BaseTreeControl,
        nodeKey: CrudEntityKey,
        direction: IDirection = 'down'
    ): Promise<RecordSet> {
        const sourceController = self.getSourceController();

        self._displayGlobalIndicator();
        self._collectionChangeCauseByNode = true;
        return sourceController
            .load(direction, nodeKey)
            .then((list) => {
                return list;
            })
            .catch((error) => {
                return error;
            })
            .finally(() => {
                if (self._indicatorsController.shouldHideGlobalIndicator()) {
                    self._indicatorsController.hideGlobalIndicator();
                }
            });
    },

    /**
     * Выполняет запрос на перезагрузку указанной записи, всех её родительских и развернутых дочерних узлов.
     * @param {TKey} key - id перезагружаемой записи
     * @param {Tree} collection - коллекция к которой принадлежит перезагружаемый итем
     * @param {QueryWhereExpression<unknown>} filter - фильтр с которым будет выполнен запрос на перезагрузку
     * @param {NewSourceController} sourceController - sourceController через который будет выполнен запрос на
     * перезагрузку
     */
    reloadItem(
        key: TKey,
        collection: Tree,
        filter: QueryWhereExpression<unknown>,
        sourceController: NewSourceController
    ): Promise<RecordSet | Error> {
        const reloadFilter = cClone(filter);
        reloadFilter[collection.getParentProperty()] = getRootsForHierarchyReload(collection, key);

        return sourceController.load(undefined, key, reloadFilter).then((items: RecordSet) => {
            applyReloadedNodes(collection, key, items);

            const meta = items.getMetaData();
            if (meta.results) {
                collection.setMetaResults(meta.results);
            }

            this._updateHasMoreStorage(this._expandController.getExpandedItems(), false, items);

            return items;
        });
    },
};

/**
 * Hierarchical list control with custom item template. Can load data from data source.
 *
 * @class Controls/_tree/BaseTreeControl
 * @implements Controls/list:IEditableList
 * @implements Controls/list:IMovableList
 * @extends Controls/_list/BaseControl
 *
 * @private
 */

export { ITreeControlOptions as IBaseTreeControlOptions };

export class BaseTreeControl<
    TOptions extends ITreeControlOptions = ITreeControlOptions
> extends BaseControl<TOptions> {
    private _root: CrudEntityKey = null;
    private _rootChanged: boolean = false;
    private _resetExpandedItemsAfterReload: boolean = false;
    private _updateExpandedItemsAfterReload: boolean = false;
    private _currentItem = null;
    private _tempItem = null;
    private _markedLeaf = '';
    private _doAfterItemExpanded = null;
    private _goToNextAfterExpand: true;
    private _scrollToLeaf: boolean = null;
    private _scrollToLeafOnDrawItems: boolean = false;

    /**
     * Флаг, означающий что изменение коллекции было спровоцировано изменением узла(развернули/свернули)
     * @private
     */
    private _collectionChangeCauseByNode: boolean = false;

    private _timeoutForExpandOnDrag: number = null;

    private _expandController: ExpandController;
    private _toggleExpandedResolver: Function;
    private _mouseDownExpanderKey: TKey;
    private _expandedItemsToNotify: TKey[];

    protected _listViewModel: Tree = null;

    constructor(options: TOptions, context?: object) {
        super(options, context);
        this._nodeDataMoreLoadCallback = this._nodeDataMoreLoadCallback.bind(this);
        if (typeof options.root !== 'undefined') {
            this._root = options.root;
        }
    }

    protected _beforeMount(...args: [TOptions, object]): void | Promise<unknown> {
        const options = args[0];

        // Создаем _expandController до вызова super._beforeMount, т.к. во время
        // отработки super._beforeMount уже будет нужен
        this._expandController = new ExpandController({
            singleExpand: options.singleExpand,
            expandedItems: options.expandedItems,
            collapsedItems: options.collapsedItems,
            loader: this._expandLoader.bind(this),
        });

        const superResult = super._beforeMount(...args);
        const doBeforeMount = () => {
            // После отработки super._beforeMount создастся модель, обновим её в контроллере
            this._expandController.updateOptions({
                model: this.getViewModel(),
            });
            if (options.sourceController) {
                // FIXME для совместимости, т.к. сейчас люди задают опции, которые требуетюся для запроса
                //  и на списке и на Browser'e
                const sourceControllerState = options.sourceController.getState();

                if (
                    (options.parentProperty &&
                        sourceControllerState.parentProperty !== options.parentProperty) ||
                    (options.root !== undefined && options.root !== sourceControllerState.root)
                ) {
                    options.sourceController.updateOptions({
                        ...options,
                        keyProperty: this._keyProperty,
                    });
                }

                options.sourceController.setNodeDataMoreLoadCallback(
                    this._nodeDataMoreLoadCallback
                );
            }
        };

        if (superResult instanceof Promise) {
            superResult.then(doBeforeMount);
        } else {
            doBeforeMount();
        }

        return superResult;
    }

    protected _afterMount(): void {
        super._afterMount();

        if (this._expandedItemsToNotify) {
            if (this._options.onExpandedItemsChanged) {
                this._options.onExpandedItemsChanged(this._expandedItemsToNotify);
            } else {
                this._options.notifyCallback('expandedItemsChanged', [this._expandedItemsToNotify]);
            }
            this._expandedItemsToNotify = null;
        } else if (this._options.nodeHistoryId) {
            if (this._options.onExpandedItemsChanged) {
                this._options.onExpandedItemsChanged(this._expandController.getExpandedItems());
            } else {
                this._options.notifyCallback('expandedItemsChanged', [
                    this._expandController.getExpandedItems(),
                ]);
            }
        }
    }

    protected _createNewModel(
        items: RecordSet,
        modelConfig: ITreeCollectionOptions,
        modelName: string
    ): Collection {
        const hasMoreStorage = this._prepareHasMoreStorage(
            this._expandController.getExpandedItems(),
            modelConfig.nodeProperty,
            items
        );
        return super._createNewModel(
            items,
            {
                ...modelConfig,
                hasMoreStorage,
            } as ITreeCollectionOptions,
            modelName
        );
    }

    /**
     * Проверяет можно ли для переданного узла загрузить его данные автоматически.
     * Можно загружать если direction === 'down' и item это раскрытый узел в котором есть не загруженные данные
     * и не задан футер списка и нет данных для загрузки в дочернем узле
     * @param {Direction} direction - текущее направление подгрузки
     * @param {TreeItem} item - проверяемая запись
     * @param {CrudEntityKey} parentKey - идентификатор родительского узла (TODO зачем его передавать если он есть в item?)
     * @private
     */
    private _canLoadNodeDataOnScroll(
        direction: Direction,
        item: TreeItem,
        parentKey: CrudEntityKey
    ): boolean {
        // Иногда item это breadcrumbsItemRow, он не TreeItem
        if (!item || !item['[Controls/_display/TreeItem]'] || direction !== 'down') {
            return false;
        }

        const hasMoreParentData =
            !!this._sourceController && this._sourceController.hasMoreData('down', parentKey);

        // Можно грузить если это раскрытый узел в котором есть не загруженные данные и не задан футер списка и нет
        // данных для загрузки в дочернем узле
        return (
            this._options.loadNodeOnScroll &&
            item.isNode() !== null &&
            item.isExpanded() &&
            item.hasMoreStorage('forward') &&
            !this._options.footerTemplate &&
            !hasMoreParentData &&
            !this._sourceController?.isLoading()
        );
    }

    /**
     * Загружает рекурсивно данные последнего раскрытого узла
     * @param item
     * @private
     */
    private _loadNodeChildrenRecursive(item: TreeItem): Promise<RecordSet | void> {
        const nodeKey = item.getContents().getKey();
        const hasMoreData = this._sourceController?.hasMoreData('down', nodeKey);

        if (hasMoreData) {
            // Вызов метода, который подгружает дочерние записи узла
            return _private.loadNodeChildren(this, nodeKey);
        } else {
            const lastItem = item.getLastChildItem();
            if (this._canLoadNodeDataOnScroll('down', lastItem, nodeKey)) {
                return this._loadNodeChildrenRecursive(lastItem);
            }

            return Promise.resolve();
        }
    }

    /**
     * Метод, вызываемый после срабатывания триггера подгрузки данных.
     *
     * В случае если последняя корневая запись это раскрытый узел у которого есть данные для подгрузки,
     * то загружаются его дочерние элементы. В противном случае вызываем загрузку корневых итемов.
     *
     * TODO Необходимо провести рефакторинг механизма подгрузки данных по задаче
     *  https://online.sbis.ru/opendoc.html?guid=8a5f7598-c7c2-4f3e-905f-9b2430c0b996
     *
     * @param {Direction} direction - текущее направление подгрузки
     * @private
     */
    protected _loadMore(direction: Direction): void | Promise<RecordSet | void> {
        const lastRootItem = this._listViewModel.getRoot().getLastChildItem();

        // Если последняя корневая запись это раскрытый узел у которого есть данные для подгрузки,
        // то загружаем его дочерние элементы
        if (this._canLoadNodeDataOnScroll(direction, lastRootItem, this._options.root)) {
            this._addItemsByLoadToDirection = true;
            return this._loadNodeChildrenRecursive(lastRootItem).then((result) => {
                this._addItemsByLoadToDirection = false;
                return result;
            });
        } else {
            // Вызов метода подгрузки данных по умолчанию (по сути - loadToDirectionIfNeed).
            return super._loadMore(direction);
        }
    }

    private _updateTreeControlModel(newOptions: TOptions): void {
        const viewModel = this._listViewModel;

        if (!viewModel) {
            return;
        }

        if (this._options.markedKey !== newOptions.markedKey) {
            if (newOptions.markerMoveMode === 'leaves') {
                this._applyMarkedLeaf(newOptions.markedKey, viewModel, this.getMarkerController());
            }
        }

        // nodeFooterVisibilityCallback нужно проставлять раньше nodeFooterTemplate, т.к.
        // изменение темплейта вызовет пересчет футеров, а в колбэке уже может быть изменено условие,
        // поэтому нужно сперва пересчитаться по актуальному колбэку
        if (
            newOptions.nodeFooterVisibilityCallback !== this._options.nodeFooterVisibilityCallback
        ) {
            viewModel.setNodeFooterVisibilityCallback(newOptions.nodeFooterVisibilityCallback);
        }

        if (newOptions.nodeFooterTemplate !== this._options.nodeFooterTemplate) {
            viewModel.setNodeFooterTemplate(newOptions.nodeFooterTemplate);
        }

        viewModel.setExpanderPosition(newOptions.expanderPosition);

        if (newOptions.expanderVisibility !== this._options.expanderVisibility) {
            viewModel.setExpanderVisibility(newOptions.expanderVisibility);
        }

        if (newOptions.expanderSize !== this._options.expanderSize) {
            viewModel.setExpanderSize(newOptions.expanderSize);
        }

        if (newOptions.withoutLevelPadding !== this._options.withoutLevelPadding) {
            viewModel.setWithoutLevelPadding(newOptions.withoutLevelPadding);
        }

        if (newOptions.expanderIconSize !== this._options.expanderIconSize) {
            viewModel.setExpanderIconSize(newOptions.expanderIconSize);
        }

        if (newOptions.expanderIconStyle !== this._options.expanderIconStyle) {
            viewModel.setExpanderIconStyle(newOptions.expanderIconStyle);
        }

        if (newOptions.nodeProperty !== this._options.nodeProperty) {
            viewModel.setNodeProperty(newOptions.nodeProperty);
        }

        if (newOptions.parentProperty !== this._options.parentProperty) {
            viewModel.setParentProperty(newOptions.parentProperty);
        }

        if (newOptions.hasChildrenProperty !== this._options.hasChildrenProperty) {
            viewModel.setHasChildrenProperty(newOptions.hasChildrenProperty);
        }
    }

    protected _startBeforeUpdate(newOptions: TOptions): void {
        super._startBeforeUpdate(newOptions);
        const sourceController = this.getSourceController();
        const itemsChanged = this._options.items !== newOptions.items;

        if (typeof newOptions.root !== 'undefined' && this._root !== newOptions.root) {
            this._rootChanged = true;
            this._root = newOptions.root;

            // Если изменился рекордсет, то рут нужно применить после того как применим рекордсет,
            // то есть в _endBeforeUpdate
            if (this._shouldApplyRoot(newOptions) && !itemsChanged) {
                this._applyNewRoot(this._root);
                if (this._options.itemsSetCallback) {
                    const items = sourceController?.getItems() || newOptions.items;
                    this._options.itemsSetCallback(items, newOptions);
                }
            }

            // При смене корня, не надо запрашивать все открытые папки,
            // т.к. их может не быть и мы загрузим много лишних данных.
            // Так же учитываем, что вместе со сменой root могут поменять и expandedItems - тогда не надо их сбрасывать.
            // TODO убрать таску https://online.sbis.ru/opendoc.html?guid=0e741582-a590-4dfb-918d-c4e60245d217&client=3
            const shouldResetExpandedItems =
                !(
                    newOptions.searchStartingWith === 'root' &&
                    this._expandController.isAllExpanded()
                ) &&
                isEqual(newOptions.expandedItems, this._options.expandedItems) &&
                !newOptions.task1187672730;
            if (shouldResetExpandedItems) {
                if (this._wasReload) {
                    this._resetExpandedItems();
                } else {
                    this._resetExpandedItemsAfterReload = true;
                }
            }

            if (this.isEditing()) {
                this.cancelEdit();
            }
        }
    }

    protected _endBeforeUpdate(newOptions: TOptions): void {
        super._endBeforeUpdate(newOptions);

        let updateSourceController = false;
        const sourceController = this.getSourceController();

        if (this._rootChanged) {
            const itemsChanged = this._options.items !== newOptions.items;
            if (this._shouldApplyRoot(newOptions) && itemsChanged) {
                this._applyNewRoot(this._root);
                this._resetItemActionsController();
                if (this._options.itemsSetCallback) {
                    const items =
                        sourceController?.getItems() || newOptions.items;
                    this._options.itemsSetCallback(items, newOptions);
                }
            }
        }

        const viewModel = this.getViewModel() as Tree;
        const searchValueChanged = this._options.searchValue !== newOptions.searchValue;
        const isSourceControllerLoading = sourceController && sourceController.isLoading();

        this._expandController.updateOptions({
            model: viewModel,
            singleExpand: newOptions.singleExpand,
            collapsedItems: newOptions.collapsedItems,
        });

        const currentExpandedItems = this._expandController.getExpandedItems();
        const expandedItemsFromSourceCtrl = newOptions.storeId
            ? newOptions.expandedItems
            : sourceController && sourceController.getExpandedItems();
        const expandedItemsChanged =
            newOptions.expandedItems && !isEqual(newOptions.expandedItems, currentExpandedItems);
        // expandedItems в sourceController приоритетнее чем наши. Поэтому Если в sourceController
        // нет expandedItems, а у нас есть, значит нужно сбросить раскрытые узлы
        const wasResetExpandedItems =
            !expandedItemsChanged &&
            expandedItemsFromSourceCtrl &&
            !expandedItemsFromSourceCtrl.length &&
            currentExpandedItems &&
            currentExpandedItems.length;
        if (wasResetExpandedItems) {
            this._resetExpandedItems();
        } else if (expandedItemsChanged) {
            if (
                ((newOptions.source === this._options.source || newOptions.sourceController) &&
                    !isSourceControllerLoading) ||
                (searchValueChanged && newOptions.sourceController)
            ) {
                if (viewModel) {
                    // Проставляем hasMoreStorage до простановки expandedItems,
                    // чтобы футеры узлов правильно посчитать за один раз
                    this._updateHasMoreStorage(newOptions.expandedItems);

                    this._collectionChangeCauseByNode = true;
                    // Отключаем загрузку данных контроллером, т.к. все данные уже загружены
                    // нужно только проставить новое состояние в контроллер
                    this._expandController.disableLoader();
                    this._expandController.setExpandedItems(newOptions.expandedItems);
                    this._expandController.enableLoader();

                    if (newOptions.markerMoveMode === 'leaves') {
                        this._applyMarkedLeaf(
                            newOptions.markedKey,
                            viewModel,
                            this.getMarkerController()
                        );
                    }
                }
            } else {
                this._updateExpandedItemsAfterReload = true;
            }

            if (
                sourceController &&
                !isEqual(newOptions.expandedItems, sourceController.getExpandedItems())
            ) {
                if (newOptions.childrenLoadMode === 'always') {
                    sourceController.resetCollapsedNodes(newOptions.expandedItems);
                }
                sourceController.setExpandedItems(newOptions.expandedItems);
            }
        }
        if (this._toggleExpandedResolver) {
            this._toggleExpandedResolver();
            this._toggleExpandedResolver = null;
        }

        if (newOptions.parentProperty !== this._options.parentProperty) {
            updateSourceController = true;
        }

        this._updateTreeControlModel(newOptions);

        if (sourceController) {
            sourceController.setNodeDataMoreLoadCallback(this._nodeDataMoreLoadCallback);

            const sourceControllerState = sourceController.getState();
            if (
                newOptions.parentProperty &&
                sourceControllerState.parentProperty !== newOptions.parentProperty
            ) {
                Logger.error(
                    'BaseTreeControl: для корректной работы опцию parentProperty необходимо задавать ' +
                        'на Controls/list:DataContainer (Layout/browsers:Browser). Если вы передаёте sourceController ' +
                        'из загрузчика SabyPage, то проверьте, что parentProperty указано в конфиге загрузчика',
                    this
                );
                updateSourceController = true;
            }
        }
        if (sourceController && updateSourceController) {
            sourceController.updateOptions({
                ...newOptions,
                keyProperty: this._keyProperty,
            });
        }

        if (
            this._options.markerMoveMode !== newOptions.markerMoveMode &&
            newOptions.markerMoveMode === 'leaves'
        ) {
            let markedItem;
            if (this._markerController) {
                const markedKey = this._markerController.getMarkedKey();
                markedItem = this._listViewModel.getItemBySourceKey(markedKey);
            }
            // Если маркер и так на листе, то не пересчитываем
            if (!markedItem || markedItem.isNode() !== null) {
                this._setMarkerOnFirstLeaf(newOptions, newOptions.markedKey);
            }
        }

        if (this._rootChanged) {
            if (this._selectionController) {
                this._options.notifyCallback(
                    'listSelectedKeysCountChanged',
                    [
                        this._selectionController.getCountOfSelected(),
                        this._selectionController.isAllSelected(false),
                    ],
                    { bubbling: true }
                );
            }
        }
    }

    protected _afterRender() {
        super._afterRender(...arguments);
        if (this._scrollToLeaf && !this._scrollToLeafOnDrawItems) {
            this._scrollToLeaf();
            this._scrollToLeaf = null;
        }
    }
    protected _afterUpdate(oldOptions: TOptions) {
        super._afterUpdate(oldOptions);

        if (this._expandedItemsToNotify) {
            if (this._options.onExpandedItemsChanged) {
                this._options.onExpandedItemsChanged(this._expandedItemsToNotify);
            } else {
                this._options.notifyCallback('expandedItemsChanged', [this._expandedItemsToNotify]);
            }
            this._expandedItemsToNotify = null;
        }
        this._rootChanged = false;
    }

    protected _unmount(): void {
        this._scrollToLeaf = null;
        this._clearTimeoutForExpandOnDrag();
        if (this.getSourceController()) {
            this.getSourceController().setNodeDataMoreLoadCallback(null);
        }
        super._unmount();
    }

    protected _onDrawItems(): void {
        super._onDrawItems();
        if (this._scrollToLeaf && this._scrollToLeafOnDrawItems) {
            this._scrollToLeaf();
            this._scrollToLeaf = null;
            this._scrollToLeafOnDrawItems = false;
        }
    }

    private _applyNewRoot(
        newRoot: CrudEntityKey,
        reBuild: boolean = true
    ): void {
        this._listViewModel.setRoot(newRoot, reBuild);
    }

    private _resetItemActionsController() {
        if (this._itemActionsController) {
            this._itemActionsController = null;
        }
    }

    private _shouldApplyRoot(newOptions: TOptions): boolean {
        if (!this._listViewModel) {
            return false;
        }

        const viewModelConstructorChanged =
            newOptions.viewModelConstructor !== this._options.viewModelConstructor ||
            this._keyProperty !== this._listViewModel.getKeyProperty();
        return !viewModelConstructorChanged;
    }

    resetExpandedItems(): void {
        this._resetExpandedItems();
    }

    toggleExpanded(key: TKey): Promise<void> {
        const item = this._listViewModel.getItemBySourceKey(key);
        return this._toggleExpanded(item);
    }

    protected _onloadMore(e, dispItem?, direction?: IDirection): void {
        if (dispItem) {
            const nodeKey = dispItem.getContents().getKey();
            _private.loadNodeChildren(this, nodeKey, direction);
        } else {
            super._onloadMore(e);
        }
    }

    reloadItem(key: TKey, options: IReloadItemOptions = {}): Promise<Model | RecordSet> {
        return options.hierarchyReload
            ? _private.reloadItem.apply(this, [
                  key,
                  this.getViewModel() as Tree,
                  this._options.filter,
                  this.getSourceController(),
              ])
            : super.reloadItem.apply(this, [key, options]);
    }

    /**
     * Перезагружает указанные записи списка. Для этого отправляет запрос query-методом
     * со значением текущего фильтра в поле [parentProperty] которого передаются идентификаторы
     * родительских узлов.
     */
    reloadItems(ids: TKey[]): Promise<RecordSet | Error> {
        const filter = cClone(this._options.filter);
        const collection = this.getViewModel() as Tree;
        const sourceController = this.getSourceController();

        filter[this._options.parentProperty] = getReloadItemsHierarchy(collection, ids);

        return sourceController.load(undefined, undefined, filter).then((items: RecordSet) => {
            const meta = items.getMetaData();
            if (meta.results) {
                collection.setMetaResults(meta.results);
            }

            this._updateHasMoreStorage(this._expandController.getExpandedItems(), false, items);

            return items;
        });
    }

    // region Drag

    /**
     * Реализует автоматическое раскрытие узла дерева когда при перетаскивании записи
     * курсор на некоторое время ({@link EXPAND_ON_DRAG_DELAY}) задерживается над ним.
     */
    protected _draggingItemMouseMove(item: TreeItem, event: MouseEvent): boolean {
        const changedPosition = super._draggingItemMouseMove(item, event);
        if (
            !changedPosition ||
            !item['[Controls/_display/TreeItem]'] ||
            item.isNode() === null ||
            !this._options.supportExpand
        ) {
            return changedPosition;
        }

        const dndListController = this._getDndListController();
        const position = dndListController.getDragPosition();
        this._clearTimeoutForExpandOnDrag();

        if (!item.isExpanded() && position.position === 'on') {
            this._timeoutForExpandOnDrag = setTimeout(() => {
                return this._toggleExpanded(item);
            }, EXPAND_ON_DRAG_DELAY);
        }

        return changedPosition;
    }

    protected _beforeStartDrag(draggedKey: CrudEntityKey): void {
        super._beforeStartDrag(draggedKey);
        const draggedItem = this._listViewModel.getItemBySourceKey(draggedKey);
        // сворачиваем перетаскиваемый узел
        if (draggedItem && draggedItem.isNode() !== null) {
            const result = this._expandController.collapseItem(draggedKey);
            this._changeExpandCollapseState(result.expandedItems, result.collapsedItems);
        }
    }

    protected _dragLeave(): void {
        super._dragLeave();
        this._clearTimeoutForExpandOnDrag();
    }

    protected _notifyDragEnd(
        dragObject: IDragObject,
        targetPosition: IDragPosition<CollectionItem>
    ): unknown {
        this._clearTimeoutForExpandOnDrag();
        return super._notifyDragEnd(dragObject, targetPosition);
    }

    protected _getSourceControllerOptionsForGetDraggedItems(
        selection: ISelectionObject
    ): ISourceControllerOptions {
        const options = super._getSourceControllerOptionsForGetDraggedItems(selection);

        options.deepReload = true;
        options.expandedItems = this._expandController.getExpandedItems();
        options.root = this._root;

        // Нам не нужен multiNavigation, т.к. мы хотим получить записи именно по selection, независимо от развернутости.
        delete options.multiNavigation;

        return options;
    }

    private _clearTimeoutForExpandOnDrag(): void {
        clearTimeout(this._timeoutForExpandOnDrag);
        this._timeoutForExpandOnDrag = null;
    }

    // endregion Drag

    // region Multiselection

    protected _createSelectionStrategy(options: ITreeControlOptions): ISelectionStrategy {
        const strategyOptions = this._getSelectionStrategyOptions(options);
        // При использовании explorer-а возможно ситуация, что рисуется плоский список но с помощью BaseTreeControl-а.
        // Поэтому смотрим на наличие опций дерева.
        return options.parentProperty && options.nodeProperty
            ? new TreeSelectionStrategy(strategyOptions)
            : new FlatSelectionStrategy(strategyOptions);
    }

    protected _getSelectionStrategyOptions(
        options: ITreeControlOptions
    ): ITreeSelectionStrategyOptions {
        return {
            selectDescendants: options.selectDescendants,
            selectAncestors: options.selectAncestors,
            rootKey: options.root,
            model: this._listViewModel,
            entryPath: this._listViewModel.getMetaData().ENTRY_PATH,
            selectionType: options.selectionType,
            selectionCountMode: options.selectionCountMode,
            recursiveSelection: options.recursiveSelection,
            feature1188089336: options.feature1188089336,
        };
    }

    protected _getSelectionControllerOptions(
        options: ITreeControlOptions
    ): ISelectionControllerOptions {
        return {
            ...super._getSelectionControllerOptions(options),
            rootKey: options.root,
            nodeProperty: options.nodeProperty,
            parentProperty: options.parentProperty,
            hasChildrenProperty: options.hasChildrenProperty,
            childrenProperty: options.childrenProperty,
            childrenCountProperty: options.childrenCountProperty,
            selectionType: options.selectionType,
            recursiveSelection: options.recursiveSelection,
            selectionCountMode: options.selectionCountMode,
            selectAncestors: options.selectAncestors,
            selectDescendants: options.selectDescendants,
        };
    }

    // endregion Multiselection

    protected _onItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        columnIndex: number = null
    ): boolean {
        const item = this._listViewModel.getItemBySourceKey(getKey(contents));

        const clickHasMoreButton = originalEvent.target.closest(
            `.${JS_NAVIGATION_BUTTON_SELECTOR}`
        );
        if (clickHasMoreButton) {
            originalEvent.stopPropagation();
            let direction = null;
            if (item['[Controls/tree:TreeNodeFooterItem]']) {
                direction = 'down';
            } else if (item['[Controls/tree:TreeNodeHeaderItem]']) {
                direction = 'up';
            }
            this._onloadMore(event, item.getNode(), direction);
            return false;
        }

        const result = super._onItemClick(event, contents, originalEvent, columnIndex);

        if (item && result !== false) {
            const shouldToggleExpanded = this._shouldExpandItemByClick(item, originalEvent);
            if (shouldToggleExpanded) {
                this._toggleExpanded(item);
            }
        }

        if (item && item.isGroupNode()) {
            this._options.notifyCallback('groupClick', [contents, originalEvent]);
        }

        return false;
    }

    protected _notifyItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        columnIndex: number
    ): boolean {
        if (originalEvent.target.closest('.js-controls-Tree__row-expander')) {
            event?.stopPropagation();
            return false;
        }

        const item = this._listViewModel.getItemBySourceItem(contents);
        if (item && item.isGroupNode()) {
            // развернем группу только если нажали на экспандер или название
            return false;
        }

        return super._notifyItemClick(event, contents, originalEvent, columnIndex);
    }

    private _shouldExpandItemByClick(
        item: TreeItem,
        clickEvent: SyntheticEvent<MouseEvent>
    ): boolean {
        const clickOnExpander = clickEvent.target.closest('.js-controls-Tree__row-expander');
        const eventIsStopped = clickEvent.isStopped
            ? clickEvent.isStopped()
            : clickEvent.isPropagationStopped();
        return (
            item &&
            item.isNode() !== null &&
            this._options.expandByItemClick &&
            !clickOnExpander &&
            !eventIsStopped &&
            !this.isLoading()
        );
    }

    protected _itemMouseDown(
        event: SyntheticEvent,
        item: TreeItem,
        domEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (domEvent.target.closest('.js-controls-Tree__row-expander')) {
            event.stopPropagation();
            this._onExpanderMouseDown(domEvent.nativeEvent, item);
            return;
        }

        if (!this._shouldHandleItemMouseDown(item)) {
            return;
        }

        super._itemMouseDown(event, item, domEvent);
    }

    protected _shouldHandleItemMouseUp(item: TreeItem): boolean {
        return (
            !item['[Controls/tree:TreeNodeFooterItem]'] &&
            !item['[Controls/tree:TreeNodeHeaderItem]']
        );
    }

    protected _shouldHandleItemMouseDown(item: TreeItem): boolean {
        return (
            !item['[Controls/tree:TreeNodeFooterItem]'] &&
            !item['[Controls/tree:TreeNodeHeaderItem]']
        );
    }

    protected _itemMouseUp(
        e: SyntheticEvent,
        item: TreeItem,
        domEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (domEvent.target.closest('.js-controls-Tree__row-expander')) {
            e.stopPropagation();
            this._onExpanderMouseUp(domEvent.nativeEvent, item);
            return;
        }

        if (!this._shouldHandleItemMouseUp(item)) {
            return;
        }

        super._itemMouseUp(e, item, domEvent);
    }

    protected _itemMouseLeave(
        e: SyntheticEvent,
        item: CollectionItem,
        nativeEvent: SyntheticEvent<MouseEvent>
    ) {
        super._itemMouseLeave(e, item, nativeEvent);

        const dndListController = this._getDndListController();
        if (dndListController && dndListController.isDragging()) {
            const currentPosition = dndListController.getDragPosition();
            if (
                currentPosition &&
                currentPosition.dispItem === item &&
                currentPosition.position === 'on'
            ) {
                dndListController.setDragPosition(null);
            }
        }
    }

    private _onExpanderMouseDown(event: MouseEvent, item: TreeItem): void {
        if (this.isLoading()) {
            return;
        }

        if (MouseUp.isButton(event, MouseButtons.Left)) {
            this._mouseDownExpanderKey = item.key;
        }
    }

    private _onExpanderMouseUp(event: MouseEvent, item: TreeItem): void {
        if (this.isLoading()) {
            return;
        }

        if (this._mouseDownExpanderKey === item.key && MouseUp.isButton(event, MouseButtons.Left)) {
            this._toggleExpanded(item);

            if (this._options.markItemByExpanderClick && !item.isGroupNode()) {
                this.setMarkedKey(item.key);
            }
        }

        this._mouseDownExpanderKey = undefined;
    }

    _onViewKeyDown(event): void {
        if (this._options.supportExpand !== false && this._listViewModel.SupportExpand !== false) {
            this._onTreeViewKeyDown(event);
        }
        if (!event.stopped && event._bubbling !== false) {
            super._onViewKeyDown(event);
        }
    }

    _onTreeViewKeyDown(event) {
        EventUtils.keysHandler(event, HOT_KEYS, this, this, false);
    }

    protected _afterReloadCallback(options: TOptions, loadedList: RecordSet): void {
        if (this._listViewModel) {
            // На _beforeUpdate уже поздно обновлять контроллер, т.к. данный метод вызовется
            // из BaseControl::_beforeUpdate до логики в BaseTreeControl::_beforeUpdate
            // и он заюзает expandController со старой моделью
            // TODO удалить после https://online.sbis.ru/opendoc.html?guid=961081b9-a94d-4694-9165-cd56cc843ab2
            this._expandController.updateOptions({
                model: this._listViewModel,
            });

            const modelRoot = this._listViewModel.getRoot();
            const sourceControllerRoot = this._sourceController?.getRoot();
            let newRoot;
            if (sourceControllerRoot !== undefined) {
                newRoot = sourceControllerRoot;
            } else if (options.root !== undefined) {
                newRoot = options.root;
            } else {
                newRoot = this._root;
            }
            const viewModelRoot = modelRoot ? modelRoot.getContents() : newRoot;

            // Всегда нужно пересчитывать hasMoreStorage, т.к. даже если нет загруженных элементов или не deepReload,
            // то мы должны сбросить hasMoreStorage
            // Вызываем метод с флагом reBuildNodeFooters, т.к. после перезагрузки не будет события с добавлением
            // элементов и футеры без флага не посчитаются
            const expandedItems = this._updateExpandedItemsAfterReload
                ? options.expandedItems
                : this._expandController.getExpandedItems();
            this._updateHasMoreStorage(expandedItems, true, loadedList);

            if (this._updateExpandedItemsAfterReload) {
                this._expandController.disableLoader();
                this._expandController.setExpandedItems(options.expandedItems);
                this._expandController.enableLoader();

                this._updateExpandedItemsAfterReload = false;
            }

            if (this._resetExpandedItemsAfterReload) {
                this._resetExpandedItems();
                this._resetExpandedItemsAfterReload = false;
            }

            if (viewModelRoot !== newRoot) {
                // На dataLoadCallback не пересчитываем коллекцию, т.к. это будет лишний пересчет.
                // Затем данные вмерджатся в rs, сработает событие и коллекция пересчитается.
                this._applyNewRoot(newRoot, false);
                this._resetItemActionsController();
            }
        }
    }

    protected _afterItemsSet(options: ITreeControlOptions): void {
        super._afterItemsSet(options);
        if (options.markerMoveMode === 'leaves') {
            this._setMarkerOnFirstLeaf(options, options.markedKey);
        }
    }
    protected _afterCollectionReset(): void {
        super._afterCollectionReset.apply(this, arguments);
        if (this._options.markerMoveMode === 'leaves') {
            this._setMarkerOnFirstLeaf(this._options);
        }
    }
    protected _afterCollectionRemove(removedItems: TreeItem[], removedItemsIndex: number): void {
        super._afterCollectionRemove(removedItems, removedItemsIndex);

        const result = this._expandController.onCollectionRemove(removedItems);
        this._changeExpandCollapseState(result.expandedItems, result.collapsedItems);
    }

    protected _onCollectionChangedScroll(
        action: string,
        newItems: TreeItem[],
        newItemsIndex: number,
        removedItems: TreeItem[],
        removedItemsIndex: number
    ): void {
        // Если развернули или свернули узел,
        // то скролл нужно восстанавливать относительно первой полностью видимой записи.
        if (
            (action === IObservable.ACTION_ADD || action === IObservable.ACTION_REMOVE) &&
            this._collectionChangeCauseByNode
        ) {
            this._collectionChangeCauseByNode = false;
            this._listVirtualScrollController.setPredicatedRestoreDirection('backward');
        }
        super._onCollectionChangedScroll(
            action,
            newItems,
            newItemsIndex,
            removedItems,
            removedItemsIndex
        );
    }

    protected _beforeDataLoadCallback(items: RecordSet, direction: IDirection): void {
        super._beforeDataLoadCallback(items, direction);

        this._updateHasMoreStorage(this._expandController.getExpandedItems(), false, items);
    }

    protected _loadedItemsIsHidden(loadedItems: RecordSet): boolean {
        const itemIsVisible = (item: Model) => {
            const hasItem = !!this._listViewModel.isVisibleItem(item.getKey());
            const newRoot = this._sourceController.getRoot();
            const rootChanged = this._listViewModel.getRoot().key !== newRoot;
            const itemFromNewRoot = item.get(this._listViewModel.getParentProperty()) === newRoot;
            return hasItem || (rootChanged && itemFromNewRoot);
        };
        return loadedItems && factory(loadedItems).filter(itemIsVisible).count() === 0;
    }
    private _setMarkerOnFirstLeaf(options: ITreeControlOptions, startKey?: CrudEntityKey): void {
        const markerController = this.getMarkerController();
        const model = this._listViewModel;
        const list = model.getSourceCollection() as unknown as RecordSet;
        const current = list.getRecordById(startKey) || list.at(0);
        if (current) {
            if (current.get(this._options.nodeProperty) !== null) {
                this._tempItem = current.getKey();
                this._currentItem = this._tempItem;
                this._doAfterItemExpanded = (itemKey) => {
                    this._doAfterItemExpanded = null;
                    this._applyMarkedLeaf(itemKey, model, markerController);
                };
                const eventResult = this._options.notifyCallback('beforeItemExpand', [current]);
                if (eventResult instanceof Promise) {
                    eventResult.then(() => {
                        this._expandedItemsToNotify = this._expandToFirstLeaf(
                            this._tempItem,
                            list,
                            options
                        );
                    });
                } else {
                    this._expandedItemsToNotify = this._expandToFirstLeaf(
                        this._tempItem,
                        list,
                        options
                    );
                }
            } else {
                this._applyMarkedLeaf(current.getKey(), model, markerController);
            }
        }
    }

    // раскрытие узлов будет отрефакторено по задаче
    // https://online.sbis.ru/opendoc.html?guid=2a2d9bc6-86e0-43fa-9bea-b636c45c0767
    _keyDownHandler(event): boolean {
        if (this._options.markerMoveMode === 'leaves') {
            switch (event.nativeEvent.keyCode) {
                case constants.key.up:
                    this.goToPrev();
                    return false;
                case constants.key.down:
                    this.goToNext();
                    return false;
            }
        }
    }

    private _getMarkedLeaf(key: CrudEntityKey, model): 'first' | 'last' | 'middle' | 'single' {
        const index = model.getIndexByKey(key);

        // Если не нашли элемент, значит, еще рано менять состояние.
        if (index === -1) {
            return this._markedLeaf;
        }
        const hasNextLeaf =
            model.getLast('Markable') !== model.getItemBySourceKey(key) || model.hasMoreData();
        let hasPrevLeaf = false;
        for (let i = index - 1; i >= 0; i--) {
            if (model.at(i).isNode() === null || !this._isExpanded(model.at(i).getContents())) {
                hasPrevLeaf = true;
                break;
            }
        }
        if (hasNextLeaf && hasPrevLeaf) {
            return 'middle';
        }
        if (!hasNextLeaf && !hasPrevLeaf) {
            return 'single';
        }
        if (!hasNextLeaf && hasPrevLeaf) {
            return 'last';
        }
        if (hasNextLeaf && !hasPrevLeaf) {
            return 'first';
        }
    }
    goToNext(listModel?, mController?): Promise {
        return new Promise((resolve) => {
            // Это исправляет ошибку плана 0 || null
            const key =
                this._tempItem === undefined || this._tempItem === null
                    ? this._currentItem
                    : this._tempItem;
            const model = listModel || this._listViewModel;
            const goToNextItem = () => {
                const item = this.getNextItem(key, model);
                const markerController = mController || this.getMarkerController();
                if (item) {
                    this._tempItem = item.getKey();
                    if (item.get(this._options.nodeProperty) !== null) {
                        this._doAfterItemExpanded = () => {
                            this._doAfterItemExpanded = null;
                            this.goToNext(model, markerController);
                        };
                        if (this._isExpanded(item)) {
                            this._doAfterItemExpanded();
                            resolve();
                        } else {
                            this._scrollToLeafOnDrawItems = true;
                            const expandResult = this.toggleExpanded(this._tempItem, model);
                            if (expandResult instanceof Promise) {
                                expandResult.then(() => {
                                    resolve();
                                });
                            } else {
                                resolve();
                            }
                        }
                    } else {
                        const itemKey = this._tempItem;
                        this._applyMarkedLeaf(this._tempItem, model, markerController);
                        this._scrollToLeaf = () => {
                            this.scrollToItem(itemKey, 'bottom');
                        };
                        resolve();
                    }
                } else {
                    this._tempItem = null;
                    resolve();
                }
            };
            goToNextItem();
        });
    }

    goToPrev(listModel?, mController?): Promise {
        return new Promise((resolve) => {
            // Это исправляет ошибку плана 0 || null
            const key =
                this._tempItem === undefined || this._tempItem === null
                    ? this._currentItem
                    : this._tempItem;
            const item = this.getPrevItem(key, listModel);
            const model = listModel || this._listViewModel;
            const markerController = mController || this.getMarkerController();
            if (item) {
                const itemKey = item.getKey();
                if (item.get(this._options.nodeProperty) !== null) {
                    this._doAfterItemExpanded = () => {
                        this._doAfterItemExpanded = null;
                        this.goToPrev(model, markerController);
                    };
                    if (this._isExpanded(item)) {
                        this._tempItem = itemKey;
                        this._doAfterItemExpanded();
                        resolve();
                    } else {
                        this._goToNextAfterExpand = false;
                        this._scrollToLeafOnDrawItems = true;
                        const expandResult = this.toggleExpanded(itemKey);
                        if (expandResult instanceof Promise) {
                            expandResult.then(() => {
                                this._expandToFirstLeaf(
                                    itemKey,
                                    model.getSourceCollection(),
                                    this._options
                                );
                                resolve();
                            });
                        } else {
                            this._expandToFirstLeaf(
                                itemKey,
                                model.getSourceCollection(),
                                this._options
                            );
                            resolve();
                        }
                    }
                } else {
                    this._tempItem = itemKey;
                    this._applyMarkedLeaf(this._tempItem, model, markerController);
                    this._scrollToLeaf = () => {
                        this.scrollToItem(itemKey, 'top');
                    };
                    resolve();
                }
            } else {
                this._tempItem = null;
                resolve();
            }
        });
    }

    /**
     * Метод для определения позиции добавляемой записи по-умолчанию.
     * Если в дереве маркер стоит на развернутом узле или на его дочерних записях/свёрнутых узлах,
     * то позиция по-умолчанию для добавляемой записи - этот раскрытый узел.
     * Во всех остальных случаях позицией будет текущий корень дерева.
     *
     * @return {TKey} Ключ розительского узла для добавления по-умолчанию.
     */
    getMarkedNodeKey(): TKey {
        const markedKey = this.getMarkerController().getMarkedKey();
        const markedItem = this._listViewModel.getItemBySourceKey(markedKey);

        if (markedItem) {
            if (
                markedItem['[Controls/_baseTree/BreadcrumbsItem]'] ||
                (markedItem.isNode() !== null && markedItem.isExpanded())
            ) {
                // Узел раскрыт.
                return markedItem.key;
            } else if (!markedItem.getParent().isRoot()) {
                const contents = getPlainItemContents(markedItem.getParent());
                // Если запись вложена, то добавлять нужно в родителя, т.к. он - развернутый узел.
                return contents.getKey();
            }
        }

        const currentRoot = this._listViewModel.getRoot();
        return currentRoot.isRoot() ? currentRoot.contents : currentRoot.contents.getKey();
    }

    private _applyMarkedLeaf(key: CrudEntityKey, model, markerController): void {
        this._currentItem = key;
        const newMarkedLeaf = this._getMarkedLeaf(this._currentItem, model);
        if (this._markedLeaf !== newMarkedLeaf) {
            if (this._options.markedLeafChangeCallback) {
                this._options.markedLeafChangeCallback(newMarkedLeaf);
            }
            this._markedLeaf = newMarkedLeaf;
        }

        if (this._isMounted) {
            this._changeMarkedKey(this._currentItem);
        } else {
            markerController.setMarkedKey(this._currentItem);
        }

        this._tempItem = null;
        this._goToNextAfterExpand = true;
    }

    protected _changeMarkedKey(
        newMarkedKey: CrudEntityKey,
        shouldFireEvent: boolean = false
    ): Promise<CrudEntityKey> | CrudEntityKey {
        const item = this.getViewModel().getItemBySourceKey(newMarkedKey);
        // Не нужно ставить маркер, если провалились в папку
        // Но markedKey нужно изменить, если маркер сбросили
        if (
            (this._options.markerMoveMode === 'leaves' && item && item.isNode() !== null) ||
            ((this._options.canMoveMarker ? !this._options.canMoveMarker() : false) &&
                this._options.markerVisibility !== 'visible' &&
                newMarkedKey !== null &&
                newMarkedKey !== undefined)
        ) {
            return;
        }

        return super._changeMarkedKey(newMarkedKey, shouldFireEvent);
    }

    getNextItem(key: CrudEntityKey, model?): Model {
        const listModel = model || this._listViewModel;
        const nextItem = listModel.getNextInRecordSetProjection(
            key,
            this._expandController.getExpandedItems()
        );
        return nextItem || null;
    }

    getPrevItem(key: CrudEntityKey, model?): Model {
        const listModel = model || this._listViewModel;
        const prevItem = listModel.getPrevInRecordSetProjection(
            key,
            this._expandController.getExpandedItems()
        );
        return prevItem || null;
    }

    private _isExpanded(item: Model): boolean {
        return this._expandController.isItemExpanded(item.getKey());
    }

    protected _getFooterSpacingClasses(options): string {
        let result = super._getFooterSpacingClasses(options);

        if (this._listViewModel && this._listViewModel['[Controls/_display/Tree]']) {
            const expanderVisibility = this._listViewModel.getExpanderVisibility();
            const expanderPosition = options.expanderPosition || 'default';
            const hasExpander =
                expanderPosition === 'default' &&
                this._listViewModel.getExpanderIcon() !== 'none' &&
                ((expanderVisibility === 'hasChildren' &&
                    this._listViewModel.hasNodeWithChildren()) ||
                    (expanderVisibility !== 'hasChildren' && this._listViewModel.hasNode()));
            if (hasExpander) {
                result += ' controls-TreeView';
                if (options.style === 'master') {
                    result += '-master';
                }
                result += `__expanderPadding-${options.expanderSize || 'default'}`;
            }
        }

        return result;
    }

    protected _getSiblingStrategy(): ISiblingStrategy {
        return new TreeSiblingStrategy({
            collection: this._listViewModel,
        });
    }

    protected _shouldCancelEditing(toggleItemKeys: CrudEntityKey[]): boolean {
        let shouldCancelEditing = false;
        if (this._editInPlaceController && this._editInPlaceController.getEditableItem()) {
            const editingKey = this._editInPlaceController.getEditableItem().getContents().getKey();
            toggleItemKeys.forEach((itemKey) => {
                shouldCancelEditing =
                    shouldCancelEditing ||
                    _private.hasInParents(this._listViewModel, editingKey, itemKey);
            });
        }
        return shouldCancelEditing;
    }

    // region HasMoreStorage

    private _updateHasMoreStorage(
        expandedItems: CrudEntityKey[],
        reBuildNodeFooters: boolean = false,
        items: RecordSet = this._items,
        nodeKey?: CrudEntityKey
    ): void {
        const hasMoreStorage = this._prepareHasMoreStorage(
            expandedItems,
            this._options.nodeProperty,
            items,
            nodeKey
        );
        this._listViewModel.setHasMoreStorage(hasMoreStorage, reBuildNodeFooters);
    }

    private _prepareHasMoreStorage(
        expandedItems: TKey[],
        nodeProperty: string,
        items: RecordSet,
        loadedNodeKey?: CrudEntityKey
    ): IHasMoreStorage {
        const realExpandedItems = this._getRealExpandedItems(
            expandedItems,
            nodeProperty,
            items,
            loadedNodeKey
        );
        const sourceController = this.getSourceController();
        const hasMore =
            this._listViewModel && !this._listViewModel.destroyed
                ? { ...this._listViewModel.getHasMoreStorage() }
                : {};

        realExpandedItems.forEach((nodeKey) => {
            hasMore[nodeKey] = {
                backward: sourceController ? sourceController.hasMoreData('up', nodeKey) : false,
                forward: sourceController ? sourceController.hasMoreData('down', nodeKey) : false,
            };
        });

        return hasMore;
    }

    /**
     * Возвращает идентификаторы раскрытых узлов. В случае если переданные expandedItems не равны
     * [ALL_EXPANDED_VALUE], то вернутся копия переданного массива. В противном случае вернутся идентификаторы
     * всех узлов, присутствующих в указанных items
     */
    private _getRealExpandedItems(
        expandedItems: CrudEntityKey[],
        nodeProperty: string,
        items: RecordSet,
        loadedNodeKey?: CrudEntityKey
    ): CrudEntityKey[] {
        if (!items) {
            return [];
        }
        let realExpandedItems: CrudEntityKey[];

        if (this._expandController.isAllExpanded(expandedItems)) {
            realExpandedItems = [];
            items.each((item) => {
                if (item.get(nodeProperty) !== null) {
                    realExpandedItems.push(item.getKey());
                }
            });

            if (loadedNodeKey !== undefined && loadedNodeKey !== this._root) {
                realExpandedItems.push(loadedNodeKey);
            }
        } else {
            realExpandedItems = expandedItems.slice();
        }

        return realExpandedItems;
    }

    // endregion HasMoreStorage

    // region Expand/Collapse

    private _expandMarkedItem(): void {
        const markerController = this._markerController;
        const markedKey = markerController?.getMarkedKey() || null;

        if (markedKey === null) {
            return;
        }

        const markedItem = this._listViewModel.getItemBySourceKey(markedKey);
        if (
            markedItem &&
            markedItem.isNode() !== null &&
            this._expandController.isItemCollapsed(markedKey)
        ) {
            this.toggleExpanded(markedKey);
        }
    }

    private _collapseMarkedItem(): void {
        const markerController = this._markerController;
        const markedKey = markerController?.getMarkedKey() || null;

        if (markedKey === null) {
            return;
        }

        const markedItem = this._listViewModel.getItemBySourceKey(markedKey);
        if (
            markedItem &&
            markedItem.isNode() !== null &&
            this._expandController.isItemExpanded(markedKey)
        ) {
            this.toggleExpanded(markedKey);
        }
    }

    private _toggleExpanded(item: TreeItem): Promise<void> {
        if (this._options.supportExpand === false || this._listViewModel.SupportExpand === false) {
            return Promise.resolve();
        }

        const contents = item.getContents();
        const nodeKey = contents.getKey();
        const expanded = !this._expandController.isItemExpanded(nodeKey);

        const expandToFirstLeafIfNeed = () => {
            // Если узел сворачивается - автоматически высчитывать следующий разворачиваемый элемент не требуется.
            // Ошибка: https://online.sbis.ru/opendoc.html?guid=98762b51-6b69-4612-9468-1c38adaa2606
            if (
                this._options.markerMoveMode === 'leaves' &&
                expanded !== false &&
                this._goToNextAfterExpand
            ) {
                this._tempItem = nodeKey;
                return this.goToNext();
            }
        };

        const eventResult = this._options.notifyCallback(
            expanded ? 'beforeItemExpand' : 'beforeItemCollapse',
            [contents]
        );
        if (eventResult instanceof Promise) {
            this._displayGlobalIndicator();
            return eventResult.then(
                () => {
                    if (this._indicatorsController.shouldHideGlobalIndicator()) {
                        this._indicatorsController.hideGlobalIndicator();
                    }
                    return this._doExpand(item)
                        .then(expandToFirstLeafIfNeed)
                        .catch((e) => {
                            return e;
                        });
                },
                () => {
                    if (this._indicatorsController.shouldHideGlobalIndicator()) {
                        this._indicatorsController.hideGlobalIndicator();
                    }
                }
            );
        } else {
            return this._doExpand(item)
                .then(expandToFirstLeafIfNeed)
                .catch((e) => {
                    return e;
                });
        }
    }

    private _doExpand(item: TreeItem): Promise<unknown> {
        const contents = item.getContents();
        const nodeKey = contents.getKey();
        const expanded = !this._expandController.isItemExpanded(nodeKey);

        const doExpand = () => {
            return new Promise((resolve) => {
                return Promise.resolve(this._expandController.toggleItem(nodeKey))
                    .then((result) => {
                        if (this._destroyed) {
                            return Promise.reject();
                        }

                        this._changeExpandCollapseState(
                            result.expandedItems,
                            result.collapsedItems
                        );
                        this._options.notifyCallback(
                            expanded ? 'afterItemExpand' : 'afterItemCollapse',
                            [contents]
                        );

                        // Если есть опция expandedItems, то это значит что состояние expanded в модель
                        // мы применим на _beforeUpdate. В этот же момент нужно зарезолвить промис.
                        if (this._options.expandedItems) {
                            this._toggleExpandedResolver = resolve;
                        } else {
                            resolve(null);
                        }
                    })
                    .catch((e) => {
                        return resolve(e);
                    });
            });
        };

        this._options.notifyCallback(expanded ? 'itemExpand' : 'itemCollapse', [contents]);

        this._collectionChangeCauseByNode = true;

        // Если сворачивается узел, внутри которого запущено редактирование, то его следует закрыть
        if (this._shouldCancelEditing([item.key])) {
            return this.cancelEdit().then((result) => {
                if (!(result && result.canceled)) {
                    return doExpand();
                }
                return result;
            });
        } else {
            return doExpand();
        }
    }

    private _expandToFirstLeaf(key: CrudEntityKey, items, options): CrudEntityKey[] {
        if (items.getCount()) {
            const model = this._listViewModel;
            const expanded = [key];
            const item = model.getItemBySourceKey(key);
            let curItem = model.getChildrenByRecordSet(item.getContents())[0];
            while (curItem && curItem.contents.get(options.nodeProperty) !== null) {
                expanded.push(curItem.contents.getKey());
                curItem = model.getChildrenByRecordSet(curItem)[0];
            }
            if (curItem && this._doAfterItemExpanded) {
                this._doAfterItemExpanded(curItem.contents.getKey());
            }
            return expanded;
        }
    }

    private _resetExpandedItems(): void {
        if (!this._listViewModel) {
            return;
        }

        const reset = () => {
            const result = this._expandController.resetExpandedItems();

            if (this._isMounted) {
                this._changeExpandCollapseState(result.expandedItems, result.collapsedItems);
            }
        };

        if (this._shouldCancelEditing(this._expandController.getExpandedItems())) {
            this.cancelEdit().then((result) => {
                if (!(result && result.canceled)) {
                    reset();
                }
                return result;
            });
        } else {
            reset();
        }
    }

    private _changeExpandCollapseState(
        expandedItems: CrudEntityKey[],
        collapsedItems: CrudEntityKey[]
    ): void {
        const expandedItemsChanged = !isEqual(
            this._expandController.getExpandedItems(),
            expandedItems
        );
        const collapsedItemsChanged = !isEqual(
            this._expandController.getCollapsedItems(),
            collapsedItems
        );

        if (!this._options.expandedItems && expandedItemsChanged) {
            this._updateHasMoreStorage(expandedItems);

            // Сперва обновляем sourceController, т.к. обновление коллекции вызовет событие об изменении
            // По событию об изменение мы можем пересчитать selectedCount, кинем соответствующее событие
            // По нему будет обновлен контекст, который синхронно вызовет _beforeUpdate.
            // И в этом _beforeUpdate sourceController уже должен быть с правильными expandedItems
            const sourceController = this.getSourceController();
            if (sourceController) {
                if (this._options.childrenLoadMode === 'always') {
                    sourceController.resetCollapsedNodes(expandedItems);
                }
                sourceController.setExpandedItems(expandedItems);
            }

            this._expandController.setExpandedItems(expandedItems);
        }

        if (!this._options.collapsedItems && collapsedItemsChanged) {
            this._expandController.setCollapsedItems(collapsedItems);
        }

        if (expandedItemsChanged) {
            if (this._options.onExpandedItemsChanged) {
                this._options.onExpandedItemsChanged(expandedItems);
            } else {
                this._options.notifyCallback('expandedItemsChanged', [expandedItems]);
            }
        }
        if (collapsedItemsChanged) {
            this._options.notifyCallback('collapsedItemsChanged', [collapsedItems]);
        }
    }

    /**
     * Ф-ия, которая дёргается expandController'ом при раскрытии узла
     */
    private _expandLoader(nodeKey: TKey): void | Promise<RecordSet | void> {
        const sourceController = this.getSourceController();
        const item = this._listViewModel.getItemBySourceKey(nodeKey);

        // загружаем узел только если он не был загружен ранее
        // (проверяем через sourceController, была ли выполнена загрузка)
        const shouldLoadChildren = sourceController
            ? !sourceController.hasLoaded(nodeKey)
            : !this._options.items;
        if (
            item?.isRoot() ||
            sourceController?.hasLoaded(nodeKey) ||
            !shouldLoadChildren ||
            this._expandController.isAllExpanded()
        ) {
            return;
        }

        this._displayGlobalIndicator();
        return sourceController
            .load(undefined, nodeKey)
            .then((list) => {
                if (this._indicatorsController.shouldHideGlobalIndicator()) {
                    this._indicatorsController.hideGlobalIndicator();
                }
                return list as RecordSet;
            })
            .catch((error: Error) => {
                if (error.isCanceled) {
                    return;
                }
                if (this._indicatorsController.shouldHideGlobalIndicator()) {
                    this._indicatorsController.hideGlobalIndicator();
                }
                throw error;
            });
    }

    // endregion Expand/Collapse

    protected _nodeDataMoreLoadCallback(nodeKey: CrudEntityKey, items: RecordSet): void {
        // В этом случае нужно пересчитывать футеры, если подгрузили 0 записей. Т.к. collectionChange не произойдет
        // и пересчета не будет.
        this._updateHasMoreStorage(
            this._expandController.getExpandedItems(),
            items.getCount() === 0,
            items,
            nodeKey
        );
    }

    static getDefaultOptions() {
        return {
            ...BaseControl.getDefaultOptions(),
            filter: {},
            markItemByExpanderClick: true,
            expandByItemClick: false,
            root: null,
            columns: DEFAULT_COLUMNS_VALUE,
            expanderPosition: 'default',
            markerMoveMode: 'all',
            supportExpand: true,
            selectDescendants: true,
            selectAncestors: true,
            recursiveSelection: false,
            selectionType: 'all',
            loadNodeOnScroll: true,
            selectionCountMode: 'all',
        };
    }
}

BaseTreeControl._private = _private;

export default BaseTreeControl;

/**
 * @event expandedItemsChanged Событие контрола.
 * @name Controls/_tree/BaseTreeControl#expandedItemsChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} expandedItems Массив с идентификаторами развернутых элементов.
 */
