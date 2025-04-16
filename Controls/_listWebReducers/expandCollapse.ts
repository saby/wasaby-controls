/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IListState, ListActionCreators, TListMiddleware } from 'Controls-DataEnv/list';
import { TKey } from 'Controls-DataEnv/interface';
import { UILogic } from 'Controls/listsCommonLogic';
import { Model, relation } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { Initializer } from 'Controls-DataEnv/abstractList';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';

const { isExpanded, isExpandAll } = UILogic.Hierarchy;
export const expandCollapse: TListMiddleware =
    ({ getState, dispatch, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'expand': {
                const { key, markItem } = action.payload;
                const { expandedItems, collapsedItems } = expandItem(getState(), key);
                //# region Обновление состояния узлов
                await dispatch(
                    ListActionCreators.expandCollapse.setExpandCollapsedItems(
                        expandedItems,
                        collapsedItems
                    )
                );
                //# endregion

                //# region Обновление маркера
                if (markItem) {
                    await dispatch(ListActionCreators.marker.mark(key));
                }
                //# endregion
                break;
            }

            case 'expandParent': {
                const { key, markItem } = action.payload;
                const state = getState();

                if (!state.items?.getRecordById(key)) {
                    break;
                }

                const parentKey = getParentNodeKeyByChildKey(key, state);

                // Корневой элемент всегда считается раскрытым
                if (parentKey && parentKey !== state.root && !isExpanded(state, parentKey)) {
                    await dispatch(ListActionCreators.expandCollapse.expand(parentKey, markItem));
                }
                break;
            }

            case 'collapse': {
                const { key, markItem } = action.payload;
                const { expandedItems, collapsedItems } = collapseItem(getState(), key);
                //# region Обновление состояния узлов
                await dispatch(
                    ListActionCreators.expandCollapse.setExpandCollapsedItems(
                        expandedItems,
                        collapsedItems
                    )
                );
                //# endregion

                //# region Обновление маркера
                if (markItem) {
                    await dispatch(ListActionCreators.marker.mark(key));
                }
                //# endregion
                break;
            }

            case 'resetExpansion': {
                //# region Обновление состояния
                await dispatch(ListActionCreators.expandCollapse.setExpandCollapsedItems([], []));
                //# endregion
                break;
            }

            case 'setExpandedItems': {
                const { expandedItems } = action.payload;
                const { added, removed } = ArrayUtil.getArrayDifference(
                    getState().expandedItems || [],
                    expandedItems || []
                );
                if (!added.length && !removed.length) {
                    break;
                }
                //# region Обновление состояния
                setState({ expandedItems });
                //# endregion
                break;
            }

            case 'setCollapsedItems': {
                const { collapsedItems } = action.payload;
                const { added, removed } = ArrayUtil.getArrayDifference(
                    getState().collapsedItems || [],
                    collapsedItems || []
                );
                if (!added.length && !removed.length) {
                    break;
                }
                //# region Обновление состояния
                setState({ collapsedItems });
                //# endregion
                break;
            }

            case 'updateExpansionModel': {
                //# region Обновление состояния
                const newModel = Initializer.hierarchy.getExpansionModel(
                    getState().items,
                    getState().expandedItems,
                    getState().collapsedItems
                );
                const result = new Map();
                getState().expansionModel.forEach((_, key) => {
                    result.set(key, false);
                });
                newModel.forEach((value, key) => {
                    result.set(key, value);
                });
                setState({ expansionModel: result });
                //# endregion
                break;
            }

            case 'setExpandCollapsedItems': {
                const { expandedItems, collapsedItems } = action.payload;
                //# region Обновление состояния узлов
                await dispatch(ListActionCreators.expandCollapse.setExpandedItems(expandedItems));
                await dispatch(ListActionCreators.expandCollapse.setCollapsedItems(collapsedItems));
                //# endregion
                break;
            }

            case 'onItemsRemoved': {
                const { keys, reason } = action.payload;
                if (reason !== 'assign') {
                    const { expandedItems, collapsedItems } = onCollectionRemove(getState(), keys);
                    await dispatch(
                        ListActionCreators.expandCollapse.setExpandCollapsedItems(
                            expandedItems,
                            collapsedItems
                        )
                    );
                }
                break;
            }
            case 'onEndUpdate': {
                await dispatch(ListActionCreators.expandCollapse.updateExpansionModel());
            }
        }
        next(action);
    };

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

function getHierarchyRelation(state: IListState): relation.Hierarchy {
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
    state: IListState
): void {
    if (!state.parentProperty || !state.items) {
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

function _collapseItem(
    expandedItems: TKey[],
    collapsedItems: TKey[],
    key: TKey,
    state: IListState
): void {
    if (isExpandAll(state)) {
        addKey(collapsedItems, key);
    } else {
        removeKey(expandedItems, key);
    }
    collapseChildren(expandedItems, collapsedItems, key, state);
}

function singleExpand(state: IListState): IListState {
    let resultState = { ...state };
    const { items } = resultState;

    if (!items) {
        return state;
    }

    const parents = new Map<TKey, TKey>();

    (resultState.expandedItems as Exclude<TKey, null>[]).forEach((id) => {
        if (id === null) {
            throw Error();
        }
        const item = items.getRecordById(id);

        if (item) {
            const itemParentId = item.get(resultState.parentProperty || '') as unknown as TKey;
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

function expandItem(state: IListState, key: TKey): IListState {
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

    let resultState: IListState = {
        ...state,
        expandedItems,
        collapsedItems,
    };

    if (state.singleExpand) {
        resultState = singleExpand(resultState);
    }

    if (state.items) {
        const hierarchyRelation = getHierarchyRelation(resultState);
        const parent = hierarchyRelation.getParent(key as any, state.items) as Model | null;

        if (parent && !isExpanded(resultState, parent.getKey())) {
            return expandItem(resultState, parent.getKey());
        }
    }

    return resultState;
}

function collapseItem(state: IListState, key: TKey): IListState {
    if (!isExpanded(state, key)) {
        return state;
    }

    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];

    _collapseItem(expandedItems, collapsedItems, key, state);

    return {
        ...state,
        expandedItems,
        collapsedItems,
    };
}

function getParentNodeKeyByChildKey(key: CrudEntityKey, state: IListState): CrudEntityKey | null {
    if (!state.items) {
        return null;
    }

    const hierarchyRelation = getHierarchyRelation(state);
    const parent = hierarchyRelation.getParent(key as any, state.items) as Model | null;

    if (parent && hierarchyRelation.isNode(parent)) {
        return parent.getKey();
    }

    return null;
}

function onCollectionRemove(
    state: IListState,
    removedItemsKeys: TKey[]
): Pick<IListState, 'expandedItems' | 'collapsedItems'> {
    const expandedItems = [...state.expandedItems];
    const collapsedItems = [...state.collapsedItems];
    const expansionModel = new Map(state.expansionModel);
    const result = { expandedItems, collapsedItems, expansionModel };
    const { items } = state;

    if (items && (expandedItems?.length || collapsedItems?.length || expansionModel?.size)) {
        const keys = removedItemsKeys.filter((key) => {
            return key !== UILogic.Hierarchy.ALL_EXPANDED_VALUE && !items.getRecordById(key);
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
