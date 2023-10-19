/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { object } from 'Types/util';
import { Model } from 'Types/entity';
import { EnumeratorCallback, EnumeratorIndex } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import {
    ISelectionObject as ISelection,
    TSelectionCountMode,
    TSelectionType,
} from 'Controls/interface';
import type { BreadcrumbsItem, Tree, TreeItem } from 'Controls/baseTree';

import {
    ISelectionModel,
    IEntryPathItem,
    ITreeSelectionStrategyOptions,
    TKeys,
} from 'Controls/_multiselection/interface';
import { FlatSelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/Flat';
import * as Utils from 'Controls/_multiselection/Utils/Tree';

const LEAF = null;

/**
 * Стратегия выбора для иерархического списка.
 * @public
 */
export class TreeSelectionStrategy<
    TItem extends TreeItem = TreeItem
> extends FlatSelectionStrategy<TItem> {
    private _selectAncestors: boolean;
    private _selectDescendants: boolean;
    private _rootKey: CrudEntityKey;
    protected _model: ISelectionModel & Tree;
    private _entryPath: IEntryPathItem[];
    private _selectionType: TSelectionType | 'allBySelectAction' = 'all';
    private _selectionCountMode: TSelectionCountMode = 'all';
    private _recursiveSelection: boolean;
    private _rootChanged: boolean = false;
    private _isMassSelectMode: boolean = true;
    private _feature1188089336: boolean = false;

    constructor(options: ITreeSelectionStrategyOptions) {
        super(options);
        this.update(options);
    }

    update(options: ITreeSelectionStrategyOptions): void {
        this._validateOptions(options);

        if (this._rootKey !== undefined && this._rootKey !== options.rootKey) {
            this._rootChanged = true;
        }

        this._selectAncestors = options.selectAncestors;
        this._selectDescendants = options.selectDescendants;
        this._rootKey = options.rootKey;
        this._model = options.model;
        this._entryPath = options.entryPath;
        this._selectionType = options.selectionType;
        this._recursiveSelection = options.recursiveSelection;
        this._selectionCountMode = options.selectionCountMode;
        this._feature1188089336 = options.feature1188089336;
    }

    setEntryPath(entryPath: IEntryPathItem[]): void {
        this._entryPath = entryPath;
    }

    select(selection: ISelection, key: CrudEntityKey, searchMode?: boolean): ISelection {
        const item = this._getItem(key);
        const cloneSelection = object.clone(selection);

        // Если не найден item, то считаем что он не загружен и будет работать соответствующая логика
        if (item && !this._canBeSelected(item)) {
            return cloneSelection;
        }

        if (item && this._isNode(item)) {
            if (this._isMassSelectMode === false) {
                this._selectAllChildren(cloneSelection, item, searchMode);
            } else {
                this._selectNode(cloneSelection, item, searchMode);
            }
        } else {
            this._selectLeaf(cloneSelection, key, this._getKey(item?.getParent() as TItem));
        }

        return cloneSelection;
    }

    _selectAllChildren(cloneSelection: ISelection, item: TItem, searchMode?: boolean): ISelection {
        const children = this._getAllChildrenIds(item);
        if (children.length) {
            children.forEach((childKey) => {
                const childItem = this._getItem(childKey);
                if (childItem && this._isNode(childItem)) {
                    this._selectAllChildren(cloneSelection, childItem, searchMode);
                } else {
                    this._selectLeaf(cloneSelection, childKey, this._getKey(item));
                }
            });
        } else {
            this._selectNode(cloneSelection, item, searchMode);
        }

        return cloneSelection;
    }

    unselect(selection: ISelection, key: CrudEntityKey, searchMode?: boolean): ISelection {
        const item = this._getItem(key);
        const cloneSelection = object.clone(selection);

        // Если не найден item, то считаем что он не загружен и будет работать соответствующая логика
        if (item && !this._canBeSelected(item)) {
            return cloneSelection;
        }

        if (!item) {
            ArraySimpleValuesUtil.removeSubArray(cloneSelection.selected, [key]);
            if (this._isAllSelectedInRoot(selection)) {
                ArraySimpleValuesUtil.addSubArray(cloneSelection.excluded, [key]);
            }
        } else if (this._isNode(item)) {
            this._unselectNode(cloneSelection, item, searchMode);
        } else {
            this._unselectLeaf(cloneSelection, item);
        }
        if (
            key !== this._rootKey &&
            item &&
            this._selectAncestors &&
            !item['[Controls/_baseTree/BreadcrumbsItem]']
        ) {
            this._unselectParentNodes(cloneSelection, item.getParent() as TItem, searchMode);
        }
        if (
            searchMode &&
            this._isAllSelectedInRoot(cloneSelection) &&
            this._isAllChildrenExcluded(cloneSelection, this._getRoot())
        ) {
            cloneSelection.selected.length = 0;
            cloneSelection.excluded.length = 0;
        }

        if (!cloneSelection.selected.length) {
            cloneSelection.excluded = [];
        }

        return cloneSelection;
    }

    selectAll(selection: ISelection, limit?: number): ISelection {
        const selectedParent = Utils.getSelectedParent({
            selection,
            collection: this._model.getSourceDataStrategy(),
            rootKey: this._rootKey,
            itemKey: this._rootKey,
            selectAncestors: this._selectAncestors,
            selectDescendants: this._selectDescendants,
            keyProperty: this._model.getKeyProperty(),
            nodeProperty: this._model.getNodeProperty(),
            parentProperty: this._model.getParentProperty(),
            hasChildrenProperty: this._model.getHasChildrenProperty(),
            childrenProperty: this._model.getChildrenProperty(),
        });
        // Если этот узел и так уже выбран из-за того что выбран родитель, то не нужно его добавлять в selection
        if (selectedParent !== undefined && selectedParent !== this._rootKey) {
            return selection;
        }

        const newSelection = this.select(selection, this._rootKey);
        if (!limit && this._isMassSelectMode) {
            this._removeChildes(newSelection, this._getRoot());
        } else if (limit) {
            // Если есть лимит, то нужно сохранять excludedKeys
            newSelection.excluded = selection.excluded;
        }

        if (!newSelection.excluded.includes(this._rootKey)) {
            newSelection.excluded = ArraySimpleValuesUtil.addSubArray(newSelection.excluded, [
                this._rootKey,
            ]);
        }

        return newSelection;
    }

    toggleAll(selection: ISelection, hasMoreData: boolean): ISelection {
        // Если выбраны все дети в узле по одному, то при инвертировании должен получиться пустой selection
        if (
            this.isAllSelected(
                selection,
                hasMoreData,
                this._model.getSourceCollection().getCount(),
                null,
                true
            )
        ) {
            return { selected: [], excluded: [] };
        }

        let cloneSelection = object.clone(selection);
        const childrenIdsInRoot = this._getAllChildrenIds(this._getRoot());

        if (this._rootChanged) {
            this._removeIdsNotFromCurrentRoot(cloneSelection, childrenIdsInRoot);
        }

        const rootExcluded = cloneSelection.excluded.includes(this._rootKey);
        const oldExcludedKeys = cloneSelection.excluded.slice();
        const oldSelectedKeys = cloneSelection.selected.slice();

        if (this._isAllSelected(selection, this._rootKey)) {
            cloneSelection = this._unselectAllInRoot(cloneSelection);

            const intersectionKeys = ArraySimpleValuesUtil.getIntersection(
                childrenIdsInRoot,
                oldExcludedKeys
            );
            intersectionKeys.forEach((key: CrudEntityKey) => {
                return (cloneSelection = this.select(cloneSelection, key));
            });
        } else {
            cloneSelection = this.selectAll(cloneSelection);

            if (hasMoreData) {
                oldSelectedKeys.forEach((key) => {
                    return (cloneSelection = this.unselect(cloneSelection, key));
                });
            }
        }

        ArraySimpleValuesUtil.addSubArray(
            cloneSelection.excluded,
            ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldSelectedKeys)
        );
        ArraySimpleValuesUtil.addSubArray(
            cloneSelection.selected,
            ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldExcludedKeys)
        );

        if (rootExcluded) {
            ArraySimpleValuesUtil.removeSubArray(cloneSelection.excluded, [this._rootKey]);
        }

        return cloneSelection;
    }

    selectRange(items: TItem[]): ISelection {
        let newSelection = { selected: [], excluded: [] };

        items.forEach((item) => {
            const isNode = this._isNode(item);
            const isBreadcrumb = item['[Controls/_baseTree/BreadcrumbsItem]'];
            if (item.SelectableItem && (isBreadcrumb || !isNode || !item.isExpanded())) {
                const itemKey = this._getKey(item);
                newSelection = this.select(newSelection, itemKey);
            }
        });

        return newSelection;
    }

    getSelectionForModel(
        selection: ISelection,
        limit?: number,
        searchMode?: boolean
    ): Map<boolean | null, TItem[]> {
        const selectedItems = new Map();
        // IE не поддерживает инициализацию конструктором
        selectedItems.set(true, []);
        selectedItems.set(false, []);
        selectedItems.set(null, []);
        let selectedItemsCountByPack = 0;

        const selectionWithEntryPath = {
            selected: this._mergeEntryPath(selection.selected),
            excluded: selection.excluded,
        };

        let doNotSelectNodes = false;
        if (searchMode) {
            let isOnlyNodesInItems = true;

            this._eachItem((item) => {
                // Скипаем элементы, которые нельзя выбрать, т.к. например группа испортит значение isOnlyNodesInItems
                if (isOnlyNodesInItems && item.SelectableItem) {
                    isOnlyNodesInItems = this._isNode(item);
                }
            });

            doNotSelectNodes =
                this._isAllSelected(selectionWithEntryPath, this._rootKey) && !isOnlyNodesInItems;
        }

        this._eachItem((item) => {
            if (!item.SelectableItem) {
                return;
            }

            let isSelected = this._getItemSelected(
                item,
                selectionWithEntryPath,
                doNotSelectNodes,
                searchMode
            );

            // Проверяем на лимит, если он уже превышен, то остальные элементы нельзя выбрать
            // считаем только элементы выбранные пачкой, отдельно выбранные элементы не должны на это влиять
            if (
                isSelected !== false &&
                limit &&
                !selectionWithEntryPath.selected.includes(this._getKey(item))
            ) {
                if (selectedItemsCountByPack >= limit) {
                    isSelected = false;
                }

                selectedItemsCountByPack++;
            }

            selectedItems.get(isSelected).push(item);
        });

        return selectedItems;
    }

    protected _eachItem(callback: EnumeratorCallback<TreeItem<Model>, EnumeratorIndex>): void {
        this._model.each(callback);
    }

    private _getItemSelected(
        item: TItem,
        selection: ISelection,
        doNotSelectNodes: boolean,
        searchMode?: boolean
    ): boolean | null {
        const key = this._getKey(item);
        const parentKey = this._getParentKey(item);
        const parent =
            parentKey === this._rootKey
                ? this._model.getRoot()
                : (this._model.getItemBySourceKey(parentKey) as unknown as TItem);
        const inSelected = selection.selected.includes(key);
        const inExcluded = selection.excluded.includes(key);

        let isSelected = false;
        if (item['[Controls/_baseTree/BreadcrumbsItem]']) {
            isSelected = this._getBreadcrumbsSelected(item, selection, searchMode);
            if (isSelected === false && !inExcluded) {
                const hasSelectedChild = Utils.hasSelectedChildren({
                    selection,
                    collection: this._model.getSourceDataStrategy(),
                    rootKey: this._rootKey,
                    itemKey: this._getKey(item),
                    selectAncestors: this._selectAncestors,
                    selectDescendants: this._selectDescendants,
                    keyProperty: this._model.getKeyProperty(),
                    nodeProperty: this._model.getNodeProperty(),
                    parentProperty: this._model.getParentProperty(),
                    hasChildrenProperty: this._model.getHasChildrenProperty(),
                    childrenProperty: this._model.getChildrenProperty(),
                });
                if (hasSelectedChild) {
                    isSelected = null;
                }
            }
        } else if (parent && parent['[Controls/_baseTree/BreadcrumbsItem]'] && !inSelected) {
            const parentIsSelected = this._getBreadcrumbsSelected(parent, selection, searchMode);
            isSelected = parentIsSelected !== false && !inExcluded;
        } else {
            const isNode = this._isNode(item);
            if (!this._selectAncestors && !this._selectDescendants) {
                // В этом случае мы вообще не смотри на узлы,
                // т.к. выбранность элемента не зависит от выбора родительского узла
                // или выбранность узла не зависит от его детей
                isSelected =
                    this._canBeSelected(item, false) &&
                    !inExcluded &&
                    (inSelected || this._isAllSelectedInRoot(selection));
            } else {
                const hasSelectedParent = Utils.isSelectedByParent({
                    selection,
                    collection: this._model.getSourceDataStrategy(),
                    rootKey: this._rootKey,
                    itemKey: key,
                    selectAncestors: this._selectAncestors,
                    selectDescendants: this._selectDescendants,
                    keyProperty: this._model.getKeyProperty(),
                    nodeProperty: this._model.getNodeProperty(),
                    parentProperty: this._model.getParentProperty(),
                    hasChildrenProperty: this._model.getHasChildrenProperty(),
                    childrenProperty: this._model.getChildrenProperty(),
                });
                const isAllSelected = this._isAllSelectedInRoot(selection);
                isSelected =
                    this._canBeSelected(item, false) &&
                    !inExcluded &&
                    (inSelected ||
                        (hasSelectedParent && (this._selectDescendants || isAllSelected)));

                if ((this._selectAncestors || searchMode) && isNode) {
                    isSelected = this._getStateNode(item, isSelected, selection, searchMode);
                }
            }

            // При selectionType=leaf нельзя выбранным узлам всегда задавать selected=null,
            // т.к. очень многие рисуют узлы без экспандеров, то есть выглядят они как листья
            // и чекбокс ожидается как у листа. Но экспандер в теории можно скрыть вообще на ItemTemplate
            if (isSelected && isNode && doNotSelectNodes) {
                isSelected = null;
            }
        }

        return isSelected;
    }

    private _getParentKey(item: TItem): CrudEntityKey {
        const parentProperty = this._model.getParentProperty();
        let contents = item.getContents();
        if (contents.length) {
            contents = contents[0];
        }
        return contents instanceof Model ? contents.get(parentProperty) : contents[parentProperty];
    }

    private _getBreadcrumbsSelected(
        item: BreadcrumbsItem,
        selection: ISelection,
        searchMode?: boolean
    ): boolean | null {
        const keys = (item.getContents() as unknown as Model[]).map((it) => {
            return it.getKey();
        });
        // разворачиваем ключи в обратном порядке, т.к. элементы с конца имеют больше приоритет в плане выбранности
        // т.к. если выбрать вложенную папку, то не зависимо от выбранности родителей она будет выбрана
        const reversedKeys = keys.reverse();
        const excludedKeyIndex = reversedKeys.findIndex((key) => {
            return selection.excluded.includes(key);
        });
        const selectedKeyIndex = reversedKeys.findIndex((key) => {
            return selection.selected.includes(key);
        });

        // крошка выбрана, если нет исключенных элементов
        // или выбранный элемент находится ближе к концу крошки(глубже по иерархии) чем исключенный
        const hasSelected = selectedKeyIndex !== -1;
        const hasExcluded = excludedKeyIndex !== -1;
        const isAllChildrenExcluded = this._isAllChildrenExcluded(
            selection,
            item as unknown as TItem
        );
        const isSelectedLastCrumb = selectedKeyIndex === 0; // 0 - revers array

        let isSelected;
        if (this._isAllSelectedInRoot(selection)) {
            // Если нажали выбрать все, то выбирается все что найдено, то есть сама хлебная крошка не выбрана
            isSelected = !hasExcluded && !isAllChildrenExcluded ? null : false;
        } else {
            isSelected = hasSelected && (!hasExcluded || selectedKeyIndex < excludedKeyIndex);

            // Хлебная крошка [1, 2, 3]. Хлебная крошка идентифицируется ключом 3.
            // Если хлебная крошка выбрана благодаря отметке 2, то это значит,
            // что хлебная крошка была выбрана еще в виде узла.
            // Считаем ее частично выбранной, т.к. большинство записей узла 2 могут быть вообще не загружены.
            if (isSelected && (!isSelectedLastCrumb || isAllChildrenExcluded)) {
                isSelected = null;
            }

            if (
                hasSelected &&
                hasExcluded &&
                selectedKeyIndex === excludedKeyIndex &&
                isSelectedLastCrumb &&
                searchMode &&
                this._isNewSearchSelectionBehavior()
            ) {
                isSelected = null;
            }
        }
        return isSelected;
    }

    isAllSelected(
        selection: ISelection,
        hasMoreData: boolean,
        itemsCount: number,
        limit: number,
        byEveryItem: boolean = true,
        rootKey?: CrudEntityKey
    ): boolean {
        let isAllSelected;

        if (limit) {
            isAllSelected =
                this._isAllSelectedInRoot(selection, rootKey) &&
                limit >= itemsCount &&
                !hasMoreData;
        } else if (byEveryItem) {
            // считаем кол-во выбранных только среди загруженных элементов, т.к. allSelected считаем под опцией byEveryItem
            const selectionForModel = this.getSelectionForModel(selection, limit);
            const selectedCount =
                selectionForModel.get(true).length + selectionForModel.get(null).length;

            isAllSelected =
                (!hasMoreData && itemsCount > 0 && itemsCount === selectedCount) ||
                (this._isAllSelectedInRoot(selection, rootKey) && selection.excluded.length === 1);
        } else {
            isAllSelected = this._isAllSelectedInRoot(selection, rootKey);
        }

        return isAllSelected;
    }

    reset(): void {
        this._rootChanged = false;
    }

    getSelectedItems(selection: ISelection, selectedItems?: TItem[]): TItem[] {
        const filterTreeItems = (item) => {
            return item['[Controls/_display/TreeItem]'];
        };
        let result = [];
        const selectionForModel = this.getSelectionForModel(selection);
        const newSelectedItems = selectionForModel.get(true).filter(filterTreeItems);
        if (selectedItems?.length) {
            const unselectedItems = selectionForModel.get(false).filter(filterTreeItems);
            const unselectedItemsKeys = unselectedItems.map((item: TItem) => {
                return item.getContents().getKey();
            });
            const filteredUnselectedItems = selectedItems.filter((selectedItem) => {
                return !unselectedItemsKeys.includes(selectedItem.getContents().getKey());
            });
            const selectedItemsKeys = filteredUnselectedItems.map((selectedItem) =>
                selectedItem.getContents().getKey()
            );
            const filteredUnselectedChildren = filteredUnselectedItems.filter((selectedItem) => {
                const parentKey = selectedItem.getRoot();
                return parentKey && !selectedItemsKeys.includes(parentKey);
            });
            result = filteredUnselectedChildren.concat(newSelectedItems);
        } else {
            result = newSelectedItems;
        }
        return result;
    }

    setMassSelect(isMassSelected: boolean): void {
        this._isMassSelectMode = isMassSelected;
    }

    private _removeIdsNotFromCurrentRoot(
        selection: ISelection,
        childrenIdsInRoot: CrudEntityKey[]
    ): void {
        selection.selected.forEach((val, i) => {
            if (!childrenIdsInRoot.includes(val)) {
                selection.selected.splice(i, 1);
            }
        });

        selection.excluded.forEach((val, i) => {
            if (!childrenIdsInRoot.includes(val)) {
                selection.excluded.splice(i, 1);
            }
        });
    }

    private _unselectParentNodes(selection: ISelection, item: TItem, searchMode?: boolean): void {
        let allChildrenExcluded = this._isAllChildrenExcluded(selection, item);
        let currentParent = item;
        while (
            currentParent &&
            allChildrenExcluded &&
            !item['[Controls/_baseTree/BreadcrumbsItem]']
        ) {
            this._unselectNode(selection, currentParent, searchMode);
            currentParent = currentParent.getParent() as TItem;
            allChildrenExcluded = this._isAllChildrenExcluded(selection, currentParent);
        }
    }

    private _isAllSelectedInRoot(
        selection: ISelection,
        rootKey: CrudEntityKey = this._rootKey
    ): boolean {
        return selection.selected.includes(rootKey) && selection.excluded.includes(rootKey);
    }

    private _unselectAllInRoot(selection: ISelection): ISelection {
        const rootInExcluded = selection.excluded.includes(this._rootKey);

        let resSelection = selection;
        resSelection = this.unselect(resSelection, this._rootKey);
        this._removeChildes(resSelection, this._getRoot());

        if (rootInExcluded) {
            resSelection.excluded = ArraySimpleValuesUtil.removeSubArray(resSelection.excluded, [
                this._rootKey,
            ]);
        }

        return resSelection;
    }

    private _isAllSelected(selection: ISelection, nodeId: CrudEntityKey): boolean {
        return Utils.isAllSelected({
            selection,
            collection: this._model.getSourceDataStrategy(),
            rootKey: nodeId,
            selectAncestors: this._selectAncestors,
            selectDescendants: this._selectDescendants,
            keyProperty: this._model.getKeyProperty(),
            nodeProperty: this._model.getNodeProperty(),
            parentProperty: this._model.getParentProperty(),
            hasChildrenProperty: this._model.getHasChildrenProperty(),
            childrenProperty: this._model.getChildrenProperty(),
            byEveryItem: false,
        });
    }

    private _selectNode(selection: ISelection, node: TItem, searchMode?: boolean): void {
        const nodeKey = this._getKey(node);
        this._selectLeaf(selection, nodeKey, this._getKey(node.getParent() as TItem));

        if (
            selection.selected.includes(nodeKey) &&
            searchMode &&
            this._isNewSearchSelectionBehavior()
        ) {
            ArraySimpleValuesUtil.addSubArray(selection.excluded, [nodeKey]);
        }

        if (this._selectDescendants) {
            this._removeChildes(selection, node);
        }
    }

    private _unselectNode(selection: ISelection, node: TItem, searchMode?: boolean): void {
        this._unselectLeaf(selection, node);
        // если сняли выбор с узла, то нужно убрать его из ENTRY_PATH
        const nodeKey = this._getKey(node);
        const entryPathHasNode =
            this._entryPath &&
            this._entryPath.find((it) => {
                return it.id === nodeKey;
            });
        if (!selection.selected.includes(nodeKey) && entryPathHasNode) {
            this._clearEntryPath([nodeKey]);
        }
        // снять выбор с детей мы можем в любом случае, независимо от selectDescendants и selectAncestors,
        // т.к. по клику по закрашенному чекбоксу это нужно делать
        this._removeChildes(selection, node);
        if (searchMode && this._isNewSearchSelectionBehavior()) {
            const itemId = this._getKey(node);
            ArraySimpleValuesUtil.removeSubArray(selection.excluded, [itemId]);
        }
    }

    private _selectLeaf(
        selection: ISelection,
        leafKey: CrudEntityKey,
        parentKey: CrudEntityKey
    ): void {
        const isAllSelected = this._isAllSelectedInRoot(selection, parentKey);
        if (selection.excluded.includes(leafKey)) {
            ArraySimpleValuesUtil.removeSubArray(selection.excluded, [leafKey]);
        } else if (!isAllSelected) {
            ArraySimpleValuesUtil.addSubArray(selection.selected, [leafKey]);
        }
    }

    private _unselectLeaf(selection: ISelection, item: TItem): void {
        const parent = item.getParent() as TItem;
        const parentId = this._getKey(parent);
        const itemId = this._getKey(item);
        const itemInSelected = selection.selected.includes(itemId);
        const isSelectedParent = Utils.isSelectedByParent({
            selection,
            collection: this._model.getSourceDataStrategy(),
            rootKey: this._rootKey,
            itemKey: itemId,
            selectAncestors: this._selectAncestors,
            selectDescendants: this._selectDescendants,
            keyProperty: this._model.getKeyProperty(),
            nodeProperty: this._model.getNodeProperty(),
            parentProperty: this._model.getParentProperty(),
            hasChildrenProperty: this._model.getHasChildrenProperty(),
            childrenProperty: this._model.getChildrenProperty(),
        });

        if (itemInSelected) {
            ArraySimpleValuesUtil.removeSubArray(selection.selected, [itemId]);
        }

        // если родитель выбран, то ребенка нужно положить в excluded, чтобы он не был выбран
        if ((!itemInSelected && isSelectedParent) || this._isAllSelected(selection, parentId)) {
            ArraySimpleValuesUtil.addSubArray(selection.excluded, [itemId]);
        }

        if (
            this._isAllChildrenExcluded(selection, parent) &&
            this._selectAncestors &&
            parentId !== this._rootKey &&
            !parent['[Controls/_baseTree/BreadcrumbsItem]']
        ) {
            ArraySimpleValuesUtil.addSubArray(selection.excluded, [parentId]);
            ArraySimpleValuesUtil.removeSubArray(selection.selected, [parentId]);
        }

        if (item['[Controls/_baseTree/BreadcrumbsItem]']) {
            this._unselectBreadcrumb(selection, item as unknown as BreadcrumbsItem, itemInSelected);
        }
    }

    private _unselectBreadcrumb(
        selection: ISelection,
        breadcrumb: BreadcrumbsItem,
        breadcrumbWasInSelected: boolean
    ): void {
        const breadcrumbKey = this._getKey(breadcrumb as unknown as TItem);
        if (selection.selected.includes(breadcrumbKey)) {
            ArraySimpleValuesUtil.removeSubArray(selection.selected, [breadcrumbKey]);
        } else if (!breadcrumbWasInSelected) {
            ArraySimpleValuesUtil.addSubArray(selection.excluded, [breadcrumbKey]);
        }
    }

    private _mergeEntryPath(selectedKeys: TKeys): TKeys {
        const selectedKeysWithEntryPath: TKeys = selectedKeys.slice();

        if (this._entryPath) {
            // entryPath это путь от выбранных узлов до текущих элементов. У нас в списке этих узлов нет, поэтому считаем,
            // что эти узлы выбраны, чтобы выбрались все их дети
            this._entryPath.forEach((it) => {
                // Если один из родителей в entry_path точно выбран (лежит в selectedKeys), то и его дети точно выбраны
                const parentIsSelected = this._parentFromEntryPathIsSelected(it.id, selectedKeys);
                if (parentIsSelected) {
                    selectedKeysWithEntryPath.push(it.id);
                }
            });
        }

        return selectedKeysWithEntryPath;
    }

    /**
     * Возвращает true, если один из родителей в ENTRY_PATH выбран, иначе false
     * @param key
     * @param selectedKeys
     * @private
     */
    private _parentFromEntryPathIsSelected(
        key: CrudEntityKey,
        selectedKeys: CrudEntityKey[]
    ): boolean {
        const entryPath = this._entryPath.find((it) => {
            return it.id === key;
        });
        if (entryPath) {
            const parentKey = entryPath.parent;
            if (selectedKeys.includes(parentKey)) {
                return true;
            } else {
                return this._parentFromEntryPathIsSelected(parentKey, selectedKeys);
            }
        }

        return false;
    }

    private _clearEntryPath(ids: CrudEntityKey[]): void {
        if (this._entryPath) {
            ids.forEach((childId) => {
                const entryIndex = this._entryPath.findIndex((entryPath) => {
                    return entryPath.id === childId;
                });
                if (entryIndex !== -1) {
                    this._entryPath.splice(entryIndex, 1);
                }
            });
        }
    }

    private _getStateNode(
        node: TItem,
        initialState: boolean,
        selection: ISelection,
        searchMode?: boolean
    ): boolean | null {
        const children = node.getChildren(false);
        const listKeys = initialState ? selection.excluded : selection.selected;
        let countChildrenInList: boolean | number | null = 0;
        let isAllChildIsSelectedByOne = true;
        let isAllChildIsExcludedByOne = true;

        for (let index = 0; index < children.getCount(); index++) {
            const child = children.at(index) as TItem;
            const childId = this._getKey(child);
            const childInList = listKeys.includes(childId);
            const childIsNode = this._isNode(child);
            let childIsSelected = selection.selected.includes(childId);
            let childIsExcluded = selection.excluded.includes(childId);

            if (childIsNode) {
                childIsSelected = this._getStateNode(
                    child,
                    childInList ? !initialState : initialState,
                    selection,
                    searchMode
                );
                childIsExcluded = childIsSelected === false;
            }

            if (childInList || (childIsNode && childIsSelected !== initialState)) {
                countChildrenInList++;
            }

            isAllChildIsSelectedByOne = isAllChildIsSelectedByOne && childIsSelected;
            isAllChildIsExcludedByOne = isAllChildIsExcludedByOne && childIsExcluded;
        }

        return this._correctNodeState(
            node,
            initialState,
            selection,
            countChildrenInList,
            isAllChildIsSelectedByOne,
            isAllChildIsExcludedByOne,
            searchMode
        );
    }

    // Сонар не пропускает метод _getStateNode из-за сложности.
    // Его надо полностью переписывать, но это достаточно сложная задача.
    // Поэтому пока что просто разнес код на 2 метода.
    private _correctNodeState(
        node: TItem,
        initialState: boolean,
        selection: ISelection,
        countChildrenInList: number,
        isAllChildIsSelectedByOne: boolean,
        isAllChildIsExcludedByOne: boolean,
        searchMode?: boolean
    ): boolean | null {
        if (countChildrenInList > 0) {
            const hasMore =
                node['[Controls/_display/TreeItem]'] &&
                (node.hasMoreStorage('forward') || node.hasMoreStorage('backward'));
            return !hasMore && isAllChildIsSelectedByOne
                ? true
                : isAllChildIsExcludedByOne
                ? false
                : null;
        }

        const nodeKey = this._getKey(node);
        const hasEntryPath = this._entryPath && this._entryPath.length;
        const nodeIsPartialSelected =
            selection.selected.includes(nodeKey) && selection.excluded.includes(nodeKey);
        if (
            (hasEntryPath && this._childFromEntryPathIsSelected(nodeKey, selection.selected)) ||
            nodeIsPartialSelected ||
            (searchMode && initialState && this._isNewSearchSelectionBehavior())
        ) {
            return null;
        }

        return initialState;
    }

    /**
     * Возвращает true, если один из детей в ENTRY_PATH выбран, иначе false
     * @param parentKey
     * @param selectedKeys
     * @private
     */
    private _childFromEntryPathIsSelected(
        parentKey: CrudEntityKey,
        selectedKeys: CrudEntityKey[]
    ): boolean {
        const entryPath = this._entryPath.find((it) => {
            return it.parent === parentKey;
        });
        if (entryPath) {
            const childKey = entryPath.id;
            if (selectedKeys.includes(childKey)) {
                return true;
            } else {
                return this._childFromEntryPathIsSelected(childKey, selectedKeys);
            }
        }

        return false;
    }

    /**
     * Проверяем, что все дети данного узла находятся в excluded
     * @param selection
     * @param node
     * @private
     */
    protected _isAllChildrenExcluded(selection: ISelection, node: TItem): boolean {
        if (!node) {
            return false;
        }

        const childes = node.getChildren(false);
        const nodeKey = this._getKey(node);
        const nodeIsExcluded =
            selection.excluded.includes(nodeKey) && !selection.selected.includes(nodeKey);

        let result: boolean = !!childes.getCount();

        const hasMore =
            !!node['[Controls/_display/TreeItem]'] &&
            (node.hasMoreStorage('forward') || node.hasMoreStorage('backward'));
        if (childes.getCount() && !hasMore) {
            for (let i = 0; i < childes.getCount(); i++) {
                const child = childes.at(i) as TItem;
                const childId = this._getKey(child);

                // Если ребенок не выбран, то на его детей точно не нужно смотреть
                // ps В исключенном узле может быть выбрана запись
                const childIsExcluded =
                    selection.excluded.includes(childId) ||
                    (nodeIsExcluded && !selection.selected.includes(childId));
                result = result && childIsExcluded;
                if (this._isNode(child)) {
                    result = result && this._isAllChildrenExcluded(selection, child);
                }

                if (!result) {
                    break;
                }
            }
        } else {
            result = node['[Controls/_display/TreeItem]'] ? !hasMore : false;
        }

        return result;
    }

    private _getAllChildren(node: TItem): TItem[] {
        const childes = [];

        node.getChildren(false).each((child: TItem) => {
            if (this._canBeSelected(child)) {
                ArraySimpleValuesUtil.addSubArray(childes, [child]);
            }

            if (this._isNode(child)) {
                ArraySimpleValuesUtil.addSubArray(childes, this._getAllChildren(child));
            }
        });

        return childes;
    }

    /**
     * Возвращает всех детей данного узла из ENTRY_PATH, включая детей детей узла
     * @param parentId
     * @private
     */
    private _getRecursiveChildesInEntryPath(parentId: CrudEntityKey): TKeys {
        let childrenIds = [];

        const childesFromEntryPath = this._entryPath
            .filter((item) => {
                return item.parent === parentId;
            })
            .map((item) => {
                return item.id;
            });

        childrenIds = childrenIds.concat(childesFromEntryPath);
        childesFromEntryPath.forEach((childKey) => {
            childrenIds = childrenIds.concat(this._getRecursiveChildesInEntryPath(childKey));
        });

        return childrenIds;
    }

    /**
     * Возвращает ключи всех детей, включая детей из ENTRY_PATH
     * @param node
     * @private
     */
    private _getAllChildrenIds(node: TItem): TKeys {
        let childrenIds = this._getAllChildren(node).map((child) => {
            return this._getKey(child);
        });

        if (this._entryPath) {
            const nodeId = this._getKey(node);
            childrenIds = childrenIds.concat(this._getRecursiveChildesInEntryPath(nodeId));
        }

        return childrenIds;
    }

    private _removeChildes(selection: ISelection, node: TItem): void {
        const childrenIds = this._getAllChildrenIds(node);
        ArraySimpleValuesUtil.removeSubArray(selection.selected, childrenIds);
        ArraySimpleValuesUtil.removeSubArray(selection.excluded, childrenIds);

        // нужно из entryPath удалить ключи удаленных записей, иначе мы будем считать что запись выбрана по entryPath
        // пересчитывать entryPath никто не будет, т.к. это нужно отправлять запрос на бл на каждый клик по чекбоксу
        this._clearEntryPath(childrenIds);
    }

    /**
     * Проверяет что элемент узел или скрытый узел
     * @param item
     * @private
     */
    private _isNode(item: TItem): boolean {
        if (item && item['[Controls/_display/TreeItem]']) {
            return item.isNode() !== LEAF;
        } else if (item && item['[Controls/_baseTree/BreadcrumbsItem]']) {
            return true;
        }
        return false;
    }

    /**
     * @private
     * TODO нужно выпилить этот метод при переписывании моделей. item.getContents() должен возвращать Record
     *  https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
     */
    protected _getKey(item: TItem): CrudEntityKey {
        if (!item) {
            return undefined;
        }

        let contents = item.getContents();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (item['[Controls/_baseTree/BreadcrumbsItem]'] || item.breadCrumbs) {
            // eslint-disable-next-line
            contents = contents[(contents as any).length - 1];
        }

        // Для GroupItem нет ключа, в contents хранится не Model
        if (item['[Controls/_display/GroupItem]']) {
            return undefined;
        }

        // у корневого элемента contents=key
        return contents instanceof Object ? contents.getKey() : contents;
    }

    private _getItem(key: CrudEntityKey): TItem {
        if (key === this._rootKey) {
            return this._getRoot();
        } else {
            return this._model.getItemBySourceKey(key) as TItem;
        }
    }

    private _getRoot(): TItem {
        // В этом кейсе нам точно нужно вернуть корень списка, его нельзя получить с помощью getItemBySourceKey
        // НО getItemBySourceKey может вернуть скрытую группу, т.к. у нее ключ тоже null
        if (this._rootKey === null) {
            return this._model.getRoot() as TItem;
        }

        // getRoot возвращает самый верхний узел и его нельзя получить с помощью getItemBySourceKey
        return (this._model.getItemBySourceKey(this._rootKey) || this._model.getRoot()) as TItem;
    }

    /**
     * Проверяет можно ли сделать переданный итем выбранным.
     * @param {TItem} item - проверяемый итем
     * @param {Boolean} [readonlyCheck = true] - нужно ли проверять итем на признак readonly его чекбокса
     */
    private _canBeSelected(item: TItem, readonlyCheck: boolean = true): boolean {
        const isAddedByEditInPlace = item && item.isAdd;
        const itemKey = this._getKey(item);
        const sourceItem = this._model.getSourceDataStrategy().getSourceItemByKey(itemKey);
        return (
            Utils.canBeSelected(
                {
                    item: sourceItem,
                    rootKey: this._rootKey,
                    selectionType: this._selectionType,
                    recursiveSelection: this._recursiveSelection,
                    nodeProperty: this._model.getNodeProperty(),
                    multiSelectAccessibilityProperty:
                        this._model.getMultiSelectAccessibilityProperty(),
                },
                readonlyCheck
            ) && !isAddedByEditInPlace
        );
    }

    private _validateOptions(options: ITreeSelectionStrategyOptions): void {
        if (options.selectionCountMode === 'leaf') {
            if (options.selectionType === 'node' && options.recursiveSelection === false) {
                throw Error(
                    'Не правильно заданы опции множественного выбора. Запрещено выбирать листья, но нужно их считать. ' +
                        'Обратить внимание на опции: selectionCountMode, selectionType, recursiveSelection'
                );
            }
        }
        if (options.selectionCountMode === 'node' && options.selectionType === 'leaf') {
            throw Error(
                'Не правильно заданы опции множественного выбора. Запрещено выбирать узлы, но нужно их считать. ' +
                    'Обратите внимание на опции: selectionCountMode, selectionType'
            );
        }
    }

    private _isNewSearchSelectionBehavior(): boolean {
        return this._feature1188089336;
    }
}
