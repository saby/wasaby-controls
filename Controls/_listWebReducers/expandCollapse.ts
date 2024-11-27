/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ListWebActions, TListMiddleware } from 'Controls/dataFactory';
import { UILogic } from 'Controls/listsCommonLogic';
import { TKey } from 'Controls/interface';
import {
    copyExpandCollapseState,
    IExpandCollapseState,
    TExpansionModel,
} from 'Controls/listAspects';
import { Model, relation } from 'Types/entity';

// @ts-ignore
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { getModelsDifference } from 'Controls/_listAspects/_abstractListAspect/common/Utils';
import { ALL_EXPANDED_VALUE } from 'Controls/_listAspects/_expandCollapseListAspect/UILogic/isExpandAll';

const { isExpanded, isExpandAll } = UILogic.Hierarchy;
export const expandCollapse: TListMiddleware =
    ({ getState, dispatch, setState }) =>
    (next) =>
    async (action) => {
        switch (action.type) {
            case 'expand': {
                const { key, markItem } = action.payload;
                const { expandedItems, collapsedItems } = expandItem(getState(), key);
                //#region Обновление состояния узлов
                await dispatch(
                    ListWebActions.expandCollapse.setExpandCollapsedItems(
                        expandedItems,
                        collapsedItems
                    )
                );
                //#endregion

                //#region Обновление маркера
                if (markItem) {
                    await dispatch(ListWebActions.marker.setMarkedKey(key));
                }
                //#endregion
                break;
            }

            case 'collapse': {
                const { key, markItem } = action.payload;
                const { expandedItems, collapsedItems } = collapseItem(getState(), key);
                //#region Обновление состояния узлов
                await dispatch(
                    ListWebActions.expandCollapse.setExpandCollapsedItems(
                        expandedItems,
                        collapsedItems
                    )
                );
                //#endregion

                //#region Обновление маркера
                if (markItem) {
                    await dispatch(ListWebActions.marker.setMarkedKey(key));
                }
                //#endregion
                break;
            }

            case 'resetExpansion': {
                //#region Обновление состояния
                await dispatch(ListWebActions.expandCollapse.setExpandCollapsedItems([], []));
                //#endregion
                break;
            }

            case 'setExpandedItems': {
                const { expandedItems, updateExpansionModel } = action.payload;
                const { added, removed } = ArrayUtil.getArrayDifference(
                    getState().expandedItems || [],
                    expandedItems || []
                );
                if (!added.length && !removed.length) {
                    break;
                }
                //#region Обновление состояния
                setState({ expandedItems });
                //#endregion

                //#region Сайд-эффекты

                if (updateExpansionModel) {
                    await dispatch(ListWebActions.expandCollapse.updateExpansionModel());
                }

                //#endregion Сайд-эффекты
                break;
            }

            case 'setCollapsedItems': {
                const { collapsedItems, updateExpansionModel } = action.payload;
                const { added, removed } = ArrayUtil.getArrayDifference(
                    getState().collapsedItems || [],
                    collapsedItems || []
                );
                if (!added.length && !removed.length) {
                    break;
                }
                //#region Обновление состояния
                setState({ collapsedItems });
                //#endregion

                //#region Сайд-эффекты
                if (updateExpansionModel) {
                    await dispatch(ListWebActions.expandCollapse.updateExpansionModel());
                }
                //#endregion Сайд-эффекты
                break;
            }

            case 'updateExpansionModel': {
                //#region Обновление состояния
                const prevExpansionModel = getState().expansionModel || new Map();
                const modelsDifference = getModelsDifference(
                    prevExpansionModel,
                    getExpansionModel(getState())
                );
                const newModel = new Map(prevExpansionModel);
                modelsDifference.forEach((value, key) => {
                    newModel.set(key, value);
                });
                setState({ expansionModel: newModel });
                //#endregion
                break;
            }

            case 'setExpandCollapsedItems': {
                const { expandedItems, collapsedItems } = action.payload;
                //#region Обновление состояния узлов
                await dispatch(
                    ListWebActions.expandCollapse.setExpandedItems(expandedItems, false)
                );
                await dispatch(
                    ListWebActions.expandCollapse.setCollapsedItems(collapsedItems, false)
                );
                await dispatch(ListWebActions.expandCollapse.updateExpansionModel());
                //#endregion
                break;
            }

            case 'handleRemovedItems': {
                const { keys, reason } = action.payload;
                if (reason !== 'assign') {
                    const { expandedItems, collapsedItems } = onCollectionRemove(getState(), keys);
                    await dispatch(
                        ListWebActions.expandCollapse.setExpandCollapsedItems(
                            expandedItems,
                            collapsedItems
                        )
                    );
                }
                break;
            }

            case 'complexUpdateExpandCollapse': {
                const { prevState, nextState } = action.payload;
                //#region Обновление состояния узлов
                if (
                    prevState.expandedItems !== nextState.expandedItems ||
                    prevState.collapsedItems !== nextState.collapsedItems
                ) {
                    await dispatch(
                        ListWebActions.expandCollapse.setExpandCollapsedItems(
                            nextState.expandedItems,
                            nextState.collapsedItems
                        )
                    );
                }
                //#endregion
                break;
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
function getExpansionModel(state: IExpandCollapseState): TExpansionModel {
    const expansionModel = new Map();
    const { expandedItems = [], items = [], collapsedItems = [] } = state;

    const isAllExpanded = expandedItems.includes(null);
    items.forEach((item) => {
        const key = item.getKey();

        if (typeof key !== 'undefined') {
            const inExpandedItems = expandedItems.includes(key);
            const isExpandedByAllValue = isAllExpanded && !collapsedItems.includes(key);
            const expanded = inExpandedItems || isExpandedByAllValue;

            expansionModel.set(key, expanded);
        }
    });

    return expansionModel;
}

function onCollectionRemove(
    state: IExpandCollapseState,
    removedItemsKeys: TKey[]
): Pick<IExpandCollapseState, 'expandedItems' | 'collapsedItems'> {
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
    }

    return result;
}
