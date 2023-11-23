import type { Tree as ITree } from 'Controls/baseTree';
import type { Model } from 'Types/entity';
import type { IExpandCollapseState } from './IExpandCollapseState';
import type { IListChange, IListChangeByName } from '../../_interface/IListChanges';

// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { isEqual } from 'Types/object';
import { CrudEntityKey } from 'Types/source';
import { relation } from 'Types/entity';
import { IListChangeName } from '../../_interface/IListChanges';
import { AbstractAspectStateManager } from '../abstract/AbstractAspectStateManager';

export const ALL_EXPANDED_VALUE = null;

function isExpandAll(expandedItems: CrudEntityKey[]): boolean {
    return expandedItems[0] === ALL_EXPANDED_VALUE;
}

function addKey(arr: CrudEntityKey[], key: CrudEntityKey): void {
    if (!arr.includes(key)) {
        arr.push(key);
    }
}

function removeKey(arr: CrudEntityKey[], key: CrudEntityKey): void {
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
    expandedItems: CrudEntityKey[],
    key: CrudEntityKey,
    state: IExpandCollapseState
): void {
    if (!state.parentProperty) {
        return;
    }

    const hierarchyRelation = getHierarchyRelation(state);
    const children = hierarchyRelation.getChildren(key, state.items);

    children.forEach((child) => {
        if (hierarchyRelation.isNode(child)) {
            const childKey = (child as Model).getKey();
            removeKey(expandedItems, childKey);
            collapseChildren(expandedItems, childKey, state);
        }
    });
}

function getNextExpandCollapseByChange(
    { name, args }: IListChange,
    { expandedItems, collapsedItems }: IExpandCollapseState
): IExpandCollapseState {
    const result = { expandedItems, collapsedItems };
    switch (name) {
        case IListChangeName.EXPAND: {
            if (isExpandAll(expandedItems)) {
                result.collapsedItems = collapsedItems.filter((key) => !args.keys.includes(key));
            } else {
                result.expandedItems = Array.from(new Set([...expandedItems, ...args.keys]));
            }
            break;
        }
        case IListChangeName.COLLAPSE: {
            if (isExpandAll(expandedItems)) {
                result.collapsedItems = Array.from(new Set([...expandedItems, ...args.keys]));
            } else {
                result.expandedItems = expandedItems.filter((key) => !args.keys.includes(key));
            }
            break;
        }
    }
    return result;
}

function expandItem(state: IExpandCollapseState, key: CrudEntityKey): IExpandCollapseState {
    if (isExpanded(state, key)) {
        return state;
    }

    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];

    if (isExpandAll(expandedItems)) {
        removeKey(collapsedItems, key);
    } else {
        addKey(expandedItems, key);
    }

    let resultState: IExpandCollapseState = {
        ...copyState(state),
        expandedItems,
        collapsedItems,
    };

    if (state.singleExpand) {
        resultState = singleExpand(resultState);
    }

    return resultState;
}

function collapseItem(state: IExpandCollapseState, key: CrudEntityKey): IExpandCollapseState {
    if (!isExpanded(state, key)) {
        return state;
    }

    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];

    if (isExpandAll(expandedItems)) {
        addKey(collapsedItems, key);
    } else {
        removeKey(expandedItems, key);
        collapseChildren(expandedItems, key, state);
    }

    return {
        ...copyState(state),
        expandedItems,
        collapsedItems,
    };
}

function singleExpand(state: IExpandCollapseState): IExpandCollapseState {
    const parents = {};
    let resultState = copyState(state);

    resultState.expandedItems.forEach((id) => {
        const item = resultState.items.getRecordById(id);

        if (item) {
            parents[item.get(resultState.parentProperty)] = id;
        }
    });
    const newExpandedItems = Object.keys(parents).map((parentId) => {
        return parents[parentId];
    });

    const expandedItemsDiff = ArrayUtil.getArrayDifference(
        resultState.expandedItems,
        newExpandedItems
    );

    expandedItemsDiff.removed.forEach((key) => {
        resultState = collapseItem(resultState, key);
    });

    return resultState;
}

