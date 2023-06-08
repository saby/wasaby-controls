/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IFilterItem, FilterUtils } from 'Controls/filter';
import { TemplateFunction } from 'UI/Base';
import IExtendedPropertyValue from '../_interface/IExtendedPropertyValue';
import { TPanelViewMode } from 'Controls/_filterPanel/View';
import { isEqual } from 'Types/object';
import { VersionableMixin } from 'Types/entity';
import { mixin, object } from 'Types/util';
import * as coreClone from 'Core/core-clone';
import { MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS } from 'Controls/_filterPanel/Constants';
import { RecordSet } from 'Types/collection';
import {
    NewSourceController,
    ISourceControllerOptions,
} from 'Controls/dataSource';
import { CollectionItem } from 'Controls/display';
import { IPropStorageOptions } from 'Controls/interface';

export type TEditorsViewMode = 'cloud' | 'default' | 'popupCloudPanelDefault';

interface IEditorsViewMode {
    editorsViewMode?: TEditorsViewMode;
}

interface IFilterViewMode {
    filterViewMode?: 'popup' | 'default';
}

interface IAdditionalColumns {
    left: IFilterItem[];
    right: IFilterItem[];
}

export interface IFilterViewModelOptions
    extends IEditorsViewMode,
        IFilterViewMode,
        IPropStorageOptions {
    source: IFilterItem[];
    collapsedGroups?: string[] | number[];
    filterViewMode?: string;
    viewMode?: TPanelViewMode;
    style?: string;
    multiSelect?: boolean;
    isAdaptive?: boolean;
}

interface IFilterGroup {
    caption?: string;
    afterEditorTemplate: TemplateFunction | string;
    groupVisible: boolean;
    resetButtonVisible: boolean;
    separatorVisibility: 'visible' | 'hidden';
    expanderVisible: boolean;
}

function viewModeFilter(
    filterByViewMode: IFilterItem['viewMode'],
    { viewMode }: IFilterItem
): boolean {
    return (
        viewMode === filterByViewMode ||
        (filterByViewMode === 'basic' && !viewMode)
    );
}

