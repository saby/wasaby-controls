/**
 * @kaizen_zone b3b3d041-8fb2-4abe-a87a-caade6edf0de
 */
import { CrudEntityKey } from 'Types/source';
import { Utils as FlatUtils } from 'Controls/flatSelectionAspect';
import { Utils as HierarchyUtils } from 'Controls/hierarchySelectionAspect';
import {
    ISelectionObject as ISelection,
    TSelectionCountMode,
    TSelectionType,
} from 'Controls/interface';
import { Logger } from 'UI/Utils';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import { ISourceDataStrategy } from 'Controls/display';

export interface ICounterControllerOptions {
    collection: ISourceDataStrategy;
    rootKey: CrudEntityKey;

    keyProperty: string;
    nodeProperty?: string;
    parentProperty?: string;
    hasChildrenProperty?: string;
    childrenProperty?: string;
    childrenCountProperty?: string;
    multiSelectAccessibilityProperty: string;

    selectionType?: TSelectionType;
    selectionCountMode?: TSelectionCountMode;
    selectAncestors?: boolean;
    selectDescendants?: boolean;
    recursiveSelection?: boolean;

    hasMoreUtil: FlatUtils.IHasMoreUtil;
    isLoadedUtil?: HierarchyUtils.IIsLoadedUtil;

    isSearchViewMode?: boolean;
}

interface ISelectedItemData {
    key: CrudEntityKey;
    count: number;
}

/**
 * Контроллер считает кол-во выбранных записей с помощью childrenCountProperty.
 * @public
 */
export default class CounterController {
    private _options: ICounterControllerOptions;
    private _selectedItemsData: ISelectedItemData[];
    private _selection: ISelection = { selected: [], excluded: [] };

    constructor(options: ICounterControllerOptions) {
        this._options = options;
        this.reset();
    }

    update(options: ICounterControllerOptions): void {
        this._options = options;
    }

    setSelection(selection: ISelection): void {
        const selectedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(
            this._selection.selected,
            selection.selected
        );
        const excludedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(
            this._selection.excluded,
            selection.excluded
        );
        this._selection = selection;
        if (this._shouldCountByChildrenCountProperty()) {
            if (selection.selected.length) {
                selectedKeysDiff.added.forEach((it) => {
                    return this._updateCount(it, true);
                });
                excludedKeysDiff.removed.forEach((it) => {
                    return this._updateCount(it, true);
                });
                selectedKeysDiff.removed.forEach((it) => {
                    return this._updateCount(it, false);
                });
                excludedKeysDiff.added.forEach((it) => {
                    return it !== this._options.rootKey && this._updateCount(it, false);
                });
            } else {
                this.reset();
            }
        }
    }

    reset(): void {
        this._selectedItemsData = [];
    }

    getCount(limit?: number, selection?: ISelection, filter?: object): number {
        const isTree = this._options.parentProperty && this._options.nodeProperty;
        if (isTree) {
            if (this._shouldCountByChildrenCountProperty()) {
                return this._selectedItemsData.reduce((count, selectedItem) => {
                    return count + selectedItem.count;
                }, 0);
            }

            return HierarchyUtils.getCount({
                ...this._options,
                selection: selection || this._selection,
                limit,
                filter,
            });
        }

        return FlatUtils.getCount({
            ...this._options,
            selection: selection || this._selection,
            limit,
            filter,
        });
    }

    private _updateCount(itemKey: CrudEntityKey, newState: boolean): void {
        if (itemKey === this._options.rootKey) {
            this._getRootItemKeys(itemKey).forEach((it) => {
                return this._updateCount(it, newState);
            });
            return;
        }
        const item = this._options.collection.getSourceItemByKey(itemKey);
        const isNode = item ? item.get(this._options.nodeProperty) !== null : false;
        const offsetBySelectionCountMode = this._options.selectionCountMode !== 'leaf' ? 1 : 0;
        const count =
            isNode && this._options.childrenCountProperty
                ? item.get(this._options.childrenCountProperty) + offsetBySelectionCountMode
                : 1;
        const itemIndex = this._selectedItemsData.findIndex((it) => {
            return it.key === itemKey;
        });
        if (newState) {
            if (itemIndex === -1) {
                this._selectedItemsData.push({
                    key: itemKey,
                    count,
                });
            }
        } else {
            if (itemIndex !== -1) {
                this._selectedItemsData.splice(itemIndex, 1);
            } else {
                let selectedParentKey = HierarchyUtils.getSelectedParent({
                    ...this._options,
                    selection: this._selection,
                    itemKey,
                });
                if (selectedParentKey === this._options.rootKey) {
                    const dataKeys = this._selectedItemsData.map((it) => {
                        return it.key;
                    });
                    const parentData = HierarchyUtils.getParentIncludedInArray({
                        ...this._options,
                        selection: this._selection,
                        itemKey,
                        array: dataKeys,
                    });
                    if (parentData) {
                        selectedParentKey = parentData.parentKey;
                    }
                }

                const parentIndex = this._selectedItemsData.findIndex((it) => {
                    return it.key === selectedParentKey;
                });
                if (parentIndex !== -1) {
                    this._selectedItemsData[parentIndex].count -= count;
                } else {
                    // Для рута не должно храниться число детей. Поэтому для него и ошибку не нужно кидать.
                    // Ошибку кидаем, чтобы сразу было понятно где счетчик сломался.
                    if (selectedParentKey !== this._options.rootKey) {
                        Logger.error('Не реализован правильный пересчет кол-ва');
                    }
                }
            }
        }
    }

    private _getRootItemKeys(rootKey: CrudEntityKey): CrudEntityKey[] {
        const rootItems = HierarchyUtils.getChildren({
            keyProperty: this._options.keyProperty,
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty,
            hasChildrenProperty: this._options.hasChildrenProperty,
            childrenProperty: this._options.childrenProperty,
            collection: this._options.collection,
            nodeKey: rootKey,
        });
        return rootItems.map((it) => {
            return it.getKey();
        });
    }

    private _shouldCountByChildrenCountProperty(): boolean {
        return !!this._options.childrenCountProperty;
    }
}