function isExpanded(
    { expandedItems, collapsedItems }: IExpandCollapseState,
    key: CrudEntityKey
): boolean {
    return (
        expandedItems.includes(key) || (isExpandAll(expandedItems) && !collapsedItems.includes(key))
    );
}

function onCollectionRemove(
    state: IExpandCollapseState,
    removedItemsKeys: CrudEntityKey[]
): IExpandCollapseState {
    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];
    const result: IExpandCollapseState = { expandedItems, collapsedItems };

    if (expandedItems?.length || collapsedItems?.length) {
        const keys = removedItemsKeys.filter((key) => {
            return !state.items.getRecordById(key) && key !== ALL_EXPANDED_VALUE;
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

function copyState(state: IExpandCollapseState): IExpandCollapseState {
    return {
        items: state.items,
        declaredChildrenProperty: state.declaredChildrenProperty,
        expandedItems: state.expandedItems,
        collapsedItems: state.collapsedItems,
        singleExpand: state.singleExpand,
        keyProperty: state.keyProperty,
        nodeProperty: state.nodeProperty,
        parentProperty: state.parentProperty,
    };
}

export class ExpandCollapseStateManager<
    TCollection extends ITree
> extends AbstractAspectStateManager<IExpandCollapseState, TCollection> {
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
                prevState.expandedItems,
                nextState.expandedItems
            );

            if (added.length) {
                changes = this._addToChanges(changes, IListChangeName.EXPAND, added);
            }

            if (removed.length) {
                changes = this._addToChanges(changes, IListChangeName.COLLAPSE, removed);
            }
        }

        if (
            'collapsedItems' in nextState &&
            !isEqual(prevState.collapsedItems, nextState.collapsedItems)
        ) {
            const { added, removed } = ArrayUtil.getArrayDifference(
                prevState.collapsedItems,
                nextState.collapsedItems
            );

            if (added.length) {
                changes = this._addToChanges(changes, IListChangeName.COLLAPSE, added);
            }

            if (removed.length) {
                changes = this._addToChanges(changes, IListChangeName.EXPAND, added);
            }
        }

        return changes;
    }

    getNextState(state: IExpandCollapseState, changes: IListChange[]): IExpandCollapseState {
        const nextState = copyState(state);

        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.EXPAND:
                case IListChangeName.COLLAPSE: {
                    Object.assign(nextState, getNextExpandCollapseByChange(change, state));
                    break;
                }
                case IListChangeName.REMOVE_ITEMS: {
                    Object.assign(nextState, onCollectionRemove(state, change.args.keys));
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
        };

        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.EXPAND:
                case IListChangeName.COLLAPSE:
                case IListChangeName.REMOVE_ITEMS: {
                    const { expandedItems, collapsedItems } = this.getNextState(state, changes);
                    collection.setExpandedItems(expandedItems);
                    collection.setCollapsedItems(collapsedItems);
                }
            }
        }
    }

    expand(state: IExpandCollapseState, key: CrudEntityKey): IExpandCollapseState {
        return expandItem(state, key);
    }

    collapse(state: IExpandCollapseState, key: CrudEntityKey): IExpandCollapseState {
        return collapseItem(state, key);
    }

    isExpanded(state: IExpandCollapseState, key: CrudEntityKey): boolean {
        return isExpanded(state, key);
    }

    private _addToChanges(
        changes: IListChange[],
        changeName: IListChangeName.COLLAPSE | IListChangeName.EXPAND,
        keys: CrudEntityKey[]
    ): IListChange[] {
        const resultChanges = [...changes];
        const currentChange = changes.find(({ name }) => name === changeName) as IListChangeByName<
            IListChangeName.COLLAPSE | IListChangeName.EXPAND
        >;

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

    // НЕ ИСПОЛЬЗОВАТЬ
    // ВРеменно, чтобы не было дублирования в контроллере разворота узлов в списке
    static expand = expandItem;
    static collapse = collapseItem;
    static isExpanded = isExpanded;
    static onCollectionRemove = onCollectionRemove;
}

export function expandCollapseStateManagerFactory<
    TCollection extends ITree
>(): ExpandCollapseStateManager<TCollection> {
    return new ExpandCollapseStateManager();
}
