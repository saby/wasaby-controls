/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { VersionableMixin } from 'Types/entity';
import { mixin } from 'Types/util';
import { MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS } from 'Controls/_filterPanel/Constants';
import IExtendedPropertyValue from '../_interface/IExtendedPropertyValue';
import { object } from 'Types/util';
import {
    getExtendedItems,
    isFrequentFilterItem,
    isExtendedItem,
    viewModeFilter
} from '../View/ExtendedItemsUtil';

export interface IExtendedViewModelOptions {
    typeDescription: IFilterItem[];
    viewMode?: string;
    editingObject: Record<string, IExtendedPropertyValue>;
    extendedItemsViewMode: string;
}

interface IAdditionalColumns {
    left: IFilterItem[];
    right: IFilterItem[];
}

export default class ExtendedViewModel extends mixin<VersionableMixin>(VersionableMixin) {
    protected _additionalColumns: IAdditionalColumns = null;
    protected _isListExpanded: boolean = false;
    protected _options: IExtendedViewModelOptions;

    constructor(options: IExtendedViewModelOptions) {
        super(options);
        this._options = options;
        this._additionalColumns = this._getAdditionalColumns();
    }

    update(options: IExtendedViewModelOptions): void {
        const typeDescriptionChanged = !isEqual(this._options.typeDescription, options.typeDescription);
        this._options = options;
        if (typeDescriptionChanged) {
            this._additionalColumns = this._getAdditionalColumns();
            this._nextVersion();
        }
    }

    toggleListExpanded(): void {
        this._isListExpanded = !this._isListExpanded;
        this._additionalColumns = this._getAdditionalColumns();
        this._nextVersion();
    }

    isListExpanded(): boolean {
        return this._isListExpanded;
    }

    private _needToCutColumnItems(columns: IAdditionalColumns): boolean {
        if (this._options.extendedItemsViewMode === 'row') {
            return false;
        }
        const leftColumnCount = columns.left.length;
        const rightColumnCount = columns.right.length;

        return (
            leftColumnCount > MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS + 1 ||
            rightColumnCount > MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS + 1
        );
    }

    /**
     * Возвращает все элементы, которые отображаются в "Можно отобрать" в сброшенном фильтре.
     */
    private _getAdditionalItems(): IFilterItem[] {
        return this._options.typeDescription.filter((item) => {
            return (
                viewModeFilter('extended', item) ||
                isFrequentFilterItem(item, this._options.viewMode) ||
                (viewModeFilter('basic', item) && item.editorOptions?.extendedCaption)
            );
        });
    }

    private _getAdditionalColumns(): IAdditionalColumns {
        const columns = {
            right: [],
            left: [],
        };

        const additionalItems = this._getAdditionalItems();
        const leftColumnCount = Math.ceil(additionalItems.length / 2);

        additionalItems.forEach((item, index) => {
            if (isExtendedItem(item, this._options.viewMode)) {
                if (index < leftColumnCount) {
                    columns.left.push(item);
                } else {
                    columns.right.push(item);
                }
            }
        });
        return columns;
    }

    getVisibleAdditionalColumns(): IAdditionalColumns {
        const columns = {...this._additionalColumns};

        const needToCut = this._needToCutColumnItems(columns);
        let maxCountVisibleItems = MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS;
        if (this._isListExpanded) {
            const extendedItems = getExtendedItems(this._options.typeDescription, this._options.viewMode);
            maxCountVisibleItems = extendedItems.length / 2;
        }

        if (!this._isListExpanded && needToCut) {
            columns.left = columns.left.slice(0, maxCountVisibleItems);
            columns.right = columns.right.slice(0, maxCountVisibleItems);
        }

        return columns;
    }

    needToCutColumnItems(): boolean {
        return this._needToCutColumnItems(this._additionalColumns);
    }

    /**
     * Возвращает элементы, которые сейчас отображаются в "Можно отобрать".
     */
    getExtendedFilterItems(): IFilterItem[] {
        return getExtendedItems(this._options.typeDescription, this._options.viewMode);
    }

    getEditingObjectValue(editorName: string,
                          editorValue: IExtendedPropertyValue): Record<string, IExtendedPropertyValue> {
        const editingObject = object.clone(this._options.editingObject);
        editingObject[editorName] = editorValue;
        return editingObject;
    }
}
