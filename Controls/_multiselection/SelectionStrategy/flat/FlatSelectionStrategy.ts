import {
    copyFlatSelectionState,
    IFlatSelectionState,
    TFlatSelectionSideData,
} from './IFlatSelectionState';
import * as FlatUtils from './Utils';
import * as BaseUtils from '../abstract/Utils';
import type { CrudEntityKey } from 'Types/source';
import { Collection, CollectionItem } from 'Controls/display';
import type { Model } from 'Types/entity';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { ISelectionStrategy } from '../abstract/ISelectionStrategy';
import { TSelectionModel } from '../abstract/IAbstractSelectionState';
import { getKey } from '../abstract/Utils';
import { EntityKey } from 'Types/_source/ICrud';

// TODO
const ALL_SELECTION_VALUE = null;

export class FlatSelectionStrategy
    implements ISelectionStrategy<IFlatSelectionState, CollectionItem>
{
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

        nextState.selectionModel = this.getSelectionModel(nextState);

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

        nextState.selectionModel = this.getSelectionModel(nextState);

        return nextState;
    }

    getSelectionModel(
        state: IFlatSelectionState,
        selectionData?: TFlatSelectionSideData,
        _?: number,
        __?: boolean
    ): TSelectionModel {
        const selectedItems: TSelectionModel = new Map();

        if (!state.collection) {
            return selectedItems;
        }

        const isAllSelected = FlatSelectionStrategy.isAllSelected(state);
        const { data } =
            selectionData ?? this.convertCollectionToSelectionSideData(state.collection);

        const selectedKeysSet = new Set(state.selectedKeys);
        const excludedKeysSet = new Set(state.excludedKeys);

        data.forEach((item: CollectionItem<Model>, key) => {
            const inSelectedKeys = selectedKeysSet.has(key);
            const isSelectedByAllValue = isAllSelected && !excludedKeysSet.has(key);
            const selected = item.isReadonlyCheckbox()
                ? inSelectedKeys
                : inSelectedKeys || isSelectedByAllValue;

            selectedItems.set(key, selected);
        });

        return selectedItems;
    }

    convertCollectionToSelectionSideData(collection: Collection): TFlatSelectionSideData {
        const resultMap = new Map<CrudEntityKey, CollectionItem>();

        collection.each((item) => {
            if (!item.SelectableItem) {
                return;
            }

            const key = getKey(item);

            if (typeof key !== 'undefined') {
                resultMap.set(key, item);
            }
        });

        return {
            data: resultMap,
        };
    }

    isKeySelectable(state: IFlatSelectionState, key: EntityKey): boolean {
        if (!state.collection) {
            return false;
        }

        const item = state.collection.getSourceItemByKey(key);
        return FlatUtils.canBeSelected({
            item,
            multiSelectAccessibilityProperty: state.multiSelectAccessibilityProperty,
        });
    }

    private static isAllSelected(state: IFlatSelectionState): boolean {
        return state.selectedKeys.includes(ALL_SELECTION_VALUE);
    }
}
