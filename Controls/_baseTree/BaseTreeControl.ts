/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { SyntheticEvent } from 'UI/Vdom';
import { EventUtils } from 'UI/Events';
import { constants } from 'Env/Env';
import { CrudEntityKey } from 'Types/source';
import { IObservable, RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Direction, ISelectionObject, TKey } from 'Controls/interface';
import {
    BaseControl,
    getKey,
    getPlainItemContents,
    IDirection,
    IReloadItemOptions,
    ISiblingStrategy,
    JS_NAVIGATION_BUTTON_SELECTOR,
    TExtLogInfo,
} from 'Controls/baseList';
import type { Collection, CollectionItem, IDragPosition } from 'Controls/display';
import { ISourceControllerOptions } from 'Controls/dataSource';
import { MouseButtons, MouseUp } from 'Controls/popup';
import {
    TreeItem,
    TreeSiblingStrategy,
    Tree,
    IHasMoreStorage,
    ITreeCollectionOptions,
} from 'Controls/baseTreeDisplay';
import { Logger } from 'UI/Utils';
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
import type { ICommand } from 'Controls/listCommands';
import 'css!Controls/itemActions';
import 'css!Controls/CommonClasses';
// Нужно только для CharacteristicsTemplate
// Будет удалено по https://online.sbis.ru/opendoc.html?guid=988447f1-6e8d-4d35-b8e0-1e2b83170222&client=3
import 'css!Controls/list';
import 'css!Controls/baseTree';
import { BASE_TREE_CONTROL_DEFAULT_OPTIONS } from './compatibility/BaseTreeControlComponent';

type Class<T> = new (...args: any[]) => T;

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
        while (current && !current.isRoot()) {
            current = current.getParent();
            if (!current.isRoot() && current === targetParent) {
                return true;
            }
        }
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
    TOptions extends ITreeControlOptions = ITreeControlOptions,
