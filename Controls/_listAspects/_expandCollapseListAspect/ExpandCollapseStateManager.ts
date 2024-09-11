import type { Tree as ITree } from 'Controls/baseTree';
import { Model, relation } from 'Types/entity';
import { AbstractAspectStateManager } from '../_abstractListAspect/abstract/AbstractAspectStateManager';
import {
    IGetListChangeByName,
    IListChange,
    ListChangeNameEnum,
} from '../_abstractListAspect/common/ListChanges';
import { IRemoveItemsChange, TItemsChanges } from '../_itemsListAspect/TItemsChanges';
import { fixStateWithHierarchyItems } from '../_abstractListAspect/common/IStateWithHierarchyItems';
import { isEqual } from 'Types/object';
import { TKey } from 'Controls/interface';
import { copyExpandCollapseState, IExpandCollapseState } from './IExpandCollapseState';
import type { TExpansionModel } from './common/TExpansionModel';
import { TExpansionChangeName } from './TExpandCollapseChanges';
import { isExpanded } from './UILogic/isExpanded';
import { ALL_EXPANDED_VALUE, isExpandAll } from './UILogic/isExpandAll';
import { TreeItem as ITreeItemCollection } from 'Controls/baseTree';
import { getModelsDifference } from '../_abstractListAspect/common/Utils';

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

function getNextExpandCollapseByChange(
    { name, args }: IListChange,
    state: IExpandCollapseState
): Pick<IExpandCollapseState, 'expandedItems' | 'collapsedItems'> {
    const { expandedItems, collapsedItems } = state;
    const result = { expandedItems, collapsedItems };

    switch (name) {
        case ListChangeNameEnum.EXPAND: {
            if (isExpandAll(state)) {
                if (args.keys[0] === null) {
                    result.collapsedItems = [];
                } else
                    result.collapsedItems = collapsedItems.filter(
                        (key) => !args.keys.includes(key)
                    );
            } else {
                result.expandedItems = Array.from(new Set([...expandedItems, ...args.keys]));
            }
            break;
        }
        case ListChangeNameEnum.COLLAPSE: {
            if (isExpandAll(state) && !(args.keys[0] === null && args.keys.length === 1)) {
                result.collapsedItems = Array.from(new Set([...collapsedItems, ...args.keys]));
            } else {
                result.expandedItems = expandedItems.filter((key) => !args.keys.includes(key));
            }
            break;
        }
    }
    return result;
}

