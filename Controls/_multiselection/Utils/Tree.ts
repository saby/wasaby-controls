/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { Logger } from 'UICommon/Utils';
import { CrudEntityKey } from 'Types/source';
import { Model, relation } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { factory } from 'Types/chain';
import { object } from 'Types/util';

import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import {
    TSelectionCountMode,
    ISelectionObject as ISelection,
} from 'Controls/interface';
import {
    MultiSelectAccessibility,
    ISourceDataStrategy,
} from 'Controls/display';

import {
    IFlatGetCountParams,
    IHasMoreUtil,
} from 'Controls/_multiselection/Utils/Flat';
import { TKeys } from 'Controls/_multiselection/interface';
import {
    ALL_SELECTION_VALUE,
    ICanBeSelectedParams as IFlatCanBeSelectedParams,
} from './Flat';

const NODE = true;
const HIDDEN_NODE = false;
export type ISelectionType = 'node' | 'leaf' | 'all' | 'allBySelectAction';

export type IIsLoadedUtil = (nodeKey: CrudEntityKey) => boolean;

export interface ITreeGetCountParams
    extends IFlatGetCountParams,
        ICollectionParams {
    rootKey: CrudEntityKey;
    selectionCountMode: TSelectionCountMode;
    selectionType: ISelectionType;
    recursiveSelection: boolean;
    selectDescendants: boolean;
    selectAncestors: boolean;
    isLoadedUtil: IIsLoadedUtil;
    isSearchViewMode?: boolean;
}

export interface IIsAllSelectedParams extends ICollectionParams {
    selection: ISelection;
    rootKey: CrudEntityKey;
    selectDescendants: boolean;
    selectAncestors: boolean;
    byEveryItem?: boolean;
}

export interface IHasSelectedParentParams extends IGetParentParams {
    selection: ISelection;
}

export interface IHasSelectedChildParams extends IGetParentParams {
    selection: ISelection;
}

export interface IGetParentParams extends ICollectionParams {
    itemKey: CrudEntityKey;
    rootKey: CrudEntityKey;
    selectDescendants: boolean;
    selectAncestors: boolean;
}

export interface ICanBeSelectedParams
    extends IFlatCanBeSelectedParams,
        IIsNodeParams {
    rootKey: CrudEntityKey;
    selectionType: ISelectionType;
    recursiveSelection: boolean;
}

interface ICollectionParams {
    collection: ISourceDataStrategy;
    keyProperty: string;
    nodeProperty: string;
    parentProperty?: string;
    hasChildrenProperty?: string;
    childrenProperty?: string;
}

interface IItemFunctionParams extends ICollectionParams {
    itemKey: CrudEntityKey;
}

