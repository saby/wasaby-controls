import type { Tree as ITree } from 'Controls/baseTree';
import { Model, relation } from 'Types/entity';
import {
    AbstractAspectStateManager,
    IGetListChangeByName,
    IListChange,
    ListChangeNameEnum,
} from 'Controls/abstractListAspect';
import { ListChangeSourceEnum, IRemoveItemsChange } from 'Controls/itemsListAspect';
import { isEqual } from 'Types/object';
import { TKey } from 'Controls/interface';
import { copyExpandCollapseState, IExpandCollapseState } from './IExpandCollapseState';
import { TExpandChangeName, TCollapseChangeName } from './TExpandCollapseChanges';
import { isExpanded } from './UILogic/isExpanded';
import { ALL_EXPANDED_VALUE, isExpandAll } from './UILogic/isExpandAll';

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
        if (hierarchyRelation.isNode(child)) {
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
                result.collapsedItems = collapsedItems.filter((key) => !args.keys.includes(key));
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
): Pick<IExpandCollapseState, 'expandedItems' | 'collapsedItems'> {
    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];
    const result = { expandedItems, collapsedItems };

    if (expandedItems?.length || collapsedItems?.length) {
        const keys = removedItemsKeys.filter((key) => {
            return key !== ALL_EXPANDED_VALUE && !state.items.getRecordById(key);
        });

        if (expandedItems?.length) {
            result.expandedItems = expandedItems.filter((key) => !keys.includes(key));
        }

        if (collapsedItems?.length) {
            result.collapsedItems = collapsedItems.filter((key) => !keys.includes(key));
        }
    }

    return result;
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
        prevState: Partial<IExpandCollapseState>,
        nextState: Partial<IExpandCollapseState>
    ): IListChange[] {
        let changes: IListChange[] = [];

        if (
            'expandedItems' in nextState &&
            !isEqual(prevState.expandedItems, nextState.expandedItems)
        ) {
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

        if (
            'collapsedItems' in nextState &&
            !isEqual(prevState.collapsedItems, nextState.collapsedItems)
        ) {
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
                case ListChangeNameEnum.REMOVE_ITEMS: {
                    if (change.args.reason !== 'assign') {
                        Object.assign(nextState, onCollectionRemove(nextState, change.args.keys));
                    }
                    break;
                }
            }
        }
        return nextState;
    }

    applyChangesToCollection(collection: TCollection, changes: IListChange[]): void {
        const state: IExpandCollapseState = {
            items: collection.getCollection(),
            expandedItems: collection.getExpandedItems(),
            collapsedItems: collection.getCollapsedItems(),
            parentProperty: collection.getParentProperty(),
            nodeProperty: collection.getNodeProperty(),
            keyProperty: collection.getKeyProperty(),
            declaredChildrenProperty: collection.getHasChildrenProperty(),
            // FIXME: Тут теряется singleExpand.
            singleExpand: false,
        };

        for (const change of changes) {
            switch (change.name) {
                case ListChangeNameEnum.EXPAND:
                case ListChangeNameEnum.COLLAPSE:
                case ListChangeNameEnum.REMOVE_ITEMS: {
                    const { expandedItems, collapsedItems } = this.getNextState(state, changes);
                    collection.setExpandedItems(expandedItems);
                    collection.setCollapsedItems(collapsedItems);
                }
            }
        }
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
        changeName: TExpandChangeName | TCollapseChangeName,
        keys: TKey[]
    ): IListChange[] {
        const resultChanges = [...changes];
        const currentChange = changes.find(
            ({ name }) => name === changeName
        ) as IGetListChangeByName<TExpandChangeName | TCollapseChangeName>;

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
