/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { IFilterItem, FilterUtils } from 'Controls/filter';
import { TemplateFunction } from 'UI/Base';
import IExtendedPropertyValue from '../_interface/IExtendedPropertyValue';
import { TPanelViewMode, TPanelOrientation } from 'Controls/_filterPanel/View';
import { isEqual } from 'Types/object';
import { VersionableMixin } from 'Types/entity';
import { mixin, object } from 'Types/util';
import * as coreClone from 'Core/core-clone';
import { RecordSet } from 'Types/collection';
import { NewSourceController, ISourceControllerOptions } from 'Controls/dataSource';
import { CollectionItem } from 'Controls/display';
import { IPropStorageOptions } from 'Controls/interface';
import {
    isFrequentFilterItem,
    getExtendedItems,
    getAdditionalItems,
    viewModeFilter,
    isExtendedItem,
} from './ExtendedItemsUtil';

export type TEditorsViewMode = 'cloud' | 'cloud|default' | 'default' | 'popupCloudPanelDefault';

interface IEditorsViewMode {
    editorsViewMode?: TEditorsViewMode;
}

interface IFilterViewMode {
    filterViewMode?: 'popup' | 'default';
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
    orientation?: TPanelOrientation;
}

interface IFilterGroup {
    caption?: string;
    afterEditorTemplate: TemplateFunction | string;
    groupVisible: boolean;
    resetButtonVisible: boolean;
    separatorVisibility: 'visible' | 'hidden';
    expanderVisible: boolean;
}

/**
 * Модель для представления редакторов на панели фильтров .
 * @private
 */
export default class FilterViewModel extends mixin<VersionableMixin>(VersionableMixin) {
    protected _source: IFilterItem[] = null;
    protected _editingObject: Record<string, unknown> = {};
    protected _collapsedGroups: string[] | number[] = [];
    protected _groupItems: Record<string, IFilterGroup>;
    protected _options: IFilterViewModelOptions;
    private _basicFilterItems: IFilterItem[];

    constructor(options: IFilterViewModelOptions) {
        super(options);
        this._options = options;
        this._source = this._getSource(coreClone(options.source), options);
        this._collapsedGroups = options.collapsedGroups || [];
        this._filterDescriptionChanged(this._source);
        this._groupItems = this._getGroupItemsBySource(this._source, options);
    }