export function getCount(params: ITreeGetCountParams): number | null {
    const {
        limit,
        hasMoreUtil,
        isLoadedUtil,
        selectDescendants,
        selectAncestors,
        collection,
        filter,
    } = params;
    const rootKey = null;
    const hasMoreData = hasMoreUtil(rootKey);

    if (limit) {
        const countItems = collection.getCount();
        return !hasMoreData && limit > countItems ? countItems : limit;
    }

    let countItemsSelected: number | null = 0;
    let selectedNodes: TKeys = [];

    const selection = object.clone(params.selection);
    if (!params.isSearchViewMode && selectDescendants && selectAncestors) {
        // Если выбраны все дети какого либа узла, то заменяем ключи детей на ключ узла.
        // Это нужно, чтобы выбранный узел посчитался тоже.
        // Делать это при выборе записей нельзя, т.к. не во всех кейсах выбор детей значит, что узел выбран.
        // Например, если выбрали всех детей и нажали переместить, то ожидается что переместятся только дети.
        // Если пользователь хочет переместить узел со всеми детьми, то будет выбран сразу узел.
        selection.selected.forEach((selectedItemKey) => {
            const item = collection.getSourceItemByKey(selectedItemKey);
            // Элемента может не быть в рекордсете. Например, корневой или незагруженный элемент.
            if (!item) {
                return;
            }
            const parentKey = item.get(params.parentProperty);
            const parent = collection.getSourceItemByKey(parentKey);
            if (
                parentKey !== params.rootKey &&
                canBeCounted({ ...params, itemKey: parentKey, item: parent }) &&
                isAllSelected({
                    ...params,
                    rootKey: parentKey,
                    byEveryItem: true,
                })
            ) {
                const children = getChildren({ ...params, nodeKey: parentKey });
                const childrenKeys = children.map((it: Model) => {
                    return it.getKey();
                });
                ArraySimpleValuesUtil.removeSubArray(
                    selection.selected,
                    childrenKeys
                );
                ArraySimpleValuesUtil.addSubArray(selection.selected, [
                    parentKey,
                ]);
            }
        });
    }

    if (!isAllSelected({ ...params, selection }) || (!hasMoreData && !filter)) {
        if (selectDescendants) {
            for (let index = 0; index < selection.selected.length; index++) {
                const itemKey = selection.selected[index];
                const item = collection.getSourceItemByKey(itemKey);
                const isNodeValue = isNode({ ...params, item });
                const isExcluded = selection.excluded.includes(itemKey);
                if (isNodeValue) {
                    selectedNodes.push(itemKey);
                }

                const canBeCountedValue = canBeCounted({
                    ...params,
                    item,
                    itemKey,
                });
                if (
                    canBeCountedValue &&
                    !isExcluded &&
                    (!isNodeValue ||
                        !hasExcludedChild({ ...params, selection, itemKey }))
                ) {
                    countItemsSelected++;
                }
            }
        } else {
            selectedNodes = ArraySimpleValuesUtil.getIntersection(
                selection.selected,
                selection.excluded
            ) as TKeys;
            countItemsSelected =
                selection.selected.length - selectedNodes.length;
        }

        for (let index = 0; index < selectedNodes.length; index++) {
            const nodeKey = selectedNodes[index];
            let countItemsSelectedInNode;
            if (hasMoreUtil(nodeKey) || !isLoadedUtil(nodeKey)) {
                countItemsSelectedInNode = null;
            } else {
                const node = collection.getSourceItemByKey(nodeKey);
                countItemsSelectedInNode = getSelectedChildrenCount({
                    ...params,
                    selection,
                    item: node,
                    itemKey: nodeKey,
                });
            }

            if (countItemsSelectedInNode === null) {
                countItemsSelected = null;
                break;
            } else {
                countItemsSelected += countItemsSelectedInNode;
            }
        }
    } else if (selection.selected.length) {
        countItemsSelected = null;
    }

    return countItemsSelected;
}

export function isAllSelected(params: IIsAllSelectedParams): boolean {
    const { selectDescendants, selection, rootKey, byEveryItem, collection } =
        params;

    if (byEveryItem) {
        const children = getChildren({ ...params, nodeKey: rootKey });
        let isAllSelectedValue = true;
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as Model;
            const isSelected = isSelectedLeaf({
                selection,
                selectDescendants,
                collection,
                itemKey: child.getKey(),
                parentKey: rootKey,
                rootKey: params.rootKey,
                keyProperty: params.keyProperty,
                parentProperty: params.parentProperty,
                nodeProperty: params.nodeProperty,
                hasChildrenProperty: params.hasChildrenProperty,
                selectAncestors: params.selectAncestors,
            });
            if (!isSelected) {
                isAllSelectedValue = false;
                break;
            }
        }
        return isAllSelectedValue;
    }

    if (selectDescendants) {
        const root = params.collection.getSourceItemByKey(rootKey);
        const hasSelectedParentValue = !!root
            ? isSelectedByParent({ ...params, itemKey: rootKey })
            : false;
        return (
            selection.selected.includes(rootKey) ||
            (!selection.excluded.includes(rootKey) && hasSelectedParentValue)
        );
    }

    return (
        selection.selected.includes(rootKey) &&
        selection.excluded.includes(rootKey)
    );
}

