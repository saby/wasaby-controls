import type { BreadcrumbsItem, TreeItem } from 'Controls/baseTree';
import type { CrudEntityKey } from 'Types/source';
import type { TKeySelection } from 'Controls/interface';
import {
    ISelectionStrategy,
    TSelectionModel,
    TSelectionModelStatus,
    Utils as BaseUtils,
} from 'Controls/abstractSelectionAspect';
import {
    copyHierarchySelectionState as clearCopyHierarchySelectionState,
    IHierarchySelectionState,
} from './IHierarchySelectionState';
import * as TreeUtils from './Utils';
import { Model } from 'Types/entity';
import { IRootState, copyRootState } from 'Controls/rootListAspect';
import type { IFlatSelectionState } from 'Controls/flatSelectionAspect';
import { EnumeratorCallback, EnumeratorIndex } from 'Types/collection';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

const LEAF = null;
const TREE_ITEM = '[Controls/_display/TreeItem]';
const BREADCRUMBS = '[Controls/_baseTree/BreadcrumbsItem]';

export const DEFAULT_SELECTION_TYPE = 'all';

function copyHierarchySelectionState(
    state: IHierarchySelectionState
): IHierarchySelectionState & IRootState {
    return {
        ...copyRootState(state),
        ...clearCopyHierarchySelectionState(state),
    };
}

export class HierarchySelectionStrategy implements ISelectionStrategy<IHierarchySelectionState> {
    private readonly _isNewSearchSelectionBehavior: boolean;

    constructor(isNewSearchSelectionBehavior: boolean = false) {
        this._isNewSearchSelectionBehavior = isNewSearchSelectionBehavior;
    }

    select(
        state: IHierarchySelectionState,
        key: CrudEntityKey,
        searchMode?: boolean
    ): IHierarchySelectionState {
        return clearCopyHierarchySelectionState(this._select(state, key, searchMode));
    }

    unselect(
        state: IHierarchySelectionState,
        key: CrudEntityKey,
        searchMode?: boolean
    ): IHierarchySelectionState {
        return clearCopyHierarchySelectionState(this._unselect(state, key, searchMode));
    }

    selectAll(state: IHierarchySelectionState, limit?: number): IHierarchySelectionState {
        return clearCopyHierarchySelectionState(this._selectAll(state, limit));
    }

    unselectAll(state: IHierarchySelectionState, filter?: object): IHierarchySelectionState {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Коллекция сломана
        return clearCopyHierarchySelectionState({
            ...state,
            ...BaseUtils.unselectAll(state, filter),
        });
    }

    selectRange(state: IHierarchySelectionState, items: TreeItem[]): IHierarchySelectionState {
        let nextState = copyHierarchySelectionState({
            ...state,
            selectedKeys: [],
            excludedKeys: [],
        });

        items.forEach((item) => {
            const isNode = HierarchySelectionStrategy.isNode(item);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const isBreadcrumb = item[BREADCRUMBS];
            if (item.SelectableItem && (isBreadcrumb || !isNode || !item.isExpanded())) {
                const itemKey = this._getKey(item);
                nextState = this._select(nextState, itemKey, undefined, false);
            }
        });

        nextState.selectionModel = this._getSelectionModel(nextState);

        return clearCopyHierarchySelectionState(nextState);
    }

    toggleAll(
        state: IHierarchySelectionState,
        hasMoreData: boolean,
        rootChanged: boolean
    ): IHierarchySelectionState {
        let nextState = copyHierarchySelectionState(state);

        // Если выбраны все дети в узле по одному, то при инвертировании должен получиться пустой selection
        if (
            this.isAllSelected(
                nextState,
                hasMoreData,
                nextState.collection.getSourceCollection().getCount(),
                null,
                true
            )
        ) {
            nextState.selectedKeys = [];
            nextState.excludedKeys = [];
            return nextState;
        }

        const childrenIdsInRoot = this._getAllChildrenIds(
            nextState,
            HierarchySelectionStrategy.getRoot(nextState)
        );

        if (rootChanged) {
            this._removeIdsNotFromCurrentRootOnState(nextState, childrenIdsInRoot);
        }

        const rootExcluded = nextState.excludedKeys.includes(state.root);
        const oldExcludedKeys = nextState.excludedKeys.slice();
        const oldSelectedKeys = nextState.selectedKeys.slice();

        // Тут старый стейт нужен, проверяем как БЫЛО
        if (this._isAllSelected(state, state.root)) {
            nextState = this._unselectAllInRoot(nextState);

            const intersectionKeys = ArraySimpleValuesUtil.getIntersection(
                childrenIdsInRoot,
                oldExcludedKeys
            );
            intersectionKeys.forEach((key: CrudEntityKey) => {
                return (nextState = this.select(nextState, key));
            });
        } else {
            nextState = this._selectAll(nextState, undefined);

            if (hasMoreData || !nextState.isMassSelectMode) {
                oldSelectedKeys.forEach((key) => {
                    return (nextState = this._unselect(nextState, key, undefined));
                });
            }
        }

        ArraySimpleValuesUtil.addSubArray(
            nextState.excludedKeys,
            ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldSelectedKeys)
        );
        ArraySimpleValuesUtil.addSubArray(
            nextState.selectedKeys,
            ArraySimpleValuesUtil.getIntersection(childrenIdsInRoot, oldExcludedKeys)
        );