> extends BaseControl<TOptions> {
    private _root: CrudEntityKey = null;
    private _rootChanged: boolean = false;
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

    private _mouseDownExpanderKey: TKey;
    private _expandedItemsToNotify: TKey[];
    private _beforeItemExpandPromise?: Promise<void>;

    _listViewModel: Tree = null;

    constructor(options: TOptions, context?: object) {
        super(options, context);
        options.slicelessBaseTreeConstructor?.(this, options);
        this._nodeDataMoreLoadCallback = this._nodeDataMoreLoadCallback.bind(this);
        if (typeof options.root !== 'undefined') {
            this._root = options.root;
        }
    }

    protected _beforeMount(...args: [TOptions, object]): void | Promise<unknown> {
        const options = args[0];

        options.slicelessBaseTreeBeforeMount?.(this, options);

        const superResult = super._beforeMount(...args);
        const doBeforeMount = () => {
            options.slicelessBaseTreeDoBeforeMount?.(this);

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

                // todo: Тоже в compatibility?
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
        this._options.slicelessBaseTreeAfterMount?.(this, this._options);
    }

    protected _createNewModel(
        items: RecordSet,
        modelConfig: ITreeCollectionOptions,
        modelName: string
    ): Collection {
        const hasMoreStorage = this._prepareHasMoreStorage(
            modelConfig as unknown as TOptions,
            (modelConfig as unknown as TOptions).getExpandedItemsCompatible(
                this,
                modelConfig as unknown as TOptions
            ),
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
     * Возвращает key узла, если direction === 'down' и item это раскрытый узел в котором есть не загруженные данные
     * и не задан футер списка и нет данных для загрузки в дочернем узле, иначе возвращает null
     * @param {Direction} direction - текущее направление подгрузки
     * @param {TreeItem} item - проверяемая запись
     * @private
     */
    private _getLastExpandedNodeKey(direction: Direction, item: TreeItem): CrudEntityKey | null {
        // Иногда item это breadcrumbsItemRow, он не TreeItem
        if (
            direction !== 'down' ||
            !item ||
            !item['[Controls/_display/TreeItem]'] ||
            !this._options.loadNodeOnScroll ||
            this._options.footerTemplate ||
            !this._sourceController ||
            this._sourceController.isLoading() ||
            this._selectedItemsShown ||
            item['[Controls/_baseTree/BreadcrumbsItem]']
        ) {
            return null;
        }

        const itemKey = item.getContents().getKey();
        const hasMoreData = this._sourceController.hasMoreData('down', itemKey);

        const lastChildItem = item.getLastChildItem();

        if (
            !hasMoreData &&
            item.isExpanded() &&
            item.isNode() !== null &&
            lastChildItem &&
            lastChildItem.isNode() !== null
        ) {
            return this._getLastExpandedNodeKey(direction, lastChildItem);
        } else if (item.hasMoreStorage('forward')) {
            return itemKey;
        }
        return null;
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
        let lastRootItem;
        if (this._listViewModel.getNodeTypeProperty()) {
            // Найти последнюю запись, которая не является пустой группой
            lastRootItem = this._listViewModel.getRoot().getLastVisibleItem();
        } else {
            lastRootItem = this._listViewModel.getRoot().getLastChildItem();
        }

        // Если последняя видимая корневая запись это раскрытый узел у которого есть данные для подгрузки,
        // то получаем key узла, если нет, то получаем null
        const lastExpandedNodeKey = lastRootItem
            ? this._getLastExpandedNodeKey(direction, lastRootItem)
            : null;

        // Если был получен key узла, то загружаем его дочерние элементы
        if (lastExpandedNodeKey) {
            this._addItemsByLoadToDirection = true;
            _private.loadNodeChildren(this, lastExpandedNodeKey).then((result) => {
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
                this._applyMarkedLeaf(
                    newOptions.markedKey,
                    viewModel,
                    this._options.slicelessGetMarkerController(this, this._options)
                );
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

        if (newOptions.nodeHeaderTemplate !== this._options.nodeHeaderTemplate) {
            viewModel.setNodeHeaderTemplate(newOptions.nodeHeaderTemplate);
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

            newOptions.slicelessBaseTreeStartBeforeUpdate?.(this, newOptions);

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
                    const items = sourceController?.getItems() || newOptions.items;
                    this._options.itemsSetCallback(items, newOptions);
                }
            }
        }

        newOptions.slicelessBaseTreeEndBeforeUpdate?.(this, newOptions);

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
                        'на Controls/listDataOld:DataContainer (Layout/browsers:Browser). Если вы передаёте sourceController ' +
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
            const markedItem = this._listViewModel.getItemBySourceKey(
                newOptions.getMarkedKeyCompatible(this, newOptions)
            );
            // Если маркер и так на листе, то не пересчитываем
            if (!markedItem || markedItem.isNode() !== null) {
                this._setMarkerOnFirstLeaf(newOptions, newOptions.markedKey);
            }
        }

        if (this._rootChanged) {
            if (this._selectionController) {
                this._options.notifyCallback('listSelectedKeysCountChanged', [
                    this._selectionController.getCountOfSelected(),
                    this._selectionController.isAllSelected(false),
                ]);
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
        this._options.slicelessBaseTreeAfterUpdate?.(this, this._options);
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

    private _applyNewRoot(newRoot: CrudEntityKey, reBuild: boolean = true): void {
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
        this._options.resetExpansion(this, this._options);
    }

    toggleExpanded(key: TKey): Promise<void> {
        return this._options.toggleExpansion(key, {}, this, this._options);
    }

    protected _onloadMore(e, dispItem?, direction?: IDirection): void {
        if (dispItem) {
            const nodeKey = dispItem.getContents().getKey();
            _private.loadNodeChildren(this, nodeKey, direction);
        } else {
            super._onloadMore(e);
        }
    }

    reloadItem(key: TKey, reloadOptions: IReloadItemOptions = {}): Promise<Model | RecordSet> {
        return import('Controls/listCommands').then(({ ReloadItem }) => {
            return this._executeReloadCommand(ReloadItem, {
                itemKey: key,
                ...reloadOptions,
            }) as Promise<RecordSet | Model>;
        });
    }

    /**
     * Перезагружает указанные записи списка. Для этого отправляет запрос query-методом
     * со значением текущего фильтра в поле [parentProperty] которого передаются идентификаторы
     * родительских узлов.
     */
    reloadItems(ids: TKey[]): Promise<RecordSet | Error> {
        return import('Controls/listCommands').then(({ ReloadItems }) => {
            return this._executeReloadCommand(ReloadItems, { keys: ids }) as Promise<
                RecordSet | Error
            >;
        });
    }

    private _executeReloadCommand<T extends ICommand>(
        commandClass: Class<T>,
        commandOptions: object
    ): Promise<RecordSet | Model> {
        const command = new commandClass();
        const options = this._options;

        return command
            .execute({
                ...commandOptions,
                sourceController: this.getSourceController(),
                filter: options.filter,
                parentProperty: options.parentProperty,
                nodeProperty: options.nodeProperty,
                items: options.items || this._sourceController?.getItems?.(),
                root: options.root,
                expandedItems: options.expandedItems,
                keyProperty: this._keyProperty,
            })
            .then((items) => {
                if (items instanceof RecordSet) {
                    const meta = items.getMetaData();
                    if (meta.results) {
                        this.getViewModel().setMetaResults(meta.results);
                    }

                    this._updateHasMoreStorage(
                        options,
                        options.getExpandedItemsCompatible(this, options),
                        false,
                        items
                    );
                }

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
                // При dnd между реестрами, маркер не должен ставиться на тот
                // элемент, который мы только что развернули.
                this._options.expand(item.key, { markItem: false }, this, this._options);
            }, EXPAND_ON_DRAG_DELAY);
        }

        return changedPosition;
    }

    protected _beforeStartDrag(draggedKey: CrudEntityKey): void {
        super._beforeStartDrag(draggedKey);
        const draggedItem = this._listViewModel.getItemBySourceKey(draggedKey);
        // сворачиваем перетаскиваемый узел
        if (draggedItem && draggedItem.isNode() !== null) {
            this._options.beforeStartDragCompatible(draggedKey, this, this._options);
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
        options.expandedItems = (options as unknown as TOptions).getExpandedItemsCompatible(
            this,
            options as unknown as TOptions
        );
        options.root = this._root;

        // Нам не нужен multiNavigation, т.к. мы хотим получить записи именно по selection, независимо от развернутости.
        delete options.multiNavigation;

        return options;
    }

    private _clearTimeoutForExpandOnDrag(): void {
        if (this._timeoutForExpandOnDrag) {
            clearTimeout(this._timeoutForExpandOnDrag);
            this._timeoutForExpandOnDrag = null;
        }
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

    protected _onItemClickNew(originalEvent: SyntheticEvent<MouseEvent>, contents: Model) {
        if (originalEvent?.target?.closest?.('.js-controls-Tree__row-expander')) {
            return;
        }
        this._options.onItemClickNew(originalEvent, contents, this, this._options);
    }

    protected _onItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        columnIndex: number = null
    ): boolean {
        const key = getKey(contents);
        const item = this._listViewModel.getItemBySourceKey(key);

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

        const isExpanderClick = event.target.closest('.js-controls-Tree__row-expander');
        if (isExpanderClick && item['[Controls/_display/GroupItem]']) {
            return this._onGroupClick(event, item.contents, event.nativeEvent, item);
        }

        const result = super._onItemClick(event, contents, originalEvent, columnIndex);

        if (item && result !== false) {
            const shouldToggleExpanded = this._shouldExpandItemByClick(item, originalEvent);
            if (shouldToggleExpanded) {
                this.toggleExpanded(key);
            }
        }

        if (item && item.isGroupNode?.()) {
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
        const item = this._listViewModel.getItemBySourceItem(contents);

        if (originalEvent.target.closest('.js-controls-Tree__row-expander')) {
            event?.stopPropagation();
            return false;
        }

        if (item && item.isGroupNode()) {
            // развернем группу только если нажали на экспандер или название
            return false;
        }

        return super._notifyItemClick(event, contents, originalEvent, columnIndex);
    }

    protected _notifyItemActivate(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        columnIndex: number
    ): void {
        const item = this._listViewModel.getItemBySourceKey(getKey(contents));
        const shouldToggleExpanded = this._shouldExpandItemByClick(item, originalEvent);
        const allowToggleByHasChildren =
            this.props.expanderVisibility !== 'hasChildren' ||
            (item.getHasChildrenProperty() && item.hasChildren());
        const allowByExpanderIcon =
            item['[Controls/_display/TreeItem]'] && item.getExpanderIcon() !== 'none';
        if (shouldToggleExpanded && allowToggleByHasChildren && allowByExpanderIcon) {
            return;
        }

        this._options.notifyCallback('itemActivate', [contents, originalEvent, columnIndex], {
            bubbling: true,
        });
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
            item['[Controls/_display/TreeItem]'] &&
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
        const clickOnCheckbox = event.target.closest('.js-controls-ListView__checkbox');
        if (
            item['[Controls/_display/GroupItem]'] ||
            item['[Controls/_display/SpaceCollectionItem]'] ||
            clickOnCheckbox
        ) {
            event.stopPropagation();
            return;
        }

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
            const doBeforeExpand = () =>
                !item.isEditing()
                    ? Promise.resolve()
                    : this._commitEdit('hasChanges').then((res) => {
                          if (res && res.canceled) {
                              return Promise.reject();
                          }
                      });

            doBeforeExpand().then(() => {
                // _toggleExpanded после setMarkedKey, чтобы избежать неправильный стейт при загрузке данных
                // см. onLoadExpandedItem
                if (this._options.markItemByExpanderClick && !item.isGroupNode()) {
                    this._options.mark(item.key, this, this._options);
                }
                this._options.onExpanderClick(
                    item.key,
                    {
                        markItem: this._options.markItemByExpanderClick && !item.isGroupNode(),
                    },
                    this,
                    this._options
                );
            });
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
            options.slicelessBaseTreeStartAfterReloadCallback?.(this, options);

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

            options.slicelessBaseTreeEndAfterReloadCallback?.(loadedList, this, options);

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
        this._options.slicelessBaseTreeAfterCollectionRemove?.(removedItems, this, this._options);
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

        this._updateHasMoreStorage(
            this._options,
            this._options.getExpandedItemsCompatible(this, this._options),
            false,
            items
        );
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
        const markerController = options.slicelessGetMarkerController(this, options);
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
                let eventResult = null;
                if (this._isMounted) {
                    eventResult = this._options.notifyCallback('beforeItemExpand', [current]);
                }
                if (eventResult instanceof Promise) {
                    this._beforeItemExpandPromise = eventResult;
                    eventResult.then(() => {
                        this._expandedItemsToNotify = this._expandToFirstLeaf(
                            this._tempItem,
                            list,
                            options
                        );
                        this._beforeItemExpandPromise = null;
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
                const markerController =
                    mController || this._options.slicelessGetMarkerController(this, this._options);
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
                            const expandResult = this.toggleExpanded(this._tempItem);
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
            const markerController =
                mController || this._options.slicelessGetMarkerController(this, this._options);
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
        const markedKey = this._options.getMarkedKeyCompatible(this, this._options);
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
            this._options.mark(this._currentItem, this, this._options);
        } else {
            markerController.setMarkedKey(this._currentItem);
        }
        this._goToNextAfterExpand = true;
        // Если ждем обработку перед раскрытием узла,
        // то мы еще не закончили процедуру раскрытия узлов и сбрасывать состояния рано.
        // Сбросим, когда завершим.
        if (!this._beforeItemExpandPromise) {
            this._tempItem = null;
        }
    }

    getNextItem(key: CrudEntityKey, model?): Model {
        const listModel = model || this._listViewModel;
        const nextItem = listModel.getNextInRecordSetProjection(
            key,
            this._options.getExpandedItemsCompatible(this, this._options)
        );
        return nextItem || null;
    }

    getPrevItem(key: CrudEntityKey, model?): Model {
        const listModel = model || this._listViewModel;
        const prevItem = listModel.getPrevInRecordSetProjection(
            key,
            this._options.getExpandedItemsCompatible(this, this._options)
        );
        return prevItem || null;
    }

    private _isExpanded(item: Model): boolean {
        return this._options.isExpanded(item.getKey(), this, this._options);
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
            const editingDataKey = this._editInPlaceController
                .getEditableItem()
                .getContents()
                .getKey();
            const editingCollectionKey = this._editInPlaceController.getEditableItem().key;
            toggleItemKeys.forEach((itemKey) => {
                shouldCancelEditing =
                    shouldCancelEditing ||
                    _private.hasInParents(this._listViewModel, editingDataKey, itemKey) ||
                    _private.hasInParents(this._listViewModel, editingCollectionKey, itemKey);
            });
        }
        return shouldCancelEditing;
    }

    // region HasMoreStorage

    private _updateHasMoreStorage(
        options: TOptions,
        expandedItems: CrudEntityKey[],
        reBuildNodeFooters: boolean = false,
        items: RecordSet = this._items,
        nodeKey?: CrudEntityKey
    ): void {
        const hasMoreStorage = this._prepareHasMoreStorage(
            options,
            expandedItems,
            options.nodeProperty,
            items,
            nodeKey
        );
        this._listViewModel.setHasMoreStorage(hasMoreStorage, reBuildNodeFooters);
    }

    private _prepareHasMoreStorage(
        options: TOptions,
        expandedItems: TKey[],
        nodeProperty: string,
        items: RecordSet,
        loadedNodeKey?: CrudEntityKey
    ): IHasMoreStorage {
        const realExpandedItems = this._getRealExpandedItems(
            options,
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
        options: TOptions,
        expandedItems: CrudEntityKey[],
        nodeProperty: string,
        items: RecordSet,
        loadedNodeKey?: CrudEntityKey
    ): CrudEntityKey[] {
        if (!items) {
            return [];
        }
        let realExpandedItems: CrudEntityKey[];

        if (options.isExpandAll(expandedItems, this, options)) {
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
        this._doActionByKeyDownOnMarkedItem('expand');
    }

    private _collapseMarkedItem(): void {
        this._doActionByKeyDownOnMarkedItem('collapse');
    }

    private _doActionByKeyDownOnMarkedItem(action: 'expand' | 'collapse'): void {
        const markedKey = this._options.getMarkedKeyCompatible(this, this._options) || null;

        if (markedKey === null) {
            return;
        }

        const markedItem = this._listViewModel.getItemBySourceKey(markedKey);
        if (markedItem && markedItem.isNode() !== null) {
            this._options[action](markedKey, {}, this, this._options);
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

    // endregion Expand/Collapse

    protected _nodeDataMoreLoadCallback(nodeKey: CrudEntityKey, items: RecordSet): void {
        // В этом случае нужно пересчитывать футеры, если подгрузили 0 записей. Т.к. collectionChange не произойдет
        // и пересчета не будет.
        this._updateHasMoreStorage(
            this._options,
            this._options.getExpandedItemsCompatible(this, this._options),
            items.getCount() === 0,
            items,
            nodeKey
        );
    }

    protected _prepareExtLogInfo(): TExtLogInfo {
        const extLogInfo = super._prepareExtLogInfo();

        if (this._options.parentProperty) {
            extLogInfo.parentProperty = this._options.parentProperty;
        }

        if (this._options.nodeProperty) {
            extLogInfo.parentProperty = this._options.nodeProperty;
        }

        return extLogInfo;
    }

    static getDefaultOptions() {
        return {
            ...BaseControl.getDefaultOptions(),
            ...BASE_TREE_CONTROL_DEFAULT_OPTIONS,
            filter: {},
            root: null,
            columns: DEFAULT_COLUMNS_VALUE,
            expanderPosition: 'default',
            markerMoveMode: 'all',
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
 * @event Controls/_tree/BaseTreeControl#expandedItemsChanged Происходит при измененнии массива ключей развёрнутых узлов.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} expandedItems Массив с идентификаторами развернутых элементов.
 */