export function isSelectedByParent(params: IHasSelectedParentParams): boolean {
    const selectedParentData = getParentIncludedInArray({
        ...params,
        array: params.selection.selected,
    });
    const excludedParentData = getParentIncludedInArray({
        ...params,
        array: params.selection.excluded,
    });

    if (!selectedParentData) {
        return false;
    }

    if (!excludedParentData || !params.selectDescendants) {
        return true;
    }

    return selectedParentData.level <= excludedParentData.level;
}

export function hasSelectedParent(params: IHasSelectedParentParams): boolean {
    return getSelectedParent(params) !== undefined;
}

export function hasSelectedChildren(params: IHasSelectedChildParams): boolean {
    const children = getChildren({ ...params, nodeKey: params.itemKey });
    return children.some((child) => {
        return params.selection.selected.includes(child.getKey());
    });
}

export function getSelectedParent(
    params: IHasSelectedParentParams
): CrudEntityKey | undefined {
    const result = getParentIncludedInArray({
        ...params,
        array: params.selection.selected,
    });
    return result ? result.parentKey : undefined;
}

/**
 * Возвращает первого родителя, которого найдет в переданном массиве
 * @param params
 */
export function getParentIncludedInArray(
    params: IHasSelectedParentParams & { array: CrudEntityKey[] }
): { parentKey: CrudEntityKey; level: number } {
    let hasParent: boolean = false;
    let level: number = 0;
    let currentParentKey = params.itemKey;

    const findSelectedParent = (items: ISourceDataStrategy | RecordSet) => {
        const isRecordSet = items instanceof RecordSet;
        const getSourceItem = (key: CrudEntityKey) => {
            return isRecordSet
                ? (items as RecordSet).getRecordById(key)
                : (items as ISourceDataStrategy).getSourceItemByKey(key);
        };
        do {
            const item = getSourceItem(currentParentKey);
            // значит мы дошли до самого корня
            if (!item) {
                break;
            }

            currentParentKey = item.get(params.parentProperty);
            level++;

            if (params.array.includes(currentParentKey)) {
                hasParent = true;
                break;
            }
        } while (currentParentKey !== params.rootKey);
    };

    findSelectedParent(params.collection);

    if (!hasParent && params.selection.selected.includes(ALL_SELECTION_VALUE)) {
        hasParent = true;
        currentParentKey = ALL_SELECTION_VALUE;
    }

    const pathUp = params.collection.getMetaData().path as RecordSet;
    if (!hasParent && pathUp && pathUp['[Types/_collection/RecordSet]']) {
        findSelectedParent(pathUp);
    }

    return hasParent ? { parentKey: currentParentKey, level } : undefined;
}

export function canBeSelected(
    params: ICanBeSelectedParams,
    readonlyCheck: boolean = true
): boolean {
    // Если нет элемента, то скорее всего он не загружен. Считаем что его можно выбрать, точно сказать это не можем.
    if (!params.item) {
        return true;
    }

    let multiSelectAccessibility = params.item.get(
        params.multiSelectAccessibilityProperty
    );
    if (multiSelectAccessibility === undefined) {
        multiSelectAccessibility = MultiSelectAccessibility.enabled;
    }
    // Проверяем доступность чекбокса итема. В некоторых случаях нужно учитывать признак readonly
    // а в некоторых нет. Поэтому опционально проверяем доступность чекбокса.
    const choiceIsAvailable = readonlyCheck
        ? multiSelectAccessibility === MultiSelectAccessibility.enabled
        : multiSelectAccessibility !== MultiSelectAccessibility.hidden;

    let canBeSelectedBySelectionType = false;

    const isNodeValue = isNode({ ...params });
    const itemIsRoot = params.item.getKey() === params.rootKey;
    switch (params.selectionType) {
        case 'all':
        // allBySelectAction используется в lookupPopup и приходит к нам через scope, расцениваем ее как all
        case 'allBySelectAction':
            canBeSelectedBySelectionType = true;
            break;
        case 'leaf':
            canBeSelectedBySelectionType =
                !isNodeValue ||
                (params.recursiveSelection && isNodeValue) ||
                itemIsRoot;
            break;
        case 'node':
            canBeSelectedBySelectionType = isNodeValue;
            break;
    }

    return canBeSelectedBySelectionType && choiceIsAvailable;
}