export default class FilterViewModel extends mixin<VersionableMixin>(
    VersionableMixin
) {
    protected _source: IFilterItem[] = null;
    protected _editingObject: Record<string, unknown> = {};
    protected _collapsedGroups: string[] | number[] = [];
    protected _groupItems: Record<string, IFilterGroup>;
    protected _options: IFilterViewModelOptions;

    constructor(options: IFilterViewModelOptions) {
        super(options);
        VersionableMixin.call(this, options);
        this._options = options;
        this._source = this._getSource(options.source, options);
        this._collapsedGroups = options.collapsedGroups || [];
        this._editingObject = this._getEditingObjectBySource(this._source);
        this._groupItems = this._getGroupItemsBySource(this._source, options);
    }

    update(options: IFilterViewModelOptions): void {
        if (!isEqual(this._options.source, options.source)) {
            this._source = this._getSource(options.source, options);
            this._editingObject = this._getEditingObjectBySource(this._source);
            this._groupItems = this._getGroupItemsBySource(
                this._source,
                options
            );
            this._nextVersion();
        }

        if (!isEqual(this._options.collapsedGroups, options.collapsedGroups)) {
            this._collapsedGroups = options.collapsedGroups;
            this._nextVersion();
        }

        this._options = options;
    }

    setSource(source: IFilterItem[]): void {
        this._source = this._getSource(source, this._options);
        this._editingObject = this._getEditingObjectBySource(this._source);
        this._groupItems = this._getGroupItemsBySource(
            this._source,
            this._options
        );
        this._nextVersion();
    }

    private _getSource(
        source: IFilterItem[],
        {
            editorsViewMode,
            filterViewMode,
            multiSelect,
        }: IFilterViewModelOptions
    ): IFilterItem[] {
        const editorsViewModeChanged =
            editorsViewMode !== this._options.editorsViewMode;
        const result = source
            .filter((filterItem) => {
                return this._isFilterVisible(filterItem);
            })
            .map((item, index) => {
                const newItem = { ...item };
                const isFrequentItem = item.viewMode === 'frequent';
                const isDefaultViewMode = filterViewMode === 'default';
                const needCalcViewMode =
                    !this._source ||
                    editorsViewModeChanged ||
                    isDefaultViewMode ||
                    isFrequentItem ||
                    !newItem.viewMode;

                if (!newItem.hasOwnProperty('editorCaption')) {
                    newItem.editorCaption =
                        typeof item.caption !== 'undefined'
                            ? item.caption
                            : item.group;
                }
                newItem.caption = '';
                if (needCalcViewMode) {
                    newItem.viewMode = this._getItemViewMode(
                        item,
                        filterViewMode,
                        editorsViewMode,
                        editorsViewModeChanged
                    );
                }
                newItem.editorOptions = {
                    ...this._getFilterItemEditorOptions(
                        newItem,
                        index,
                        filterViewMode,
                        editorsViewMode
                    ),
                    viewMode: newItem.viewMode,
                    editorsViewMode,
                };
                return newItem;
            });

        if (multiSelect === false && this._isReseted(result)) {
            this._setValueResetedFilter(result);
        }

        return result;
    }

    private _isFilterVisible(filterItem: IFilterItem): boolean {
        const { isAdaptive, filterViewMode } = this._options;
        const isBasicFilterItem =
            viewModeFilter('basic', filterItem) &&
            !this._getExtendedCaption(filterItem);
        return (
            filterItem.visibility !== false &&
            (!isAdaptive || filterViewMode === 'popup' || isBasicFilterItem)
        );
    }

    private _isReseted(source: IFilterItem[]): boolean {
        return !source.some((item) => {
            return !isEqual(item.value, item.resetValue);
        });
    }

    private _setValueResetedFilter(source: IFilterItem[]): void {
        const basicItems = this._getBasicFilterItems(source);
        if (basicItems.length) {
            const editorOptions = basicItems[0].editorOptions;
            const selectedKey = editorOptions.emptyKey;
            basicItems[0].value = editorOptions.multiSelect
                ? [selectedKey]
                : selectedKey;
        }
    }

    private _updateEditorOptionsByLoadedItems(
        { name }: IFilterItem,
        items: RecordSet
    ): void {
        const itemIndex = this._getItemIndexByName(name, this._source);
        const newItem = { ...this._source[itemIndex] };

        if (!newItem.editorOptions?.sourceController) {
            newItem.editorOptions.sourceController = new NewSourceController({
                ...newItem.editorOptions,
                items,
            } as ISourceControllerOptions);

            this._source = [...this._source];
            this._source[itemIndex] = newItem;
            this._nextVersion();
        }
    }

    private _getEditingObjectBySource(
        source: IFilterItem[]
    ): Record<string, unknown> {
        const editingObject = {};
        source.forEach((item) => {
            editingObject[item.name] = item.value;
        });

        return editingObject;
    }

    private _getGroupItemsBySource(
        source: IFilterItem[],
        { editorsViewMode, filterViewMode }: Partial<IFilterViewModelOptions>
    ): Record<string, IFilterGroup> {
        const isPopup = filterViewMode === 'popup';
        const groupsItems = {};
        source.forEach((item, itemIndex) => {
            groupsItems[item.name] = {
                caption: item.editorCaption,
                expanderVisible:
                    editorsViewMode !== 'cloud' && item.expanderVisible,
                separatorVisibility: item.separatorVisibility,
                resetButtonVisible:
                    item.groupAlignment !== 'right' &&
                    !isEqual(item.value, item.resetValue),
                groupVisible: this._needShowCaption(item, editorsViewMode),
                afterEditorTemplate: item.editorOptions?.afterEditorTemplate,
                groupTextAlign: isPopup
                    ? 'left'
                    : item.groupTextAlign || 'left',
                groupExpanderAlign: isPopup
                    ? 'left'
                    : item.groupExpanderAlign || 'left',
            };
        });

        return groupsItems;
    }

    private _needShowCaption(
        item: IFilterItem,
        editorsViewMode: 'default' | 'cloud' | 'popupCloudPanelDefault'
    ): boolean {
        // rk на сервере создаёт инстанс String'a и проверка через typeof не работает
        const isCorrectCaption =
            typeof item.editorCaption === 'string' ||
            item.editorCaption instanceof String;

        if (editorsViewMode === 'cloud') {
            return isCorrectCaption && item.editorCaption;
        } else {
            return (
                isCorrectCaption &&
                (item.editorOptions?.markerStyle !== 'primary' ||
                    editorsViewMode === 'popupCloudPanelDefault')
            );
        }
    }

    private _setValueToSourceItem(
        item: IFilterItem,
        editorValue: object | unknown
    ): void {
        if (
            this._options.multiSelect === false &&
            isEqual(item.value, editorValue)
        ) {
            item.value = item.resetValue;
            item.textValue = '';
        } else {
            item.value =
                editorValue?.value === undefined
                    ? editorValue
                    : editorValue?.value;
            if (editorValue?.textValue !== undefined) {
                item.textValue = editorValue.textValue;
            }
        }
        if (
            this._options.editorsViewMode === 'popupCloudPanelDefault' &&
            editorValue?.textValue !== undefined
        ) {
            item.textValue = null;
        }
    }

    private _resetSourceViewMode(): void {
        this._source.forEach((item) => {
            item.viewMode = this._getExtendedCaption(item)
                ? 'extended'
                : item.viewMode;
        });
    }

    private _getExtendedCaption(item: IFilterItem): string | void {
        return item.extendedCaption || item.editorOptions?.extendedCaption;
    }

    private _resetFilterItem(item: IFilterItem): void {
        const { filterViewMode, editorsViewMode } = this._options;
        item.value = item.resetValue;
        item.textValue = '';
        item.viewMode = this._getItemViewMode(
            item,
            filterViewMode,
            editorsViewMode
        );
        if (item.viewMode === 'extended') {
            this._deleteCachedDataFromItem(item);
        }
        if (
            this._options.multiSelect === false &&
            this._isReseted(this._source)
        ) {
            this._setValueResetedFilter(this._source);
        }
    }

    private _deleteCachedDataFromItem(item: IFilterItem): void {
        const originItemEditorOptions = this._getItemFromSourceByName(
            item.name,
            this._options.source
        )?.editorOptions;
        const editorOptions = item.editorOptions;

        if (
            !originItemEditorOptions?.sourceController &&
            editorOptions?.sourceController
        ) {
            editorOptions.sourceController = null;
        }

        if (!originItemEditorOptions?.items && editorOptions?.items) {
            editorOptions.items = null;
        }
    }

    private _getItemIndexByName(name: string, source: IFilterItem[]): number {
        return source.findIndex((item) => {
            return item.name === name;
        });
    }

    private _getItemFromSourceByName(
        filterName: string,
        source: IFilterItem[]
    ): IFilterItem {
        return source[this._getItemIndexByName(filterName, source)];
    }

    private _getItemViewMode(
        item: IFilterItem,
        filterViewMode: string,
        editorsViewMode: string,
        editorsViewModeChanged?: boolean
    ): 'basic' | 'extended' | 'frequent' {
        const viewMode = item.viewMode;
        const isValueReset = isEqual(item.value, item.resetValue);
        const extendedCaption = this._getExtendedCaption(item);
        let itemViewMode = viewMode || 'basic';
        if (filterViewMode === 'popup') {
            if (viewMode === 'frequent') {
                itemViewMode =
                    extendedCaption && isValueReset ? viewMode : 'basic';
            } else if (extendedCaption) {
                itemViewMode = isValueReset ? 'extended' : 'basic';
            }
        } else if (editorsViewMode === 'default') {
            itemViewMode = 'basic';
        } else if (editorsViewModeChanged) {
            return this._getItemViewModeByValue(item, itemViewMode);
        }
        return itemViewMode;
    }

    private _getFontSize(
        itemViewMode: string,
        filterViewMode: string,
        editorsViewMode: string
    ): 'm' | 'l' {
        if (filterViewMode !== 'default') {
            return itemViewMode === 'basic' || itemViewMode === 'frequent'
                ? 'l'
                : 'm';
        } else if (itemViewMode === 'basic' && editorsViewMode === 'cloud') {
            return 'm';
        }
    }

    private _isFrequentFilterItem(item: IFilterItem): boolean {
        if (this._options.filterViewMode === 'popup') {
            return viewModeFilter('frequent', item);
        }
        return false;
    }

    private _isExtendedItem(item: IFilterItem): boolean {
        return (
            viewModeFilter('extended', item) ||
            (this._isFrequentFilterItem(item) &&
                isEqual(item.value, item.resetValue))
        );
    }

    private _getFilterItemEditorOptions(
        filterItem: IFilterItem,
        filterItemIndex: number,
        filterViewMode: string,
        editorsViewMode: string
    ): IFilterItem['editorOptions'] {
        const {
            viewMode,
            name,
            resetValue,
            emptyText,
            emptyKey,
            editorOptions,
            textValue,
        } = filterItem;
        let sourceController = editorOptions?.sourceController;

        // Этот код пока нужен для панелей,
        // которые используются вне SabyPage или Browser'a (например на sbis.ru).
        // при перестроении панели (например выбрали 'extended' фильтр) inferno может разрушить редактор,
        // и чтобы при mount'e не было запроса за данными, надо взять закэшированный sourceController
        // Этот код пока нужен для панелей,
        // которые используются вне SabyPage или Browser'a (например на sbis.ru).
        // при перестроении панели (например выбрали 'extended' фильтр) inferno может разрушить редактор,
        // и чтобы при mount'e не было запроса за данными, надо взять закэшированный sourceController
        const oldSourceItem = this._source?.[filterItemIndex];
        if (
            !sourceController &&
            oldSourceItem?.name === name &&
            oldSourceItem?.editorOptions?.source === editorOptions?.source
        ) {
            sourceController = oldSourceItem?.editorOptions?.sourceController;
        }

        if (
            !sourceController &&
            editorOptions?.items &&
            editorOptions?.items instanceof RecordSet
        ) {
            sourceController = new NewSourceController({
                ...editorOptions,
            } as ISourceControllerOptions);
        }
        const itemEditorOptions = {
            ...editorOptions,
            name,
            viewMode,
            filterViewMode,
            resetValue,
            textValue,
            emptyText: emptyText || editorOptions?.emptyText,
            emptyKey:
                emptyKey !== undefined ? emptyKey : editorOptions?.emptyKey,
            selectedAllText: editorOptions?.selectedAllText,
            selectedAllKey: editorOptions?.selectedAllKey,
            fontSize: this._getFontSize(
                viewMode,
                filterViewMode,
                editorsViewMode
            ),
            sourceController,
            items: sourceController
                ? sourceController.getItems()
                : editorOptions?.items,
            extendedCaption: this._getExtendedCaption(filterItem),
            isAdaptive: filterItem.isAdaptive,
        };
        if (!itemEditorOptions?.sourceController) {
            itemEditorOptions.dataLoadCallback = (items, direction) => {
                if (!direction) {
                    this._updateEditorOptionsByLoadedItems(filterItem, items);
                }
            };
        }

        return itemEditorOptions;
    }

    private _getBasicFilterItems(source: IFilterItem[]): IFilterItem[] {
        const isBasicByViewMode = (item) => {
            return viewModeFilter('basic', item);
        };
        const isBasicByValue = (item) => {
            return (
                this._isFrequentFilterItem(item) &&
                !isEqual(item.value, item.resetValue)
            );
        };
        const isVisibleByUser = (item) => {
            return (
                this._options.filterViewMode === 'popup' ||
                item.userVisibility === undefined ||
                item.userVisibility === true
            );
        };

        return source.filter((item) => {
            return (
                (isBasicByViewMode(item) || isBasicByValue(item)) &&
                isVisibleByUser(item)
            );
        });
    }

    private _needToCutColumnItems(columns: IAdditionalColumns): boolean {
        const leftColumnCount = columns.left.length;
        const rightColumnCount = columns.right.length;

        return (
            leftColumnCount > MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS + 1 ||
            rightColumnCount > MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS + 1
        );
    }

    private _getAdditionalColumns(): IAdditionalColumns {
        const columns = {
            right: [],
            left: [],
        };

        const additionalItems = this.getAdditionalItems();
        const leftColumnCount = Math.ceil(additionalItems.length / 2);

        additionalItems.forEach((item, index) => {
            if (this._isExtendedItem(item)) {
                if (index < leftColumnCount) {
                    columns.left.push(item);
                } else {
                    columns.right.push(item);
                }
            }
        });
        return columns;
    }

    getAdditionalColumns(
        isAdditionalListExpanded: boolean
    ): IAdditionalColumns {
        const columns = this._getAdditionalColumns();

        const needToCut = this._needToCutColumnItems(columns);
        let maxCountVisibleItems = MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS;
        if (isAdditionalListExpanded) {
            const extendedItems = this.getExtendedFilterItems();
            maxCountVisibleItems = extendedItems.length / 2;
        }

        if (!isAdditionalListExpanded && needToCut) {
            columns.left = columns.left.slice(0, maxCountVisibleItems);
            columns.right = columns.right.slice(0, maxCountVisibleItems);
        }

        return columns;
    }

    needToCutColumnItems(): boolean {
        const columns = this._getAdditionalColumns();
        return this._needToCutColumnItems(columns);
    }

    getBasicFilterItems(): IFilterItem[] {
        return this._getBasicFilterItems(this._source);
    }

    /**
     * Возвращает элементы, которые сейчас отображаются в "Можно отобрать".
     */
    getExtendedFilterItems(): IFilterItem[] {
        return this._source.filter((item) => {
            return this._isExtendedItem(item);
        });
    }

    /**
     * Возвращает все элементы, которые отображаются в "Можно отобрать" в сброшенном фильтре.
     */
    getAdditionalItems(): IFilterItem[] {
        return this._source.filter((item) => {
            return (
                viewModeFilter('extended', item) ||
                this._isFrequentFilterItem(item) ||
                (viewModeFilter('basic', item) &&
                    item.editorOptions?.extendedCaption)
            );
        });
    }

    setEditingObject(
        editingObject: Record<string, IExtendedPropertyValue>
    ): void {
        this._editingObject = editingObject;
        this._source = this._getSource(this._source, this._options);
        this._source.forEach((item) => {
            const editingItemProperty = editingObject[item.name];
            this._setValueToSourceItem(item, editingItemProperty);
            const newViewMode = editingItemProperty?.viewMode;
            item.viewMode = this._getItemViewModeByValue(item, newViewMode);
        });
        this._groupItems = this._getGroupItemsBySource(
            this._source,
            this._options
        );
        this._editingObject = this._getEditingObjectBySource(this._source);
        this._nextVersion();
    }

    private _getItemViewModeByValue(
        item: IFilterItem,
        newViewMode: string
    ): 'basic' | 'extended' {
        const viewModeChanged = newViewMode && newViewMode !== item.viewMode;
        if (viewModeChanged) {
            if (item.viewMode === 'basic') {
                item.value = item.resetValue;
                this._deleteCachedDataFromItem(item);
            }
            return newViewMode;
        }
        if (
            item.viewMode === 'extended' &&
            !isEqual(item.value, item.resetValue)
        ) {
            return 'basic';
        }
        return item.viewMode;
    }

    setEditingObjectValue(
        editorName: string,
        editorValue: object | unknown
    ): void {
        const source = coreClone(this._source);
        const item = this._getItemFromSourceByName(editorName, source);
        if (item.viewMode === 'extended') {
            item.viewMode = 'basic';
        }
        this._setValueToSourceItem(item, editorValue);
        this._source = source;
        this._editingObject = this._getEditingObjectBySource(this._source);
        this._nextVersion();
    }

    setViewModeForItem(
        filterName: string,
        viewMode: IFilterItem['viewMode']
    ): void {
        const source = object.clonePlain(this._source);
        const item = this._getItemFromSourceByName(filterName, source);

        item.viewMode = viewMode;
        item.editorOptions?.viewMode = viewMode;

        this._source = source;
        this._nextVersion();
    }

    isFilterReseted(): boolean {
        return !this._source.some((item) => {
            return !isEqual(item.value, item.resetValue);
        });
    }

    hasExtendedItems(): boolean {
        return !!this.getExtendedFilterItems().length;
    }

    hasBasicItems(): boolean {
        return !!this.getBasicFilterItems().length;
    }

    getGroupItems(): Record<string, IFilterGroup> {
        return this._groupItems;
    }

    getCollapsedGroups(): string[] | number[] {
        return this._collapsedGroups;
    }

    getEditingObject(): Record<string, unknown> {
        return this._editingObject;
    }

    getSource(): IFilterItem[] {
        return this._source;
    }

    resetFilter(): void {
        this._source = coreClone(this._source);
        FilterUtils.resetFilter(this._source);
        this._resetSourceViewMode();
        this._collapsedGroups = [];
        this._editingObject = this._getEditingObjectBySource(this._source);
        this._groupItems = this._getGroupItemsBySource(
            this._source,
            this._options
        );
        this._nextVersion();
    }

    resetFilterItem(name: string): void {
        this._source = coreClone(this._source);
        const item = this._source.find((filterItem) => {
            return filterItem.name === name;
        });
        this._resetFilterItem(item);
        this._editingObject = this._getEditingObjectBySource(this._source);
        this._groupItems = this._getGroupItemsBySource(
            this._source,
            this._options
        );
        this._nextVersion();
    }

    needShowSeparator(): boolean {
        // Общий разделись с кнопкой сбросить у панели фильтров
        // должен выводиться только для режима с "облачками"
        return (
            this._options.editorsViewMode === 'cloud' &&
            this.hasBasicItems() &&
            this._source.some((item) => {
                return (
                    item.viewMode === 'extended' ||
                    this._getExtendedCaption(item)
                );
            })
        );
    }

    getItemClasses(
        item: CollectionItem,
        viewMode: TPanelViewMode,
        isAdaptive: boolean
    ): string {
        const isLastItem = item.isLastItem();
        const isLast = isLastItem
            ? this.getExtendedFilterItems().length
                ? '_last'
                : '_last-without-extended-items'
            : '';
        const isLastAdaptiveItem =
            isLastItem && (item.getContents().get('isAdaptive') || isAdaptive)
                ? '_adaptive'
                : '';
        return `controls-FilterViewPanel__propertyGrid_itemTemplate
                controls-FilterViewPanel__propertyGrid_itemTemplate_viewMode-${viewMode}${isLast}${isLastAdaptiveItem}`;
    }
}
