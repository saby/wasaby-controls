import { copyFlatSelectionState, IFlatSelectionState } from './IFlatSelectionState';
import * as FlatUtils from './Utils';
import * as BaseUtils from '../../selection/_abstractSelectionAspect/Utils';
import type { CrudEntityKey } from 'Types/source';
import type { CollectionItem } from 'Controls/display';
import type { Model } from 'Types/entity';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { ISelectionStrategy } from '../_abstractSelectionAspect/ISelectionStrategy';
import { TSelectionModel } from '../_abstractSelectionAspect/IAbstractSelectionState';
// TODO
const ALL_SELECTION_VALUE = null;

export class FlatSelectionStrategy implements ISelectionStrategy<IFlatSelectionState> {
    select(
        state: IFlatSelectionState,
        key: CrudEntityKey,
        _searchMode?: boolean
    ): IFlatSelectionState {
        const nextState = copyFlatSelectionState(state);

        if (FlatSelectionStrategy.isAllSelected(nextState)) {
            ArraySimpleValuesUtil.removeSubArray(nextState.excludedKeys, [key]);
        } else {
            ArraySimpleValuesUtil.addSubArray(nextState.selectedKeys, [key]);
        }

        nextState.selectionModel = this.getSelectionModel(nextState);

        return nextState;
    }

    unselect(
        state: IFlatSelectionState,
        key: CrudEntityKey,
        _searchMode?: boolean
    ): IFlatSelectionState {
        const nextState = copyFlatSelectionState(state);

        if (FlatSelectionStrategy.isAllSelected(nextState)) {
            ArraySimpleValuesUtil.addSubArray(nextState.excludedKeys, [key]);
        } else {
            ArraySimpleValuesUtil.removeSubArray(nextState.selectedKeys, [key]);
        }

        nextState.selectionModel = this.getSelectionModel(nextState);

        return nextState;
    }

    isAllSelected(
        state: IFlatSelectionState,
        hasMoreData: boolean,
        itemsCount: number,
        limit: number,
        byEveryItem: boolean = true
    ): boolean {
        let allSelected;

        const selection = {
            selected: state.selectedKeys,
            excluded: state.excludedKeys,
        };

        if (limit) {
            allSelected = FlatUtils.isAllSelected(selection) && limit >= itemsCount && !hasMoreData;
        } else if (byEveryItem) {
            const selectedCount = FlatUtils.getCount({
                selection,
                collection: state.collection.getSourceDataStrategy(),
                limit,
                hasMoreUtil: () => {
                    return hasMoreData;
                },
                multiSelectAccessibilityProperty: state.multiSelectAccessibilityProperty,
            });
            allSelected =
                (FlatUtils.isAllSelected(selection) && selection.excluded.length === 0) ||
                (!hasMoreData && itemsCount > 0 && itemsCount === selectedCount);
        } else {
            allSelected = FlatUtils.isAllSelected(selection);
        }

        return allSelected;
    }

    selectAll(state: IFlatSelectionState, limit?: number): IFlatSelectionState {
        let nextState = copyFlatSelectionState(state);

        const excluded = limit ? nextState.excludedKeys : [];
        if (nextState.isMassSelectMode) {
            nextState.selectedKeys = [ALL_SELECTION_VALUE];
            nextState.excludedKeys = excluded;
        } else {
            nextState.selectedKeys = [];
            nextState.excludedKeys = [];

            nextState.collection.getItems().forEach((item) => {
                if (item.SelectableItem) {
                    nextState = this.select(nextState, BaseUtils.getKey(item));
                }
            });
        }
        return nextState;
    }

    unselectAll(state: IFlatSelectionState, filter?: object): IFlatSelectionState {
        return copyFlatSelectionState({
            ...state,
            ...BaseUtils.unselectAll(state, filter),
        });
    }

    selectRange(state: IFlatSelectionState, items: CollectionItem[]): IFlatSelectionState {
        let nextState = copyFlatSelectionState({
            ...state,
            selectedKeys: [],
            excludedKeys: [],
        });

        items.forEach((elem) => {
            if (elem.SelectableItem) {
                const elemKey = BaseUtils.getKey(elem);
                nextState = this.select(nextState, elemKey);
            }
        });

        return nextState;
    }

    toggleAll(state: IFlatSelectionState): IFlatSelectionState {
        let nextState = copyFlatSelectionState(state);

        if (
            FlatUtils.isAllSelected({
                selected: nextState.selectedKeys,
                excluded: nextState.excludedKeys,
            })
        ) {
            const excludedKeys = nextState.excludedKeys.slice();
            nextState = this.unselectAll(nextState);
            excludedKeys.forEach((key) => {
                return (nextState = this.select(nextState, key));
            });
        } else {
            const selectedKeys = nextState.selectedKeys.slice();
            nextState = this.selectAll(nextState);
            selectedKeys.forEach((key) => {
                return (nextState = this.unselect(nextState, key));
            });
        }

        return nextState;
    }

    getSelectionModel(state: IFlatSelectionState): TSelectionModel {
        const selectedItems: TSelectionModel = new Map();

        const isAllSelected = FlatSelectionStrategy.isAllSelected(state);

        state.collection.getItems().forEach((item: CollectionItem<Model>) => {
            if (!item.SelectableItem) {
                return;
            }

            const itemId = BaseUtils.getKey(item);

            if (typeof itemId !== 'undefined') {
                const inSelectedKeys = state.selectedKeys.includes(itemId);
                const isSelectedByAllValue = isAllSelected && !state.excludedKeys.includes(itemId);
                const selected = item.isReadonlyCheckbox()
                    ? inSelectedKeys
                    : inSelectedKeys || isSelectedByAllValue;

                selectedItems.set(itemId, selected);
            }
        });

        return selectedItems;
    }

    private static isAllSelected(state: IFlatSelectionState): boolean {
        return state.selectedKeys.includes(ALL_SELECTION_VALUE);
    }
}