interface IGetChildrenParams extends ICollectionParams {
    nodeKey: CrudEntityKey;
}

export function getChildren(params: IGetChildrenParams): Model[] {
    if (!params.childrenProperty) {
        const hierarchyRelation = new relation.Hierarchy({
            keyProperty: params.keyProperty,
            parentProperty: params.parentProperty,
            nodeProperty: params.nodeProperty,
            declaredChildrenProperty: params.hasChildrenProperty,
        });
        return hierarchyRelation.getChildren(
            params.nodeKey,
            params.collection.getSourceCollection()
        ) as Model[];
    }

    const node = params.collection.getSourceItemByKey(params.nodeKey);
    const children = node.get(params.childrenProperty);
    return children ? factory<Model>(children).toArray() : [];
}

// region Private

export interface ICanBeCountedParams extends ICanBeSelectedParams {
    itemKey: CrudEntityKey;
    selectionCountMode: TSelectionCountMode;
}

function canBeCounted(params: ICanBeCountedParams): boolean {
    const itemIsRoot = params.itemKey === params.rootKey;
    if (itemIsRoot) {
        return false;
    }

    // считаем все не подгруженные записи, т.к. мы не знаем их тип
    if (!params.item) {
        return true;
    }

    if (!canBeSelected(params)) {
        return false;
    }

    const isNodeValue = isNode({ ...params });
    switch (params.selectionCountMode) {
        case 'leaf':
            return !isNodeValue;
        case 'node':
            return isNodeValue;
        case 'all':
        default:
            return true;
    }
}

export interface IGetSelectedChildrenCountParams
    extends ICanBeCountedParams,
        ICollectionParams {
    itemKey: CrudEntityKey;
    selection: ISelection;
    hasMoreUtil: IHasMoreUtil;
    isLoadedUtil: IIsLoadedUtil;
    selectDescendants: boolean;
    selectAncestors: boolean;
}

function getSelectedChildrenCount(
    params: IGetSelectedChildrenCountParams
): number | null {
    const itemIsRoot = params.itemKey === params.rootKey;
    if (!params.item && !itemIsRoot) {
        // Если узла нет, это значит что он не загружен, соответственно мы не можем посчитать кол-во выбранных детей
        return null;
    }

    const children = getChildren({ ...params, nodeKey: params.itemKey });

    let selectedChildrenCount = 0;

    if (children.length) {
        children.forEach((childItem) => {
            if (selectedChildrenCount !== null) {
                const childKey = childItem.getKey();
                const childIsNode = isNode({ ...params, item: childItem });
                const childInSelected =
                    params.selection.selected.includes(childKey);
                const childInExcluded =
                    params.selection.excluded.includes(childKey);

                const canBeCountedValue =
                    !childInExcluded &&
                    canBeCounted({
                        ...params,
                        item: childItem,
                        itemKey: childKey,
                    });
                const allowCountBySelected =
                    !childIsNode ||
                    isSelectedNode({ ...params, itemKey: childKey });
                // не считаем записи в selected, т.к. они будут посчитаны в вызывающем методе
                if (
                    !childInSelected &&
                    canBeCountedValue &&
                    allowCountBySelected
                ) {
                    selectedChildrenCount++;
                }

                if (
                    childIsNode &&
                    (!params.selectDescendants || !childInExcluded)
                ) {
                    const nextChildSelectedCount = getSelectedChildrenCount({
                        ...params,
                        item: childItem,
                        itemKey: childKey,
                    });
                    selectedChildrenCount =
                        nextChildSelectedCount === null
                            ? null
                            : selectedChildrenCount + nextChildSelectedCount;
                }
            }
        });
    } else if (hasChildren(params)) {
        selectedChildrenCount = null;
    }

    return selectedChildrenCount;
}

