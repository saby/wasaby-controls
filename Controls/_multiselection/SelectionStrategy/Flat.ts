import { ISelectionObject as ISelection } from 'Controls/interface';
import { Model } from 'Types/entity';
import { IEntryPathItem, IFlatSelectionStrategyOptions, ISelectionModel } from '../interface';
import ISelectionStrategy from './ISelectionStrategy';
import { CrudEntityKey } from 'Types/source';
import { CollectionItem } from 'Controls/display';
import { TSelectionModel } from 'Controls/abstractSelectionAspect';
import {
    FlatSelectionStrategy as NewFlatSelectionStrategy,
    IFlatSelectionState,
} from 'Controls/flatSelectionAspect';

/**
 * Базовая стратегия выбора в плоском списке.
 * @public
 */
export class FlatSelectionStrategy<TItem extends CollectionItem = CollectionItem>
    implements ISelectionStrategy<TItem>
{
    protected _model: ISelectionModel;
    protected _isMassSelectMode: boolean = true;
    protected _newStrategy;

    constructor(options: IFlatSelectionStrategyOptions) {
        this._model = options.model;
        this._newStrategy = new NewFlatSelectionStrategy();
    }

    update(options: IFlatSelectionStrategyOptions): void {
        this._model = options.model;
    }

    setMassSelect(isMassSelected: boolean): void {
        this._isMassSelectMode = isMassSelected;
    }

    // eslint-disable-next-line no-empty, no-empty-function, @typescript-eslint/no-empty-function
    setEntryPath(entryPath: IEntryPathItem[]): void {}

    private _getCompatibleState(selection: ISelection): IFlatSelectionState {
        return {
            selectedKeys: selection.selected,
            excludedKeys: selection.excluded,
            selectionModel: new Map(),
            items: this._model.getSourceCollection(),
            multiSelectAccessibilityProperty: this._model.getMultiSelectAccessibilityProperty(),
            keyProperty: this._model.getKeyProperty(),
            collection: this._model,
            isMassSelectMode: this._isMassSelectMode,
        };
    }
    private _call(o: string, selection: ISelection, ...args) {
        const nextState = this._newStrategy[o](this._getCompatibleState(selection), ...args);

        return {
            selected: nextState.selectedKeys,
            excluded: nextState.excludedKeys,
            recursive: undefined,
        };
    }

    select(selection: ISelection, key: CrudEntityKey, searchMode?: boolean): ISelection {
        return this._call('select', selection, key, searchMode);
    }

    unselect(selection: ISelection, key: CrudEntityKey, searchMode?: boolean): ISelection {
        return this._call('unselect', selection, key, searchMode);
    }

    selectAll(selection: ISelection, limit?: number): ISelection {
        return this._call('selectAll', selection, limit);
    }

    unselectAll(selection: ISelection, filter?: object): ISelection {
        return this._call('unselectAll', selection, filter);
    }

    toggleAll(selection: ISelection, hasMoreData: boolean): ISelection {
        return this._call('toggleAll', selection, hasMoreData);
    }

    selectRange(items: TItem[]): ISelection {
        return this._call('selectRange', { selected: [], excluded: [] }, items);
    }

    getSelectionForModel(
        selection: ISelection,
        limit?: number,
        searchMode?: boolean
    ): Map<boolean, TItem[]> {
        return this._convertSelectionModelToMap(
            this._newStrategy.getSelectionModel(
                this._getCompatibleState(selection),
                limit,
                searchMode
            )
        );
    }

    protected _convertSelectionModelToMap(
        selectionModel: TSelectionModel
    ): Map<boolean | null, TItem[]> {
        const selectedItems = new Map();
        // IE не поддерживает инициализацию конструктором
        selectedItems.set(true, []);
        selectedItems.set(false, []);
        selectedItems.set(null, []);

        selectionModel.forEach((value, key) => {
            selectedItems.get(value).push(this._model.getItemBySourceKey(key, false));
        });

        return selectedItems;
    }

    isAllSelected(
        selection: ISelection,
        ...args: [
            hasMoreData: boolean,
            itemsCount: number,
            limit: number,
            byEveryItem?: boolean,
            rootKey?: CrudEntityKey
        ]
    ): boolean {
        return this._newStrategy.isAllSelected(this._getCompatibleState(selection), ...args);
    }

    reset(): void {
        /* For override */
    }

    getSelectedItems(selection: ISelection, selectedItems: TItem[]): TItem[] {
        const filterItems = (item) => {
            return item.getContents() instanceof Model;
        };
        let result = [];
        const selectionForModel = this.getSelectionForModel(selection);
        const newSelectedItems = selectionForModel.get(true).filter(filterItems);
        if (selectedItems?.length) {
            const unselectedItems = selectionForModel.get(false).filter(filterItems);
            const unselectedItemsKeys = unselectedItems.map((item: TItem) => {
                return item.getContents().getKey();
            });
            const newSelectedItemsKeys = newSelectedItems.map((item: TItem) =>
                item.getContents().getKey()
            );
            const filteredUnselectedItems = selectedItems.filter((selectedItem) => {
                const key = selectedItem.getContents().getKey();
                return !unselectedItemsKeys.includes(key) && !newSelectedItemsKeys.includes(key);
            });
            result = filteredUnselectedItems.concat(newSelectedItems);
        } else {
            result = newSelectedItems;
        }
        return result;
    }
}