function expandItem(state: IExpandCollapseState, key: TKey): IExpandCollapseState {
    if (isExpanded(state, key)) {
        return state;
    }

    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];

    if (isExpandAll(state)) {
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
    if (!isExpanded(state, key)) {
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
    if (isExpandAll(state)) {
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
            return key !== ALL_EXPANDED_VALUE && !state.items.getRecordById(key);
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

function getExpansionModel(state: IExpandCollapseState): TExpansionModel {
    const expansionModel = new Map();

    const isAllExpanded = state.expandedItems.includes(null);
    const keyProperty = state.items._$keyProperty;
    state.items.forEach((item) => {
        const key = item.get(keyProperty);

        if (typeof key !== 'undefined') {
            const inExpandedItems = state.expandedItems.includes(key);
            const isExpandedByAllValue = isAllExpanded && !state.collapsedItems.includes(key);
            const expanded = inExpandedItems || isExpandedByAllValue;

            expansionModel.set(key, expanded);
        }
    });

    return expansionModel;
}

export class ExpandCollapseStateManager<
    TCollection extends ITree
> extends AbstractAspectStateManager<IExpandCollapseState, TCollection> {
    // Временно, чтобы не было дублирования в контроллере разворота узлов в списке
    static expand = expandItem;
    static collapse = collapseItem;
    static isExpanded = isExpanded;
    static onCollectionRemove = onCollectionRemove;

    resolveChanges(
        prevState: IExpandCollapseState,
        nextState: IExpandCollapseState
    ): IListChange[] {
        let changes: IListChange[] = [];

        const isExpandedChanged =
            'expandedItems' in nextState &&
            !isEqual(prevState.expandedItems, nextState.expandedItems);

        if (isExpandedChanged) {
            const { added, removed } = ArrayUtil.getArrayDifference(
                prevState.expandedItems || [],
                nextState.expandedItems || []
            );

            if (removed.length) {
                changes = this._addToChanges(changes, ListChangeNameEnum.COLLAPSE, removed);
            }

            if (added.length) {
                changes = this._addToChanges(changes, ListChangeNameEnum.EXPAND, added);
            }
        }

        const isCollapsedChanged =
            'collapsedItems' in nextState &&
            !isEqual(prevState.collapsedItems, nextState.collapsedItems);

        if (isCollapsedChanged) {
            const { added, removed } = ArrayUtil.getArrayDifference(
                prevState.collapsedItems || [],
                nextState.collapsedItems || []
            );

            if (added.length) {
                changes = this._addToChanges(changes, ListChangeNameEnum.COLLAPSE, added);
            }

            if (removed.length) {
                changes = this._addToChanges(changes, ListChangeNameEnum.EXPAND, removed);
            }
        }

        const isKeysChanged = isExpandedChanged || isCollapsedChanged;
        const shouldWorkByMapChanges =
            !isKeysChanged &&
            'selectionModel' in nextState &&
            prevState.expansionModel &&
            nextState.expansionModel &&
            !isEqual(
                [...prevState.expansionModel.entries()],
                [...nextState.expansionModel.entries()]
            );

        if (isKeysChanged || shouldWorkByMapChanges) {
            const expansionModelsDifference = shouldWorkByMapChanges
                ? getModelsDifference(prevState.expansionModel, nextState.expansionModel)
                : getModelsDifference(getExpansionModel(prevState), getExpansionModel(nextState));

            changes.push({
                name: ListChangeNameEnum.SET_EXPANSION_MODEL,
                args: {
                    expansionModel: expansionModelsDifference,
                },
            });
        }

        return changes;
    }

    getNextState(state: IExpandCollapseState, changes: IListChange[]): IExpandCollapseState {
        const nextState = copyExpandCollapseState(state);

        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.EXPAND:
                case ListChangeNameEnum.COLLAPSE: {
                    Object.assign(nextState, getNextExpandCollapseByChange(change, nextState));
                    break;
                }
                case ListChangeNameEnum.SET_EXPANSION_MODEL: {
                    change.args.expansionModel.forEach((value, key) => {
                        nextState.expansionModel.set(key, value);
                    });
                    break;
                }
            }
        }

        return fixStateWithHierarchyItems(nextState) as IExpandCollapseState;
    }

    applyChangesToCollection(
        collection: TCollection,
        changes: IListChange[],
        nextState: IExpandCollapseState
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.EXPAND:
                case ListChangeNameEnum.COLLAPSE: {
                    const { expandedItems, collapsedItems } = nextState;
                    collection.setExpandedItems(expandedItems);
                    collection.setCollapsedItems(collapsedItems);
                }
            }
        }
    }

    static resolveChangesOnItemsChange(
        prevState: IExpandCollapseState,
        _nextState: IExpandCollapseState,
        itemsChanges: TItemsChanges[]
    ): IListChange[] {
        const expandCollapseChanges: IListChange[] = [];

        const removeChange = itemsChanges.find(
            (change) => change.name === ListChangeNameEnum.REMOVE_ITEMS
        ) as IRemoveItemsChange | undefined;

        if (removeChange && removeChange.args.reason !== 'assign') {
            const changedNextState = onCollectionRemove(_nextState, removeChange.args.keys);

            if (!isEqual(_nextState.expandedItems, changedNextState.expandedItems)) {
                expandCollapseChanges.push({
                    name: ListChangeNameEnum.COLLAPSE,
                    args: {
                        keys: removeChange.args.keys,
                    },
                });
            }
            if (!isEqual(_nextState.collapsedItems, changedNextState.collapsedItems)) {
                expandCollapseChanges.push({
                    name: ListChangeNameEnum.EXPAND,
                    args: {
                        keys: removeChange.args.keys,
                    },
                });
            }
            if (
                _nextState.expansionModel &&
                changedNextState.expansionModel &&
                !isEqual(
                    [..._nextState.expansionModel.entries()],
                    [...changedNextState.expansionModel.entries()]
                )
            ) {
                expandCollapseChanges.push({
                    name: ListChangeNameEnum.SET_EXPANSION_MODEL,
                    args: {
                        expansionModel: getModelsDifference(
                            _nextState.expansionModel,
                            changedNextState.expansionModel
                        ),
                    },
                });
            }
        }

        return expandCollapseChanges;
    }

    static resolveChangesOnChangeRoot(
        prevState: IExpandCollapseState,
        _nextState: IExpandCollapseState,
        itemsChanges: IListChange[]
    ): IListChange[] {
        const expandCollapseChanges: IListChange[] = [];

        const changeRoot = itemsChanges.find(
            (change) => change.name === ListChangeNameEnum.CHANGE_ROOT
        ) as IRemoveItemsChange | undefined;

        if (changeRoot) {
            if (_nextState.expandedItems?.length) {
                expandCollapseChanges.push({
                    name: ListChangeNameEnum.EXPAND,
                    args: {
                        keys: [],
                    },
                });
            }
            if (_nextState.collapsedItems?.length) {
                expandCollapseChanges.push({
                    name: ListChangeNameEnum.COLLAPSE,
                    args: {
                        keys: [],
                    },
                });
            }
            if (_nextState.expansionModel?.size) {
                expandCollapseChanges.push({
                    name: ListChangeNameEnum.SET_EXPANSION_MODEL,
                    args: {
                        expansionModel: new Map(),
                    },
                });
            }
        }

        return expandCollapseChanges;
    }

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
        return isExpanded(state, key);
    }

    isExpandAll(state: IExpandCollapseState): boolean {
        return isExpandAll(state);
    }

    private _addToChanges(
        changes: IListChange[],
        changeName: TExpansionChangeName,
        keys: TKey[]
    ): IListChange[] {
        const resultChanges = [...changes];
        const currentChange = changes.find(
            ({ name }) => name === changeName
        ) as IGetListChangeByName<TExpansionChangeName>;

        if (currentChange) {
            currentChange.args.keys = Array.from(new Set([...currentChange.args.keys, ...keys]));
        } else {
            resultChanges.push({
                name: changeName,
                args: {
                    keys,
                },
            });
        }

        return resultChanges;
    }
}

export function expandCollapseStateManagerFactory<
    TCollection extends ITree
>(): ExpandCollapseStateManager<TCollection> {
    return new ExpandCollapseStateManager();
}
