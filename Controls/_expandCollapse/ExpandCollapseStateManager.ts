import { Model, relation } from 'Types/entity';
import type { TKey } from 'Controls/interface';
import { copyExpandCollapseState, IExpandCollapseState } from './IExpandCollapseState';
import { UILogic } from 'Controls/listsCommonLogic';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';

function addKey(arr: TKey[], key: TKey): void {
    if (!arr.includes(key)) {
        arr.push(key);
    }
}

function removeKey(arr: TKey[], key: TKey): void {
    const idx = arr.indexOf(key);

    if (idx >= 0) {
        arr.splice(idx, 1);
    }
}

function getHierarchyRelation(state: IExpandCollapseState): relation.Hierarchy {
    return new relation.Hierarchy({
        parentProperty: state.parentProperty,
        nodeProperty: state.nodeProperty,
        keyProperty: state.keyProperty,
        declaredChildrenProperty: state.declaredChildrenProperty,
    });
}

function collapseChildren(
    expandedItems: TKey[],
    collapsedItems: TKey[],
    key: TKey,
    state: IExpandCollapseState
): void {
    if (!state.parentProperty) {
        return;
    }

    const hierarchyRelation = getHierarchyRelation(state);
    const children = hierarchyRelation.getChildren(key as any, state.items) as Model[];

    children.forEach((child) => {
        const nodePropertyValue = hierarchyRelation.isNode(child) as boolean | null | undefined;
        if (nodePropertyValue === true || nodePropertyValue === false) {
            _collapseItem(expandedItems, collapsedItems, child.getKey(), state);
        }
    });
}

function expandItem(state: IExpandCollapseState, key: TKey): IExpandCollapseState {
    if (UILogic.Hierarchy.isExpanded(state, key)) {
        return state;
    }

    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];

    if (UILogic.Hierarchy.isExpandAll(state)) {
        removeKey(collapsedItems, key);
    } else {
        addKey(expandedItems, key);
    }

    let resultState: IExpandCollapseState = {
        ...copyExpandCollapseState(state),
        expandedItems,
        collapsedItems,
    };

    if (state.singleExpand) {
        resultState = singleExpand(resultState);
    }

    return resultState;
}

function collapseItem(state: IExpandCollapseState, key: TKey): IExpandCollapseState {
    if (!UILogic.Hierarchy.isExpanded(state, key)) {
        return state;
    }

    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];

    _collapseItem(expandedItems, collapsedItems, key, state);

    return {
        ...copyExpandCollapseState(state),
        expandedItems,
        collapsedItems,
    };
}

function _collapseItem(
    expandedItems: TKey[],
    collapsedItems: TKey[],
    key: TKey,
    state: IExpandCollapseState
): void {
    if (UILogic.Hierarchy.isExpandAll(state)) {
        addKey(collapsedItems, key);
    } else {
        removeKey(expandedItems, key);
    }
    collapseChildren(expandedItems, collapsedItems, key, state);
}

function singleExpand(state: IExpandCollapseState): IExpandCollapseState {
    const parents = new Map<TKey, TKey>();
    let resultState = copyExpandCollapseState(state);

    (resultState.expandedItems as Exclude<TKey, null>[]).forEach((id) => {
        if (id === null) {
            throw Error();
        }
        const item = resultState.items.getRecordById(id);

        if (item) {
            const itemParentId = item.get(resultState.parentProperty) as unknown as TKey;
            parents.set(itemParentId, id);
        }
    });

    const expandedItemsDiff = ArrayUtil.getArrayDifference(resultState.expandedItems, [
        ...parents.values(),
    ]);

    expandedItemsDiff.removed.forEach((key) => {
        resultState = collapseItem(resultState, key);
    });

    return resultState;
}

function onCollectionRemove(
    state: IExpandCollapseState,
    removedItemsKeys: TKey[]
): Pick<IExpandCollapseState, 'expandedItems' | 'collapsedItems' | 'expansionModel'> {
    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];
    const expansionModel = new Map(state.expansionModel);
    const result = { expandedItems, collapsedItems, expansionModel };

    if (expandedItems?.length || collapsedItems?.length || expansionModel?.size) {
        const keys = removedItemsKeys.filter((key) => {
            return key !== UILogic.Hierarchy.ALL_EXPANDED_VALUE && !state.items.getRecordById(key);
        });

        if (expandedItems?.length) {
            result.expandedItems = expandedItems.filter((key) => !keys.includes(key));
        }

        if (collapsedItems?.length) {
            result.collapsedItems = collapsedItems.filter((key) => !keys.includes(key));
        }

        if (expansionModel?.size) {
            keys.forEach((key) => result.expansionModel.delete(key));
        }
    }

    return result;
}

export class ExpandCollapseStateManager {
    expand(state: IExpandCollapseState, key: TKey): IExpandCollapseState {
        return expandItem(state, key);
    }

    collapse(state: IExpandCollapseState, key: TKey): IExpandCollapseState {
        return collapseItem(state, key);
    }

    // НЕ ИСПОЛЬЗОВАТЬ

    reset(state: IExpandCollapseState): IExpandCollapseState {
        return {
            ...copyExpandCollapseState(state),
            expandedItems: [],
            collapsedItems: [],
        };
    }

    isExpanded(state: IExpandCollapseState, key: TKey): boolean {
        return UILogic.Hierarchy.isExpanded(state, key);
    }

    isExpandAll(state: IExpandCollapseState): boolean {
        return UILogic.Hierarchy.isExpandAll(state);
    }

    // Временно, чтобы не было дублирования в контроллере разворота узлов в списке
    static expand = expandItem;
    static collapse = collapseItem;
    static isExpanded = UILogic.Hierarchy.isExpanded;
    static onCollectionRemove = onCollectionRemove;
}