    update(options: IFilterViewModelOptions): void {
        if (!isEqual(this._options.source, options.source)) {
            this._source = this._getSource(coreClone(options.source), options);
            this._filterDescriptionChanged(this._source);
            this._groupItems = this._getGroupItemsBySource(this._source, options);
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
        this._filterDescriptionChanged(this._source);
        this._groupItems = this._getGroupItemsBySource(this._source, this._options);
        this._nextVersion();
    }

    private _getSource(
        source: IFilterItem[],
        { editorsViewMode, filterViewMode, multiSelect }: IFilterViewModelOptions
    ): IFilterItem[] {
        const editorsViewModeChanged = editorsViewMode !== this._options.editorsViewMode;
        let result = source
            .filter((filterItem) => {
                return this._isFilterVisible(filterItem);
            })
            .map((item, index) => {
                const newItem = { ...item };
                const isDefaultViewMode = filterViewMode === 'default';
                const needCalcViewMode =
                    !this._source ||
                    editorsViewModeChanged ||
                    isDefaultViewMode ||
                    newItem.viewMode !== 'basic';

                if (!newItem.hasOwnProperty('editorCaption')) {
                    newItem.editorCaption =
                        typeof item.caption !== 'undefined' ? item.caption : item.group;
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

        if (filterViewMode === 'popup') {
            result = result.sort((item1, item2) => {
                // Если фильтр может менять состояние видимости, такой фильтр сортировать не нужно
                const canItem1VisibilityChanged =
                    item1.hasOwnProperty('visibility') &&
                    item1.filterVisibilityCallback &&
                    item1.viewMode !== 'extended';
                const canItem2VisibilityChanged =
                    item2.hasOwnProperty('visibility') &&
                    item2.filterVisibilityCallback &&
                    item2.viewMode !== 'extended';
                const isExtended1 = isExtendedItem(item1, this._options.viewMode);
                const isExtended2 = isExtendedItem(item2, this._options.viewMode);
                if (
                    canItem1VisibilityChanged ||
                    canItem2VisibilityChanged ||
                    isExtended1 === isExtended2
                ) {
                    return 0;
                }
                return isExtended2 ? -1 : 1;
            });
        }

        if (multiSelect === false && this._isReseted(result)) {
            this._setValueResetedFilter(result);
        }

        return result;
    }

    _filterDescriptionChanged(newDescription: IFilterItem[]): void {
        this._editingObject = this._getEditingObjectBySource(newDescription);
        this._basicFilterItems = this._getBasicFilterItems(newDescription);
    }

    private _isFilterVisible(filterItem: IFilterItem): boolean {
        const { isAdaptive, filterViewMode } = this._options;
        const isListEditor =
            filterItem.type === 'list' ||
            filterItem.editorTemplateName === 'Controls/filterPanel:ListEditor';
        const isBasicFilterItem =
            (viewModeFilter('basic', filterItem) || viewModeFilter('frequent', filterItem)) &&
            !this._getExtendedCaption(filterItem);
        const showInAdaptive =
            filterItem.isAdaptive !== false &&
            (filterViewMode === 'popup' ||
                !isListEditor ||
                (isBasicFilterItem && filterItem.editorOptions?.markerStyle === 'primary'));
        return filterItem.visibility !== false && (!isAdaptive || showInAdaptive);
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
            basicItems[0].value = editorOptions.multiSelect ? [selectedKey] : selectedKey;
        }
    }

    private _updateEditorOptionsByLoadedItems({ name }: IFilterItem, items: RecordSet): void {
        const itemIndex = this._getItemIndexByName(name, this._source);
        const newItem = { ...this._source[itemIndex] };
        newItem.editorOptions = { ...newItem.editorOptions };

        if (!newItem.editorOptions?.sourceController) {
            newItem.editorOptions.sourceController = new NewSourceController({
                ...newItem.editorOptions,
                items,
            } as ISourceControllerOptions);

            this._source = [...this._source];
            this._source[itemIndex] = newItem;
            this._filterDescriptionChanged(this._source);
            this._nextVersion();
        }
    }

    private _getEditingObjectBySource(source: IFilterItem[]): Record<string, unknown> {
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
        const firstBasicItemName = this._getFirstBasicItemName(source);
        source.forEach((item, itemIndex) => {
            groupsItems[item.name] = {
                caption: item.editorCaption,
                expanderVisible: editorsViewMode !== 'cloud' && item.expanderVisible,
                separatorVisibility: item.separatorVisibility,
                resetButtonVisible:
                    item.groupAlignment !== 'right' && !isEqual(item.value, item.resetValue),
                groupVisible: this._needShowCaption(item, editorsViewMode),
                afterEditorTemplate: item.editorOptions?.afterEditorTemplate,
                groupTextAlign: isPopup ? 'left' : item.groupTextAlign || 'left',
                groupExpanderAlign: isPopup ? 'left' : item.groupExpanderAlign || 'left',
                isFirst: firstBasicItemName === item.name,
            };
        });

        return groupsItems;
    }

    private _getFirstBasicItemName(source): string {
        return this._getBasicFilterItems(source)[0]?.name;
    }

    private _needShowCaption(
        item: IFilterItem,
        editorsViewMode: 'default' | 'cloud' | 'popupCloudPanelDefault'
    ): boolean {
        // rk на сервере создаёт инстанс String'a и проверка через typeof не работает
        const isCorrectCaption =
            typeof item.editorCaption === 'string' || item.editorCaption instanceof String;

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

    private _resetValueSourceItem(item: IFilterItem): void {
        item.value = item.resetValue;
        item.textValue = '';
    }

    private _setValueToSourceItem(item: IFilterItem, editorValue: object | unknown): void {
        item.value =
            editorValue && editorValue.hasOwnProperty('value') ? editorValue.value : editorValue;
    }

    private _setTextValueToSourceItem(item: IFilterItem, editorValue: object | unknown): void {
        if (
            this._options.editorsViewMode === 'popupCloudPanelDefault' &&
            editorValue?.textValue !== undefined
        ) {
            item.textValue = null;
        } else if (editorValue?.textValue !== undefined) {
            item.textValue = editorValue.textValue;
        }
    }

    private _setViewModeToSourceItem(item: IFilterItem, editorValue: object | unknown): void {
        const newViewMode = editorValue?.viewMode;
        item.editorOptions.viewMode = item.viewMode = this._getItemViewModeByValue(
            item,
            newViewMode
        );
    }

    private _resetSourceViewMode(): void {
        this._source.forEach((item) => {
            item.viewMode = this._getExtendedCaption(item) ? 'extended' : item.viewMode;
        });
    }

    private _getExtendedCaption(item: IFilterItem): string | void {
        return item.extendedCaption || item.editorOptions?.extendedCaption;
    }

    private _resetFilterItem(item: IFilterItem): void {
        const { filterViewMode, editorsViewMode } = this._options;
        item.value = item.resetValue;
        item.textValue = '';
        item.viewMode = this._getItemViewMode(item, filterViewMode, editorsViewMode);
        if (item.viewMode === 'extended') {
            this._deleteCachedDataFromItem(item);
        }
        if (this._options.multiSelect === false && this._isReseted(this._source)) {
            this._setValueResetedFilter(this._source);
        }
    }

    private _deleteCachedDataFromItem(item: IFilterItem): void {
        const originItemEditorOptions = this._getItemFromSourceByName(
            item.name,
            this._options.source
        )?.editorOptions;
        const editorOptions = item.editorOptions;

        if (!originItemEditorOptions?.sourceController && editorOptions?.sourceController) {
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

    private _getItemFromSourceByName(filterName: string, source: IFilterItem[]): IFilterItem {
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
                itemViewMode = extendedCaption && isValueReset ? viewMode : 'basic';
            } else if (extendedCaption) {
                itemViewMode = isValueReset ? 'extended' : 'basic';
            }
        } else if (editorsViewMode === 'default') {
            if (
                isExtendedItem(item, viewMode) &&
                item.expanderVisible &&
                item.editorOptions?.markerStyle !== 'primary'
            ) {
                itemViewMode = viewMode;
            } else {
                itemViewMode = 'basic';
            }
        } else if (editorsViewMode === 'cloud') {
            if (viewMode === 'frequent') {
                itemViewMode = extendedCaption && isValueReset ? viewMode : 'basic';
            } else if (!this._source && extendedCaption) {
                // Сбросываем фильтр в Можно отобрать, только при построении
                itemViewMode = isValueReset ? 'extended' : 'basic';
            } else if (!isValueReset) {
                // Т.к. в историю перестали сохранять viewMode, если фильтр изменен, нужно проставить 'basic'
                itemViewMode = 'basic';
            }
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
        if (
            filterViewMode !== 'default' ||
            (itemViewMode === 'basic' && editorsViewMode === 'cloud')
        ) {
            return 'm';
        }
    }

    private _getFilterItemEditorOptions(
        filterItem: IFilterItem,
        filterItemIndex: number,
        filterViewMode: string,
        editorsViewMode: string
    ): IFilterItem['editorOptions'] {
        const { viewMode, name, resetValue, emptyText, emptyKey, editorOptions, textValue } =
            filterItem;
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
            emptyKey: emptyKey !== undefined ? emptyKey : editorOptions?.emptyKey,
            fontSize: this._getFontSize(viewMode, filterViewMode, editorsViewMode),
            sourceController,
            items: editorOptions?.items ? editorOptions.items : sourceController?.getItems(),
            extendedCaption: this._getExtendedCaption(filterItem),
            isAdaptive: filterItem.isAdaptive,
            expanderVisible: filterItem.expanderVisible,
            contrastBackground: this._options.orientation === 'horizontal',
            filterIndex: filterItemIndex,
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
                isFrequentFilterItem(
                    item,
                    this._options.filterViewMode,
                    this._options.editorsViewMode
                ) && !isEqual(item.value, item.resetValue)
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
            return (isBasicByViewMode(item) || isBasicByValue(item)) && isVisibleByUser(item);
        });
    }

    getBasicFilterItems(): IFilterItem[] {
        return this._getBasicFilterItems(this._source);
    }

    /**
     * Возвращает элементы, которые сейчас отображаются в "Можно отобрать".
     */
    getExtendedFilterItems(): IFilterItem[] {
        return getExtendedItems(this._source, this._options.filterViewMode);
    }

    setEditingObject(editingObject: Record<string, IExtendedPropertyValue>): void {
        this._editingObject = editingObject;
        this._source = this._getSource(this._source, this._options);

        const needResetValueUnchangedItems = this._needResetValueUnchangedItems(editingObject);
        this._source.forEach((item) => {
            const editingItemProperty = editingObject[item.name];
            if (needResetValueUnchangedItems && isEqual(item.value, editingItemProperty)) {
                this._resetValueSourceItem(item);
            } else {
                this._setValueToSourceItem(item, editingItemProperty);
            }
            this._setTextValueToSourceItem(item, editingItemProperty);
            this._setViewModeToSourceItem(item, editingItemProperty);
        });
        this._groupItems = this._getGroupItemsBySource(this._source, this._options);
        this._filterDescriptionChanged(this._source);
        this._nextVersion();
    }

    private _needResetValueUnchangedItems(
        editingObject: Record<string, IExtendedPropertyValue>
    ): boolean {
        let needResetValueUnchangedItems = false;
        if (this._options.multiSelect === false) {
            // В случае когда может быть выбран только один из фильтров.
            // если какой-то фильтр поменял значение, остальные нужно сбросить
            needResetValueUnchangedItems = Object.keys(editingObject).some((key) => {
                const editorValue = editingObject[key];
                const newValue =
                    editorValue && editorValue.hasOwnProperty('value')
                        ? editorValue.value
                        : editorValue;
                return !isEqual(newValue, this._getItemFromSourceByName(key, this._source).value);
            });
        }
        return needResetValueUnchangedItems;
    }

    private _getItemViewModeByValue(item: IFilterItem, newViewMode: string): 'basic' | 'extended' {
        const viewModeChanged = newViewMode && newViewMode !== item.viewMode;
        if (viewModeChanged) {
            if (item.viewMode === 'basic') {
                item.value = item.resetValue;
                this._deleteCachedDataFromItem(item);
            }
            return newViewMode;
        }
        if (item.viewMode === 'extended' && !isEqual(item.value, item.resetValue)) {
            return 'basic';
        }
        return item.viewMode;
    }

    setViewModeForItem(filterName: string, viewMode: IFilterItem['viewMode']): void {
        const source = object.clonePlain(this._source);
        const item = this._getItemFromSourceByName(filterName, source);

        item.viewMode = viewMode;
        item.editorOptions.viewMode = viewMode;

        this._source = source;
        this._filterDescriptionChanged(this._source);
        this._nextVersion();
    }

    isFilterReseted(): boolean {
        return !this._source.some((item) => {
            return !isEqual(item.value, item.resetValue);
        });
    }

    hasExtendedItems(): boolean {
        return !!getExtendedItems(this._source, this._options.filterViewMode).length;
    }

    hasAdditionalItems(): boolean {
        return !!getAdditionalItems(this._source, this._options.viewMode);
    }

    hasBasicItems(): boolean {
        return !!this.getBasicFilterItems().length;
    }

    getGroupItems(): Record<string, IFilterGroup> {
        return this._groupItems;
    }

    getCollapsedGroups(): string[] | number[] {
        return this._options.editorsViewMode !== 'cloud' ? this._collapsedGroups : [];
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
        this._filterDescriptionChanged(this._source);
        this._groupItems = this._getGroupItemsBySource(this._source, this._options);
        this._nextVersion();
    }

    resetFilterItem(name: string): void {
        this._source = coreClone(this._source);
        const item = this._source.find((filterItem) => {
            return filterItem.name === name;
        });
        this._resetFilterItem(item);
        this._filterDescriptionChanged(this._source);
        this._groupItems = this._getGroupItemsBySource(this._source, this._options);
        this._nextVersion();
    }

    needShowSeparator(): boolean {
        // Общий разделись с кнопкой сбросить у панели фильтров
        // должен выводиться только для режима с "облачками"
        return (
            this._options.editorsViewMode === 'cloud' &&
            this.hasBasicItems() &&
            this._source.some((item) => {
                return item.viewMode === 'extended' || this._getExtendedCaption(item);
            })
        );
    }

    getItemClasses(
        item: CollectionItem,
        viewMode: TPanelViewMode,
        isAdaptive: boolean,
        orientation: TPanelOrientation
    ): string {
        const isLastItem = item.isLastItem();
        const isLast = isLastItem
            ? getExtendedItems(this._source, this._options.filterViewMode).length
                ? '_last'
                : '_last-without-extended-items'
            : '';
        const isLastAdaptiveItem =
            isLastItem && (item.getContents().get('isAdaptive') || isAdaptive) ? '_adaptive' : '';
        const isPopupHorizontalItem =
            viewMode === 'popup' && !isLastAdaptiveItem ? `-${orientation}` : '';
        let resultClass = `controls-FilterViewPanel__propertyGrid_itemTemplate
                controls-FilterViewPanel__propertyGrid_itemTemplate_viewMode-${viewMode}${isPopupHorizontalItem}${isLast}${isLastAdaptiveItem}`;
        if (this._getFirstBasicItemName(this._source) !== item.contents.get('name')) {
            const hasCaption = item.getContents().get('editorCaption')
                ? '_with-editorCaption'
                : '_without-editorCaption';
            resultClass += ` controls-FilterViewPanel__propertyGrid_itemTemplate_viewMode-${viewMode}${hasCaption}`;
        }
        return resultClass;
    }

    needCloseItemByCaptionClick(filterName: string): boolean {
        const item = this._getItemFromSourceByName(filterName, this._source);
        return item.expanderVisible && !!item.extendedCaption;
    }
}
