/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');

import { ISelectionObject as ISelection } from 'Controls/interface';
import { Model } from 'Types/entity';
import {
    IEntryPathItem,
    IFlatSelectionStrategyOptions,
    ISelectionModel,
} from '../interface';
import ISelectionStrategy from './ISelectionStrategy';
import clone = require('Core/core-clone');
import { CrudEntityKey } from 'Types/source';
import { CollectionItem } from 'Controls/display';
import * as Utils from '../Utils/Flat';

const ALL_SELECTION_VALUE = null;

/**
 * Базовая стратегия выбора в плоском списке.
 * @class Controls/_multiselection/SelectionStrategy/FlatSelectionStrategy
 *
 * @public
 */
export class FlatSelectionStrategy<TItem extends CollectionItem>
    implements ISelectionStrategy<TItem>
{
    private _model: ISelectionModel;

    constructor(options: IFlatSelectionStrategyOptions) {
        this._model = options.model;
    }

    update(options: IFlatSelectionStrategyOptions): void {
        this._model = options.model;
    }

    // eslint-disable-next-line no-empty, no-empty-function, @typescript-eslint/no-empty-function
    setEntryPath(entryPath: IEntryPathItem[]): void {}

    select(selection: ISelection, key: CrudEntityKey): ISelection {
        const cloneSelection = clone(selection);

        if (Utils.isAllSelected(cloneSelection)) {
            ArraySimpleValuesUtil.removeSubArray(cloneSelection.excluded, [
                key,
            ]);
        } else {
            ArraySimpleValuesUtil.addSubArray(cloneSelection.selected, [key]);
        }

        return cloneSelection;
    }

    unselect(selection: ISelection, key: CrudEntityKey): ISelection {
        const cloneSelection = clone(selection);

        if (Utils.isAllSelected(cloneSelection)) {
            ArraySimpleValuesUtil.addSubArray(cloneSelection.excluded, [key]);
        } else {
            ArraySimpleValuesUtil.removeSubArray(cloneSelection.selected, [
                key,
            ]);
        }

        return cloneSelection;
    }

    selectAll(selection: ISelection, limit?: number): ISelection {
        const excluded = limit ? selection.excluded : [];
        return { selected: [ALL_SELECTION_VALUE], excluded };
    }

    unselectAll(selection: ISelection, filter?: object): ISelection {
        if (
            filter &&
            Utils.isAllSelected(selection) &&
            !this._model.hasMoreData()
        ) {
            const cloneSelection = clone(selection);
            this._model.getItems().forEach((it) => {
                ArraySimpleValuesUtil.addSubArray(cloneSelection.excluded, [
                    it.key,
                ]);
            });
            return cloneSelection;
        }

        return { selected: [], excluded: [] };
    }

    toggleAll(selection: ISelection, hasMoreData: boolean): ISelection {
        let cloneSelection = clone(selection);

        if (Utils.isAllSelected(cloneSelection)) {
            const excludedKeys = cloneSelection.excluded.slice();
            cloneSelection = this.unselectAll(cloneSelection);
            excludedKeys.forEach((key) => {
                return (cloneSelection = this.select(cloneSelection, key));
            });
        } else {
            const selectedKeys = cloneSelection.selected.slice();
            cloneSelection = this.selectAll(cloneSelection);
            selectedKeys.forEach((key) => {
                return (cloneSelection = this.unselect(cloneSelection, key));
            });
        }

        return cloneSelection;
    }

    selectRange(items: TItem[]): ISelection {
        let newSelection = { selected: [], excluded: [] };

        items.forEach((elem) => {
            if (elem.SelectableItem) {
                const elemKey = this._getKey(elem);
                newSelection = this.select(newSelection, elemKey);
            }
        });

        return newSelection;
    }

    getSelectionForModel(
        selection: ISelection,
        limit?: number
    ): Map<boolean, TItem[]> {
        const selectedItems = new Map();
        // IE не поддерживает инициализацию конструктором
        selectedItems.set(true, []);
        selectedItems.set(false, []);
        selectedItems.set(null, []);

        const handleItem = (item) => {
            if (!item.SelectableItem) {
                return;
            }

            const itemId = this._getKey(item);
            const inSelectedKeys = selection.selected.includes(itemId);
            const isSelectedByAllValue =
                Utils.isAllSelected(selection) &&
                !selection.excluded.includes(itemId);
            const selected = item.isReadonlyCheckbox()
                ? inSelectedKeys
                : inSelectedKeys || isSelectedByAllValue;

            selectedItems.get(selected).push(item);
        };

        this._model.getItems().forEach(handleItem);

        return selectedItems;
    }

    isAllSelected(
        selection: ISelection,
        hasMoreData: boolean,
        itemsCount: number,
        limit: number,
        byEveryItem: boolean = true
    ): boolean {
        let allSelected;

        if (limit) {
            allSelected =
                Utils.isAllSelected(selection) &&
                limit >= itemsCount &&
                !hasMoreData;
        } else if (byEveryItem) {
            const selectedCount = Utils.getCount({
                selection,
                collection: this._model.getSourceDataStrategy(),
                limit,
                hasMoreUtil: () => {
                    return hasMoreData;
                },
                multiSelectAccessibilityProperty:
                    this._model.getMultiSelectAccessibilityProperty(),
            });
            allSelected =
                (Utils.isAllSelected(selection) &&
                    selection.excluded.length === 0) ||
                (!hasMoreData &&
                    itemsCount > 0 &&
                    itemsCount === selectedCount);
        } else {
            allSelected = Utils.isAllSelected(selection);
        }

        return allSelected;
    }

    reset(): void {
        /* For override */
    }

    /**
     * @private
     * TODO нужно выпилить этот метод при переписывании моделей. item.getContents() должен возвращать Record
     *  https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
     */
    private _getKey(item: CollectionItem<Model>): CrudEntityKey {
        if (!item) {
            return undefined;
        }

        let contents = item.getContents();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (item['[Controls/_baseTree/BreadcrumbsItem]'] || item.breadCrumbs) {
            // eslint-disable-next-line
            contents = contents[(contents as any).length - 1];
        }

        // Для GroupItem нет ключа, в contents хранится не Model
        if (item['[Controls/_display/GroupItem]']) {
            return undefined;
        }

        // у корневого элемента contents=key
        return contents instanceof Object ? contents.getKey() : contents;
    }
}