interface IIsSelectedNodeParams extends IItemFunctionParams {
    selection: ISelection;
    selectDescendants: boolean;
    selectAncestors: boolean;
    rootKey: CrudEntityKey;
}

function isSelectedNode(params: IIsSelectedNodeParams): boolean | null {
    const node = params.collection.getSourceItemByKey(params.itemKey);
    if (!isNode({ ...params, item: node })) {
        throw Error('Should pass node or hiddenNode!');
    }

    const nodeKeyInSelected = params.selection.selected.includes(
        params.itemKey
    );
    const nodeKeyInExcluded = params.selection.excluded.includes(
        params.itemKey
    );

    const isAllSelectedValue = isAllSelected(params);
    const isSelectedByParentValue =
        isAllSelectedValue ||
        (isSelectedByParent(params) && params.selectDescendants);

    const hasExcludedChildValue = hasExcludedChild(params);
    const isSelectedByChild = !params.selectAncestors || !hasExcludedChildValue;

    return (
        (nodeKeyInSelected || isSelectedByParentValue) &&
        !nodeKeyInExcluded &&
        isSelectedByChild
    );
}

interface IIsSelectedLeafParams extends IItemFunctionParams {
    selection: ISelection;
    selectDescendants: boolean;
    selectAncestors: boolean;
    parentKey: CrudEntityKey;
    rootKey: CrudEntityKey;
}

function isSelectedLeaf(params: IIsSelectedLeafParams): boolean {
    if (params.selection.selected.includes(params.itemKey)) {
        return true;
    }

    const isSelectedByParent = isSelectedNode({
        ...params,
        itemKey: params.parentKey,
    });
    if (isSelectedByParent) {
        return true;
    }

    return false;
}

interface IHasExcludedChildParams extends IItemFunctionParams {
    selection: ISelection;
}

function hasExcludedChild(params: IHasExcludedChildParams): boolean {
    const children = getChildren({ ...params, nodeKey: params.itemKey });

    return !!children.find((child) => {
        if (params.itemKey === child.getKey()) {
            Logger.error(
                `Wrong data. Hierarchy has recursion. Node='${
                    params.itemKey
                }' has child='${child.getKey()}'`
            );
            return false;
        }

        if (params.selection.excluded.includes(child.getKey())) {
            return true;
        }

        if (isNode({ ...params, item: child })) {
            return hasExcludedChild({ ...params, itemKey: child.getKey() });
        }

        return false;
    });
}

interface IIsNodeParams {
    item: Model;
    nodeProperty: string;
}

function isNode(params: IIsNodeParams): boolean {
    const nodeValue = params.item && params.item.get(params.nodeProperty);
    return !params.item || nodeValue === NODE || nodeValue === HIDDEN_NODE;
}

interface IHasChildrenParams extends IItemFunctionParams {
    hasMoreUtil: IHasMoreUtil;
    isLoadedUtil: IIsLoadedUtil;
    rootKey: CrudEntityKey;
}

function hasChildren(params: IHasChildrenParams): boolean {
    const item = params.collection.getSourceItemByKey(params.itemKey);
    const isRoot = params.itemKey === params.rootKey;

    if (isRoot && !item) {
        return !!params.collection.getCount();
    }

    const isNodeItem = isNode({ ...params, item });
    if (!isNodeItem) {
        return false;
    }

    const hasChildrenByProperty = item.get(params.hasChildrenProperty);

    let hasChildrenValue;
    if (hasChildrenByProperty !== undefined) {
        hasChildrenValue = hasChildrenByProperty;
    } else {
        // true - т.к. по дефолту считаем что в узле есть дети(до момента пока его не прогрузят)
        const hasChildrenByRecordset =
            getChildren({ ...params, nodeKey: params.itemKey }).length > 0;
        hasChildrenValue = params.isLoadedUtil(params.itemKey)
            ? hasChildrenByRecordset
            : true;
    }
    return hasChildrenValue;
}

// endregion Private