        if (rootExcluded) {
            ArraySimpleValuesUtil.removeSubArray(nextState.excludedKeys, [nextState.root]);
        }

        return clearCopyHierarchySelectionState(nextState);
    }

    isAllSelected(
        state: IHierarchySelectionState,
        hasMoreData: boolean,
        itemsCount: number,
        limit: number,
        byEveryItem: boolean = true,
        rootKey?: CrudEntityKey
    ): boolean {
        let isAllSelected;

        if (limit) {
            isAllSelected =
                this._isAllSelectedInRoot(state, rootKey) && limit >= itemsCount && !hasMoreData;
        } else if (byEveryItem) {
            // считаем кол-во выбранных только среди загруженных элементов, т.к. allSelected считаем под опцией byEveryItem
            const selectionForModel = this.getSelectionModel(state, limit);
            let selectedCount = 0;
            [...selectionForModel.values()].forEach((v) => {
                if (v || v === null) {
                    selectedCount++;
                }
            });

            isAllSelected =
                (!hasMoreData && itemsCount > 0 && itemsCount === selectedCount) ||
                (this._isAllSelectedInRoot(state, rootKey) && state.excludedKeys.length === 1);
        } else {
            isAllSelected = this._isAllSelectedInRoot(state, rootKey);
        }

        return isAllSelected;
    }

    getSelectionModel(
        state: IHierarchySelectionState,
        limit?: number,
        searchMode?: boolean
    ): TSelectionModel {
        return this._getSelectionModel(state, limit, searchMode);
    }

    protected _eachItem(
        collection: IFlatSelectionState['collection'],
        callback: EnumeratorCallback<TreeItem<Model>, EnumeratorIndex>
    ): void {
        collection.each(callback);
    }

    private _getSelectionModel(
        state: IHierarchySelectionState,
        limit?: number,
        searchMode?: boolean
    ): TSelectionModel {
        const selectionModel: TSelectionModel = new Map();
        let selectedItemsCountByPack = 0;

        const stateWithSelectedEntryPath = copyHierarchySelectionState({
            ...state,
            selectedKeys: this._getSelectedKeysEntryPath(
                state.entryPath,
                state.selectAncestors,
                state.selectedKeys,
                state.excludedKeys
            ),
        });

        let doNotSelectNodes = false;
        if (searchMode) {
            let isOnlyNodesInItems = true;

            this._eachItem(state.collection, (item) => {
                // Скипаем элементы, которые нельзя выбрать, т.к. например группа испортит значение isOnlyNodesInItems
                if (isOnlyNodesInItems && item.SelectableItem) {
                    isOnlyNodesInItems = HierarchySelectionStrategy.isNode(item);
                }
            });

            doNotSelectNodes =
                this._isAllSelected(stateWithSelectedEntryPath, state.root) && !isOnlyNodesInItems;
        }

        this._eachItem(state.collection, (item) => {
            if (!item.SelectableItem) {
                return;
            }

            let isSelected = this._getItemSelectionModelStatus(
                stateWithSelectedEntryPath,
                item,
                doNotSelectNodes,
                searchMode
            );

            // Проверяем на лимит, если он уже превышен, то остальные элементы нельзя выбрать
            // считаем только элементы выбранные пачкой, отдельно выбранные элементы не должны на это влиять
            const itemKey = this._getKey(item);
            if (
                isSelected !== false &&
                limit &&
                typeof itemKey !== 'undefined' &&
                !stateWithSelectedEntryPath.selectedKeys.includes(itemKey)
            ) {
                if (selectedItemsCountByPack >= limit) {
                    isSelected = false;
                }

                selectedItemsCountByPack++;
            }

            selectionModel.set(itemKey, isSelected);
        });

        return selectionModel;
    }

    private _select(
        state: IHierarchySelectionState,
        key: CrudEntityKey,
        searchMode?: boolean,
        updateMap: boolean = true
    ): IHierarchySelectionState {
        const nextState = copyHierarchySelectionState(state);
        const item = this._getItem(nextState, key);

        // Если не найден item, то считаем что он не загружен и будет работать соответствующая логика
        if (item && !this._canBeSelected(nextState, item)) {
            return nextState;
        }

        if (item && HierarchySelectionStrategy.isNode(item)) {
            if (nextState.isMassSelectMode === false) {
                this._selectAllChildrenOnState(nextState, item, searchMode);
            } else {
                this._selectNodeOnState(nextState, item, searchMode);
            }
        } else {
            const parentKey = this._getKey(item?.getParent());
            if (typeof parentKey !== 'undefined') {
                this._selectLeafOnState(nextState, key, parentKey);
            }
        }

        if (updateMap) {
            nextState.selectionModel = this._getSelectionModel(nextState);
        }

        return nextState;
    }

    private _unselect(
        state: IHierarchySelectionState,
        key: CrudEntityKey,
        searchMode?: boolean
    ): IHierarchySelectionState {
        const nextState = copyHierarchySelectionState(state);
        const item = this._getItem(nextState, key);

        // Если не найден item, то считаем что он не загружен и будет работать соответствующая логика
        if (item && !this._canBeSelected(nextState, item)) {
            return nextState;
        }

        if (!item) {
            ArraySimpleValuesUtil.removeSubArray(nextState.selectedKeys, [key]);
            if (this._isAllSelectedInRoot(nextState)) {
                ArraySimpleValuesUtil.addSubArray(nextState.excludedKeys, [key]);
            }
        } else if (HierarchySelectionStrategy.isNode(item)) {
            this._unselectNodeOnState(nextState, item, searchMode);
        } else {
            this._unselectLeafOnState(nextState, item);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (key !== nextState.root && item && nextState.selectAncestors && !item[BREADCRUMBS]) {
            this._unselectParentNodesOnState(nextState, item.getParent(), searchMode);
        }
        if (
            searchMode &&
            this._isAllSelectedInRoot(nextState) &&
            this._isAllChildrenExcluded(nextState, HierarchySelectionStrategy.getRoot(nextState))
        ) {
            nextState.selectedKeys.length = 0;
            nextState.excludedKeys.length = 0;
        }

        if (!nextState.selectedKeys.length) {
            nextState.excludedKeys = [];
        }

        nextState.selectionModel = this._getSelectionModel(nextState);

        return nextState;
    }

    private _selectAll(state: IHierarchySelectionState, limit?: number): IHierarchySelectionState {
        let nextState = copyHierarchySelectionState(state);

        const selectedParent = TreeUtils.getSelectedParent({
            selection: {
                selected: nextState.selectedKeys,
                excluded: nextState.excludedKeys,
                recursive: nextState.recursiveSelection,
            },
            collection: nextState.collection.getSourceDataStrategy(),
            rootKey: nextState.root,
            itemKey: nextState.root,
            selectAncestors: !!nextState.selectAncestors,
            selectDescendants: !!nextState.selectDescendants,
            keyProperty: nextState.keyProperty,
            nodeProperty: nextState.nodeProperty,
            parentProperty: nextState.parentProperty,
            hasChildrenProperty: nextState.collection.getHasChildrenProperty(),
            childrenProperty: nextState.collection.getChildrenProperty(),
        });
        // Если этот узел и так уже выбран из-за того что выбран родитель, то не нужно его добавлять в selection
        if (selectedParent !== undefined && selectedParent !== nextState.root) {
            return nextState;
        }

        nextState = this._select(nextState, nextState.root);

        if (!limit && nextState.isMassSelectMode) {
            this._removeChildrenOnState(nextState, HierarchySelectionStrategy.getRoot(nextState));
        } else if (limit) {
            // Если есть лимит, то нужно сохранять excludedKeys
            nextState.excludedKeys = state.excludedKeys;
        }

        if (!nextState.excludedKeys.includes(nextState.root) && nextState.isMassSelectMode) {
            ArraySimpleValuesUtil.addSubArray(nextState.excludedKeys, [nextState.root]);
        }

        return nextState;
    }

    private _getItem(state: IHierarchySelectionState, key: CrudEntityKey): TreeItem {
        if (key === state.root) {
            return HierarchySelectionStrategy.getRoot(state);
        } else {
            return state.collection.getItemBySourceKey(key);
        }
    }

    private static getRoot(state: IHierarchySelectionState): TreeItem {
        // В этом кейсе нам точно нужно вернуть корень списка, его нельзя получить с помощью getItemBySourceKey
        // НО getItemBySourceKey может вернуть скрытую группу, т.к. у нее ключ тоже null
        if (state.root === null) {
            return state.collection.getRoot();
        }

        // getRoot возвращает самый верхний узел и его нельзя получить с помощью getItemBySourceKey
        const rootItem =
            typeof state.root !== 'undefined' && state.collection.getItemBySourceKey(state.root);
        return rootItem || state.collection.getRoot();
    }

    private _canBeSelected(
        state: IHierarchySelectionState,
        item: TreeItem,
        readonlyCheck: boolean = true
    ): boolean {
        const isAddedByEditInPlace = item && item.isAdd;
        const itemKey = this._getKey(item);
        const sourceItem = state.collection.getSourceDataStrategy().getSourceItemByKey(itemKey);
        return (
            TreeUtils.canBeSelected(
                {
                    item: sourceItem,
                    rootKey: state.root,
                    selectionType: state.selectionType || DEFAULT_SELECTION_TYPE,
                    recursiveSelection: !!state.recursiveSelection,
                    nodeProperty: state.nodeProperty,
                    multiSelectAccessibilityProperty: state.multiSelectAccessibilityProperty,
                },
                readonlyCheck
            ) && !isAddedByEditInPlace
        );
    }

    protected _getKey(item: unknown): CrudEntityKey | undefined {
        return BaseUtils.getKey(item);
    }

    static isNode(item: TreeItem): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (item && item[TREE_ITEM]) {
            return item.isNode() !== LEAF;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        } else if (item && item[BREADCRUMBS]) {
            return true;
        }
        return false;
    }

    private _selectAllChildrenOnState(
        state: IHierarchySelectionState,
        item: TreeItem,
        searchMode?: boolean
    ): void {
        const children = this._getAllChildrenIds(state, item);
        if (children.length) {
            children.forEach((childKey) => {
                const childItem = this._getItem(state, childKey);
                if (childItem && HierarchySelectionStrategy.isNode(childItem)) {
                    this._selectAllChildrenOnState(state, childItem, searchMode);
                } else {
                    const itemKey = this._getKey(item);
                    if (typeof itemKey !== 'undefined') {
                        this._selectLeafOnState(state, childKey, itemKey);
                    }
                }
            });
        } else {
            this._selectNodeOnState(state, item, searchMode);
        }
    }

    private _getAllChildrenIds(state: IHierarchySelectionState, node: TreeItem): CrudEntityKey[] {
        const _getAllChildren = (fromRoot: TreeItem): TreeItem[] => {
            const childrenArray: TreeItem[] = [];

            fromRoot.getChildren(false).each((child) => {
                if (this._canBeSelected(state, child)) {
                    ArraySimpleValuesUtil.addSubArray(childrenArray, [child]);
                }

                if (HierarchySelectionStrategy.isNode(child)) {
                    ArraySimpleValuesUtil.addSubArray(childrenArray, _getAllChildren(child));
                }
            });

            return childrenArray;
        };

        const _getRecursiveChildesInEntryPath = (parentId: CrudEntityKey): CrudEntityKey[] => {
            let childrenArray: CrudEntityKey[] = [];

            const childesFromEntryPath = (state as Required<IHierarchySelectionState>).entryPath
                .filter((item) => {
                    return item.parent === parentId;
                })
                .map((item) => {
                    return item.id;
                });

            childrenArray = childrenArray.concat(childesFromEntryPath);
            childesFromEntryPath.forEach((childKey) => {
                childrenArray = childrenArray.concat(_getRecursiveChildesInEntryPath(childKey));
            });

            return childrenArray;
        };

        let childrenIds: CrudEntityKey[] = [];

        _getAllChildren(node).map((i) => {
            const key = this._getKey(i);
            if (typeof key !== 'undefined') {
                childrenIds.push(key);
            }
        });

        if (state.entryPath && state.isMassSelectMode) {
            const nodeId = this._getKey(node);
            if (typeof nodeId !== 'undefined') {
                childrenIds = childrenIds.concat(_getRecursiveChildesInEntryPath(nodeId));
            }
        }

        return childrenIds;
    }

    private _selectNodeOnState(
        state: IHierarchySelectionState,
        node: TreeItem,
        searchMode?: boolean
    ): void {
        const nodeKey = this._getKey(node);
        const nodeParentKey = this._getKey(node.getParent());
        this._selectLeafOnState(state, nodeKey, nodeParentKey);

        if (
            typeof nodeKey !== 'undefined' &&
            state.selectedKeys.includes(nodeKey) &&
            searchMode &&
            this._isNewSearchSelectionBehavior
        ) {
            ArraySimpleValuesUtil.addSubArray(state.excludedKeys, [nodeKey]);
        }

        if (state.selectDescendants) {
            this._removeChildrenOnState(state, node);
        }
    }

    private _selectLeafOnState(
        state: IHierarchySelectionState,
        leafKey: CrudEntityKey,
        parentKey: CrudEntityKey
    ): void {
        const isAllSelected = this._isAllSelectedInRoot(state, parentKey);
        if (state.excludedKeys.includes(leafKey)) {
            ArraySimpleValuesUtil.removeSubArray(state.excludedKeys, [leafKey]);
        } else if (!isAllSelected) {
            ArraySimpleValuesUtil.addSubArray(state.selectedKeys, [leafKey]);
        }
    }

    private _isAllSelectedInRoot(
        state: IHierarchySelectionState,
        rootKey: TKeySelection = state.root || null
    ): boolean {
        return state.selectedKeys.includes(rootKey) && state.excludedKeys.includes(rootKey);
    }

    private _removeChildrenOnState(state: IHierarchySelectionState, node: TreeItem): void {
        const childrenIds = this._getAllChildrenIds(state, node);
        ArraySimpleValuesUtil.removeSubArray(state.selectedKeys, childrenIds);
        ArraySimpleValuesUtil.removeSubArray(state.excludedKeys, childrenIds);

        // нужно из entryPath удалить ключи удаленных записей, иначе мы будем считать что запись выбрана по entryPath
        // пересчитывать entryPath никто не будет, т.к. это нужно отправлять запрос на бл на каждый клик по чекбоксу
        this._clearEntryPathOnState(state, childrenIds);
    }

    private _clearEntryPathOnState(state: IHierarchySelectionState, ids: CrudEntityKey[]): void {
        const path = state.entryPath;
        if (path) {
            ids.forEach((childId) => {
                const entryIndex = path.findIndex((entryPath) => {
                    return entryPath.id === childId;
                });
                if (entryIndex !== -1) {
                    path.splice(entryIndex, 1);
                }
            });
        }
    }

    private _getSelectedKeysEntryPath(
        entryPath: IHierarchySelectionState['entryPath'],
        selectAncestors: IHierarchySelectionState['selectAncestors'],
        selectedKeys: IHierarchySelectionState['selectedKeys'],
        excludedKeys: IHierarchySelectionState['excludedKeys']
    ): IHierarchySelectionState['selectedKeys'] {
        const selectedKeysWithEntryPath: IHierarchySelectionState['selectedKeys'] =
            selectedKeys.slice();

        if (entryPath) {
            // entryPath это путь от выбранных узлов до текущих элементов. У нас в списке этих узлов нет, поэтому считаем,
            // что эти узлы выбраны, чтобы выбрались все их дети
            entryPath.forEach((it) => {
                // Если один из родителей в entry_path точно выбран (лежит в selectedKeys), то и его дети точно выбраны
                const parentIsSelected = this._isParentFromEntryPathIsSelected(
                    entryPath,
                    it.id,
                    selectedKeys
                );
                if (parentIsSelected && !selectedKeysWithEntryPath.includes(it.id)) {
                    // При selectAncestors = false если запись присутствует в excluded, то не нужно её выбирать
                    // https://online.sbis.ru/opendoc.html?guid=1b86b74f-0151-4745-8527-716aa7ec63a4&client=3
                    if (selectAncestors || !excludedKeys.includes(it.id)) {
                        selectedKeysWithEntryPath.push(it.id);
                    }
                }
            });
        }

        return selectedKeysWithEntryPath;
    }

    private _isParentFromEntryPathIsSelected(
        entryPath: Required<IHierarchySelectionState>['entryPath'],
        key: CrudEntityKey,
        selectedKeys: IHierarchySelectionState['selectedKeys']
    ): boolean {
        const entryPathItem = entryPath.find((item) => {
            return item.id === key;
        });
        if (entryPathItem) {
            const parentKey = entryPathItem.parent;
            if (selectedKeys.includes(parentKey)) {
                return true;
            } else {
                return this._isParentFromEntryPathIsSelected(entryPath, parentKey, selectedKeys);
            }
        }

        return false;
    }

    private _isChildFromEntryPathIsSelected(
        entryPath: Required<IHierarchySelectionState>['entryPath'],
        parentKey: CrudEntityKey,
        selectedKeys: CrudEntityKey[]
    ): boolean {
        const entryPathItem = entryPath.find((it) => {
            return it.parent === parentKey;
        });
        if (entryPathItem) {
            const childKey = entryPathItem.id;
            if (selectedKeys.includes(childKey)) {
                return true;
            } else {
                return this._isChildFromEntryPathIsSelected(entryPath, childKey, selectedKeys);
            }
        }

        return false;
    }

    private _getItemSelectionModelStatus(
        state: IHierarchySelectionState,
        item: TreeItem,
        doNotSelectNodes: boolean,
        searchMode?: boolean
    ): TSelectionModelStatus {
        const key = this._getKey(item);

        const _getParentKey = (i: TreeItem): CrudEntityKey => {
            const parentProperty = state.collection.getParentProperty();
            let iContents = i.getContents();
            if (iContents.length) {
                iContents = iContents[0];
            }
            if (!iContents) {
                return i.getParent().key;
            }
            return iContents instanceof Model
                ? iContents.get(parentProperty)
                : iContents[parentProperty];
        };

        const parentKey = _getParentKey(item);
        const parent =
            parentKey === state.root
                ? state.collection.getRoot()
                : state.collection.getItemBySourceKey(parentKey);

        const inSelected = typeof key === 'undefined' ? false : state.selectedKeys.includes(key);
        const inExcluded = typeof key === 'undefined' ? false : state.excludedKeys.includes(key);

        let isSelected: TSelectionModelStatus = false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (item[BREADCRUMBS]) {
            isSelected = this._getBreadcrumbsSelectionModelStatus(
                state,
                item as unknown as BreadcrumbsItem,
                searchMode
            );
            if (isSelected === false && !inExcluded) {
                const hasSelectedChild = TreeUtils.hasSelectedChildren({
                    selection: {
                        selected: state.selectedKeys,
                        excluded: state.excludedKeys,
                        recursive: state.recursiveSelection,
                    },
                    collection: state.collection.getSourceDataStrategy(),
                    rootKey: state.root,
                    itemKey: this._getKey(item),
                    selectAncestors: !!state.selectAncestors,
                    selectDescendants: !!state.selectDescendants,
                    keyProperty: state.keyProperty,
                    nodeProperty: state.nodeProperty,
                    parentProperty: state.parentProperty,
                    hasChildrenProperty: state.collection.getHasChildrenProperty(),
                    childrenProperty: state.collection.getChildrenProperty(),
                });
                if (hasSelectedChild) {
                    isSelected = null;
                }
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        } else if (parent && parent[BREADCRUMBS] && !inSelected) {
            const parentIsSelected = this._getBreadcrumbsSelectionModelStatus(
                state,
                parent as unknown as BreadcrumbsItem,
                searchMode
            );
            isSelected = parentIsSelected !== false && !inExcluded;
        } else {
            const isNode = HierarchySelectionStrategy.isNode(item);
            if (!state.selectAncestors && !state.selectDescendants) {
                // В этом случае мы вообще не смотри на узлы,
                // т.к. выбранность элемента не зависит от выбора родительского узла
                // или выбранность узла не зависит от его детей
                isSelected =
                    this._canBeSelected(state, item, false) &&
                    !inExcluded &&
                    (inSelected || this._isAllSelectedInRoot(state));
            } else {
                const hasSelectedParent = HierarchySelectionStrategy.isSelectedByParent(state, key);
                const isAllSelected = this._isAllSelectedInRoot(state);
                isSelected =
                    this._canBeSelected(state, item, false) &&
                    !inExcluded &&
                    (inSelected ||
                        (hasSelectedParent && (state.selectDescendants || isAllSelected)));

                if ((state.selectAncestors || searchMode) && isNode) {
                    isSelected = this._getStateNode(state, item, isSelected, searchMode);
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

    static isSelectedByParent(state: IHierarchySelectionState, itemKey: CrudEntityKey): boolean {
        return TreeUtils.isSelectedByParent({
            selection: {
                selected: state.selectedKeys,
                excluded: state.excludedKeys,
                recursive: state.recursiveSelection,
            },
            itemKey,
            collection: state.collection.getSourceDataStrategy(),
            rootKey: state.root,
            selectAncestors: !!state.selectAncestors,
            selectDescendants: !!state.selectDescendants,
            keyProperty: state.keyProperty,
            nodeProperty: state.nodeProperty,
            parentProperty: state.parentProperty,
            hasChildrenProperty: state.collection.getHasChildrenProperty(),
            childrenProperty: state.collection.getChildrenProperty(),
        });
    }

    private _isAllSelected(state: IHierarchySelectionState, nodeId: CrudEntityKey): boolean {
        return TreeUtils.isAllSelected({
            selection: {
                selected: state.selectedKeys,
                excluded: state.excludedKeys,
                recursive: state.recursiveSelection,
            },
            collection: state.collection.getSourceDataStrategy(),
            rootKey: nodeId,
            selectAncestors: !!state.selectAncestors,
            selectDescendants: !!state.selectDescendants,
            keyProperty: state.keyProperty,
            nodeProperty: state.nodeProperty,
            parentProperty: state.parentProperty,
            hasChildrenProperty: state.collection.getHasChildrenProperty(),
            childrenProperty: state.collection.getChildrenProperty(),
            byEveryItem: false,
        });
    }

    private _getStateNode(
        state: IHierarchySelectionState,
        node: TreeItem,
        initialState: boolean,
        searchMode?: boolean
    ): TSelectionModelStatus {
        const children = node.getChildren(false);
        const listKeys = initialState ? state.excludedKeys : state.selectedKeys;
        let countChildrenInList: boolean | number | null = 0;
        let isAllChildIsSelectedByOne: TSelectionModelStatus = true;
        let isAllChildIsExcludedByOne: TSelectionModelStatus = true;

        for (let index = 0; index < children.getCount(); index++) {
            const child = children.at(index);
            const childId = this._getKey(child);
            const childInList = listKeys.includes(childId);
            const childIsNode = HierarchySelectionStrategy.isNode(child);
            let childIsSelected: TSelectionModelStatus = state.selectedKeys.includes(childId);
            let childIsExcluded: TSelectionModelStatus = state.excludedKeys.includes(childId);

            if (childIsNode) {
                childIsSelected = this._getStateNode(
                    state,
                    child,
                    childInList ? !initialState : initialState,
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
            state,
            node,
            initialState,
            countChildrenInList,
            isAllChildIsSelectedByOne,
            isAllChildIsExcludedByOne,
            state.entryPath,
            searchMode
        );
    }

    private _correctNodeState(
        state: IHierarchySelectionState,
        node: TreeItem,
        initialState: boolean,
        countChildrenInList: number,
        isAllChildIsSelectedByOne: TSelectionModelStatus,
        isAllChildIsExcludedByOne: TSelectionModelStatus,
        entryPath: IHierarchySelectionState['entryPath'],
        searchMode?: boolean
    ): TSelectionModelStatus {
        if (countChildrenInList > 0) {
            const hasMore =
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                node[TREE_ITEM] &&
                (node.hasMoreStorage('forward') || node.hasMoreStorage('backward'));
            return !hasMore && isAllChildIsSelectedByOne
                ? true
                : isAllChildIsExcludedByOne
                ? false
                : null;
        }

        const nodeKey = this._getKey(node);
        const hasEntryPath = entryPath && entryPath.length;
        const nodeIsPartialSelected =
            state.selectedKeys.includes(nodeKey) && state.excludedKeys.includes(nodeKey);

        if (
            (hasEntryPath &&
                this._isChildFromEntryPathIsSelected(entryPath, nodeKey, state.selectedKeys)) ||
            nodeIsPartialSelected ||
            (searchMode && initialState && this._isNewSearchSelectionBehavior)
        ) {
            return null;
        }

        return initialState;
    }

    private _getBreadcrumbsSelectionModelStatus(
        state: IHierarchySelectionState,
        item: BreadcrumbsItem,
        searchMode?: boolean
    ): TSelectionModelStatus {
        const keys = (item.getContents() as unknown as (Model | null)[]).map((it) => {
            return it === null ? it : it.getKey();
        });
        // разворачиваем ключи в обратном порядке, т.к. элементы с конца имеют больше приоритет в плане выбранности
        // т.к. если выбрать вложенную папку, то не зависимо от выбранности родителей она будет выбрана
        const reversedKeys = keys.reverse();
        const excludedKeyIndex = reversedKeys.findIndex((key) => {
            return state.excludedKeys.includes(key);
        });
        const selectedKeyIndex = reversedKeys.findIndex((key) => {
            return state.selectedKeys.includes(key);
        });

        // крошка выбрана, если нет исключенных элементов
        // или выбранный элемент находится ближе к концу крошки(глубже по иерархии) чем исключенный
        const hasSelected = selectedKeyIndex !== -1;
        const hasExcluded = excludedKeyIndex !== -1;
        const isAllChildrenExcluded = this._isAllChildrenExcluded(
            state,
            item as unknown as TreeItem
        );
        const isSelectedLastCrumb = selectedKeyIndex === 0; // 0 - revers array

        let isSelected;
        if (this._isAllSelectedInRoot(state)) {
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
                this._isNewSearchSelectionBehavior
            ) {
                isSelected = null;
            }
        }
        return isSelected;
    }

    protected _isAllChildrenExcluded(state: IHierarchySelectionState, node: TreeItem): boolean {
        if (!node) {
            return false;
        }

        const childes = node.getChildren(false);
        const nodeKey = this._getKey(node);
        const nodeIsExcluded =
            state.excludedKeys.includes(nodeKey) && !state.selectedKeys.includes(nodeKey);

        let result: boolean = !!childes.getCount();

        const hasMore =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            !!node[TREE_ITEM] &&
            (node.hasMoreStorage('forward') || node.hasMoreStorage('backward'));
        if (childes.getCount() && !hasMore) {
            for (let i = 0; i < childes.getCount(); i++) {
                const child = childes.at(i) as TreeItem;
                const childId = this._getKey(child);

                // Если ребенок не выбран, то на его детей точно не нужно смотреть
                // ps В исключенном узле может быть выбрана запись
                const childIsExcluded =
                    state.excludedKeys.includes(childId) ||
                    (nodeIsExcluded && !state.selectedKeys.includes(childId));
                result = result && childIsExcluded;
                if (HierarchySelectionStrategy.isNode(child)) {
                    result = result && this._isAllChildrenExcluded(state, child);
                }

                if (!result) {
                    break;
                }
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            result = node[TREE_ITEM] ? !hasMore : false;
        }

        return result;
    }

    private _unselectNodeOnState(
        state: IHierarchySelectionState,
        node: TreeItem,
        searchMode?: boolean
    ): void {
        this._unselectLeafOnState(state, node);
        // если сняли выбор с узла, то нужно убрать его из ENTRY_PATH
        const nodeKey = this._getKey(node);
        const entryPathHasNode =
            state.entryPath &&
            state.entryPath.find((it) => {
                return it.id === nodeKey;
            });
        if (!state.selectedKeys.includes(nodeKey) && entryPathHasNode) {
            this._clearEntryPathOnState(state, [nodeKey]);
        }
        // снять выбор с детей мы можем в любом случае, независимо от selectDescendants и selectAncestors,
        // т.к. по клику по закрашенному чекбоксу это нужно делать
        this._removeChildrenOnState(state, node);
        if (searchMode && this._isNewSearchSelectionBehavior) {
            const itemId = this._getKey(node);
            ArraySimpleValuesUtil.removeSubArray(state.excludedKeys, [itemId]);
        }
    }

    private _unselectLeafOnState(state: IHierarchySelectionState, item: TreeItem): void {
        const parent = item.getParent();
        const parentId = this._getKey(parent);
        const itemId = this._getKey(item);
        const itemInSelected = state.selectedKeys.includes(itemId);
        const isSelectedParent = HierarchySelectionStrategy.isSelectedByParent(state, itemId);

        if (itemInSelected) {
            ArraySimpleValuesUtil.removeSubArray(state.selectedKeys, [itemId]);
        }

        // если родитель выбран, то ребенка нужно положить в excluded, чтобы он не был выбран
        if ((!itemInSelected && isSelectedParent) || this._isAllSelected(state, parentId)) {
            ArraySimpleValuesUtil.addSubArray(state.excludedKeys, [itemId]);
        }

        if (
            this._isAllChildrenExcluded(state, parent) &&
            state.selectAncestors &&
            parentId !== state.root &&
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            !parent[BREADCRUMBS]
        ) {
            ArraySimpleValuesUtil.addSubArray(state.excludedKeys, [parentId]);
            ArraySimpleValuesUtil.removeSubArray(state.selectedKeys, [parentId]);
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (item[BREADCRUMBS]) {
            this._unselectBreadcrumbOnState(
                state,
                item as unknown as BreadcrumbsItem,
                itemInSelected
            );
        }
    }

    private _unselectBreadcrumbOnState(
        state: IHierarchySelectionState,
        breadcrumb: BreadcrumbsItem,
        breadcrumbWasInSelected: boolean
    ): void {
        const breadcrumbKey = this._getKey(breadcrumb);
        if (state.selectedKeys.includes(breadcrumbKey)) {
            ArraySimpleValuesUtil.removeSubArray(state.selectedKeys, [breadcrumbKey]);
        } else if (!breadcrumbWasInSelected) {
            ArraySimpleValuesUtil.addSubArray(state.excludedKeys, [breadcrumbKey]);
        }
    }

    private _unselectParentNodesOnState(
        state: IHierarchySelectionState,
        item: TreeItem,
        searchMode?: boolean
    ): void {
        let allChildrenExcluded = this._isAllChildrenExcluded(state, item);
        let currentParent = item;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        while (currentParent && allChildrenExcluded && !item[BREADCRUMBS]) {
            this._unselectNodeOnState(state, currentParent, searchMode);
            currentParent = currentParent.getParent();
            allChildrenExcluded = this._isAllChildrenExcluded(state, currentParent);
        }
    }

    private _removeIdsNotFromCurrentRootOnState(
        state: IHierarchySelectionState,
        childrenIdsInRoot: CrudEntityKey[]
    ): void {
        state.selectedKeys.forEach((val, i) => {
            if (!childrenIdsInRoot.includes(val)) {
                state.selectedKeys.splice(i, 1);
            }
        });

        state.excludedKeys.forEach((val, i) => {
            if (!childrenIdsInRoot.includes(val)) {
                state.excludedKeys.splice(i, 1);
            }
        });
    }

    private _unselectAllInRoot(state: IHierarchySelectionState): IHierarchySelectionState {
        const rootInExcluded = state.excludedKeys.includes(state.root);

        const nextState = this._unselect(state, state.root);
        this._removeChildrenOnState(nextState, HierarchySelectionStrategy.getRoot(state));

        if (rootInExcluded) {
            ArraySimpleValuesUtil.removeSubArray(nextState.excludedKeys, [state.root]);
        }

        return nextState;
    }
}
