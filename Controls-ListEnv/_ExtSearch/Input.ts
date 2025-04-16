/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { TemplateFunction, Control } from 'UI/Base';
import type { ILookupInputOptions } from 'Controls/lookup';
import * as template from 'wml!Controls-ListEnv/_ExtSearch/Input';
import { SyntheticEvent } from 'UI/Events';
import { Model } from 'Types/entity';
import { IFilterItem, IFilterDescriptionProps } from 'Controls/filter';
import { List, RecordSet } from 'Types/collection';
import type { ISuggestListsOptions } from 'Controls-ListEnv/extSearchPopup';
import SuggestSearch from 'Controls-ListEnv/SuggestSearch';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { TFilter, IComponentProps } from 'Controls/interface';
import { IStackPopupOptions } from 'Controls/popup';
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { constants } from 'Env/Env';
import 'css!Controls-ListEnv/ExtSearch';

interface ISuggestFooterTemplate {
    templateName: string;
    templateOptions: object;
}

type Key = string | number | null;
export type SelectedItems = RecordSet | List<Model> | List<void>;

const RESET_SEARCH_STATE = { searchValue: '', searchInputValue: '' };

function getLookupLib(): Promise<typeof import('Controls/lookup')> {
    return loadAsync<typeof import('Controls/lookup')>('Controls/lookup');
}

interface IExtSearchInputProps extends IComponentProps, IFilterDescriptionProps {}

class Input extends Control {
    protected _template: TemplateFunction = template;
    protected _suggestSettingsOptions: IFilterItem[];
    protected _suggestListsOptions: Record<string, ISuggestListsOptions>;
    protected _isSettingsButtonVisible: boolean;
    protected _filterDescription: IFilterItem[];
    protected _keyProperty: string;
    protected _searchParam: string;
    protected _footerTemplate: ISuggestFooterTemplate;
    protected _selectorTabId: Key;
    protected _needShowSettings: boolean = false;
    protected _onlySettings: boolean;
    protected _children: {
        layout: typeof SuggestSearch;
    };
    protected _items: List<Model>;
    private _isOpened: boolean;

    protected _beforeMount(options: IExtSearchInputProps): void {
        this._items = options.items;
        this._prepareSuggestData(options.filterDescription || options.filterSource);
        this._updateFilterSource = this._updateFilterSource.bind(this);
    }

    protected _beforeUpdate(options: IExtSearchInputProps): void {
        if (
            this._options.filterDescription !== options.filterDescription ||
            this._options.filterSource !== options.filterSource
        ) {
            this._prepareSuggestData(options.filterDescription || options.filterSource);
        }
        if (this._options.items !== options.items) {
            this._items = options.items;
        }
    }

    protected _prepareSuggestData(filterDescription: IFilterItem[]): void {
        this._suggestSettingsOptions = this._makeSuggestOptions(
            filterDescription,
            'settings'
        ) as IFilterItem[];
        this._suggestListsOptions = this._makeSuggestOptions(filterDescription, 'list') as Record<
            string,
            ISuggestListsOptions
        >;
        this._onlySettings = !!this._suggestSettingsOptions?.length && !this._suggestListsOptions;
        if (!this._isOpened) {
            this._isSettingsButtonVisible = this._onlySettings;
        }
        this._filterDescription = this._getClonedFilterDescription(filterDescription);
        if (!this._suggestListsOptions) {
            return;
        }
        const keys = Object.keys(this._suggestListsOptions);
        this._maxVisibleItems = keys.length;
        this._keyProperty = this._suggestListsOptions[keys[0]].keyProperty;
        this._searchParam = this._suggestListsOptions[keys[0]].searchParam;
        Object.keys(this._suggestListsOptions).forEach((key) => {
            if (this._suggestListsOptions[key].hasOwnProperty('footerTemplate')) {
                this._footerTemplate = this._suggestListsOptions[key].footerTemplate;
            }
        });
    }

    private _makeSuggestOptions(
        filterDescription: IFilterItem[],
        optionsType: 'list' | 'settings'
    ): IFilterItem[] | Record<string, ISuggestListsOptions> {
        if (optionsType === 'settings') {
            return filterDescription.filter(({ editorTemplateName, category }) => {
                return !this._isSuggestFilterItem(editorTemplateName, category);
            });
        }
        if (optionsType === 'list') {
            const listOptionsItems = filterDescription.filter(
                ({ editorTemplateName, category }) => {
                    return this._isSuggestFilterItem(editorTemplateName, category);
                }
            );
            if (!listOptionsItems.length) {
                return;
            }
            const listOptions = {};
            listOptionsItems.forEach((item, index) => {
                const editorOptions = item.editorOptions;
                listOptions[item.name] = {
                    ...editorOptions,
                    order: index,
                    caption: item.caption,
                    id: item.name,
                    source: editorOptions.suggestSource || editorOptions.source,
                    items: editorOptions.sourceController ? null : editorOptions.items,
                    navigation: editorOptions.suggestNavigation || editorOptions.navigation,
                    filter: this._getSuggestFilter(item),
                    searchParam: item.searchParam,
                    editorTemplateName: item.editorTemplateName,
                    editorViewMode: item.viewMode,
                    category: item.category,
                    fix1193364926: editorOptions.fix1193364926,
                };
            });
            return listOptions;
        }
    }

    private _getClonedFilterDescription(filterItems: IFilterItem[]): IFilterItem[] {
        return filterItems.map((item) => {
            return { ...item };
        });
    }

    private _getSuggestFilter({ editorOptions }: IFilterItem): TFilter {
        const filter = { ...editorOptions.filter };
        delete filter[editorOptions.keyProperty];
        return filter;
    }

    protected _settingsButtonClick(): void {
        this._isOpened = true;
        this._children.layout.openSuggest();
        this._needShowSettings = this._onlySettings ? this._onlySettings : !this._needShowSettings;
    }

    protected _updateFilterSource(filter: object): void {
        const keys = Object.keys(filter);
        const filterDescription = object.clonePlain(this._filterDescription);
        keys.forEach((key) => {
            const selectedItem = filterDescription.find((filterItem) => {
                return filterItem.name === key;
            });
            selectedItem.value = filter[key];
        });
        this._notifyFilterSource(filterDescription);
    }

    protected _searchClick(): void {
        if (this._suggestSettingsOptions?.length) {
            this._notifyFilterSource(this._filterDescription);
        }
        this._closeSuggest();
    }

    protected _closeSuggest(): void {
        this._children.layout.closeSuggest();
        this._isOpened = false;
        this._isSettingsButtonVisible = this._onlySettings;
        this._needShowSettings = this._onlySettings;
    }

    protected _onSuggestOpen(): void {
        this._isOpened = true;
        this._isSettingsButtonVisible =
            !!this._suggestSettingsOptions?.length && this._suggestListsOptions;
        if (this._options.onSuggestOpen) {
            this._options.onSuggestOpen();
        }
    }

    protected _onSuggestClose(): void {
        this._isSettingsButtonVisible = this._onlySettings;
        this._needShowSettings = this._onlySettings;
        this._isOpened = false;
        if (this._options.onSuggestClose) {
            this._options.onSuggestClose();
        }
    }

    protected _valueChanged(event: Event, value: string): void {
        this._notify('valueChanged', [value]);
    }

    protected _notifyFilterSource(
        filterDescription: IFilterItem[],
        additionalState?: unknown
    ): void {
        if (!isEqual(this._options.filterDescription, filterDescription)) {
            this._notify('filterDescriptionChanged', [filterDescription, additionalState]);
        }
    }

    protected _choose(event: SyntheticEvent, item: Model, tabsSelectedKey?: string): boolean {
        this.activate({ enableScreenKeyboard: true });
        this._notify('valueChanged', ['']);
        getLookupLib().then(() => {
            this._addItem(item, tabsSelectedKey);
        });
        return false;
    }

    private _itemClick(): void {
        this._closeSuggest();
    }

    private _keyDown(event: SyntheticEvent): void {
        if (
            event.nativeEvent.keyCode === constants.key.backspace &&
            !this._options.value &&
            this._items.getCount()
        ) {
            this._removeItem(this._items.at(this._items.getCount() - 1));
        }
    }

    protected async _addItem(item: Model, tabsSelectedKey?: Key): Promise<void> {
        await this._loadSearchSelectedItemTemplates();

        const tabId = tabsSelectedKey || this._selectorTabId;
        const filterDescription = this._getClonedFilterDescription(
            this._options.filterDescription || this._options.filterSource
        );
        const items = this._items;
        const newItems = [item];
        const selectedItem = filterDescription.find((filterItem) => {
            return filterItem.name === tabId;
        });
        const editorOptions = selectedItem?.editorOptions;
        const isMultiSelect = editorOptions?.multiSelect;
        const selectedValue = isMultiSelect ? selectedItem?.value[0] : selectedItem?.value;
        const index = items.getIndexByValue(item.getKeyProperty(), selectedValue);
        if (index !== -1) {
            items.replace(item, index);
        } else {
            items.append(newItems);
        }
        selectedItem.value = isMultiSelect ? [item.getKey()] : item.getKey();
        selectedItem.textValue = item.get(editorOptions?.displayProperty);
        // Фильтр, выбранный в строке поиска, не должен отображаться рядом с воронкой фильтра
        selectedItem.textValueVisible = false;
        selectedItem.appliedFrom = 'filterSearch';
        if (selectedItem.viewMode === 'extended') {
            selectedItem.viewMode = 'basic';
        }
        this._items = items;
        if (editorOptions?.sourceController) {
            const selectedItems = new RecordSet({
                adapter: item.getAdapter(),
                keyProperty: editorOptions?.keyProperty,
                format: item.getFormat(),
                model: editorOptions.source.getModel(),
            });
            selectedItems.append([item]);
            editorOptions.selectedItems = selectedItems;
        }
        this._notifyFilterSource(filterDescription, RESET_SEARCH_STATE);
    }

    protected _crossClick(_event: SyntheticEvent, item: Model): void {
        this._removeItem(item);
    }

    protected _removeItem(item: Model) {
        const keyProperty = this._options.keyProperty || item.getKeyProperty();
        const key = item.get(keyProperty);
        this._items?.removeAt(this._items.getIndexByValue(keyProperty, key));
        this._removeItemFromFilterDescription(item);
    }

    protected _getProperty(
        item: Model,
        propertyName: 'displayProperty' | 'searchSelectedItemTemplate'
    ): string {
        let property;
        this._filterDescription.forEach(({ editorOptions, value }) => {
            const keyProperty = editorOptions.keyProperty;
            const itemValue = item.get(keyProperty);
            const isFilterValueEqual = editorOptions.multiSelect
                ? value?.includes(itemValue)
                : itemValue === value;

            if (isFilterValueEqual) {
                property = editorOptions[propertyName];
            }
        });
        return property;
    }

    protected _onShowSelector(
        e: SyntheticEvent,
        templateOptions: object,
        tabsSelectedKey: Key
    ): boolean {
        const selectorTemplate = this._suggestListsOptions[tabsSelectedKey].selectorTemplate;
        this._selectorTabId = tabsSelectedKey;
        if (selectorTemplate) {
            const selectorOptions: IStackPopupOptions = {
                opener: this,
                template: selectorTemplate.templateName,
                templateOptions: {
                    ...selectorTemplate.templateOptions,
                    multiSelect: false,
                },
                ...selectorTemplate?.popupOptions,
            };
            getLookupLib().then(({ showSelector }) => {
                showSelector(this, selectorOptions);
            });
            return false;
        }
    }

    protected async _selectCallback(
        event: SyntheticEvent,
        result: SelectedItems | Promise<SelectedItems>
    ): void {
        const source = this._suggestListsOptions[this._selectorTabId].source;
        const keyProperty = this._suggestListsOptions[this._selectorTabId].keyProperty;
        const { ToSourceModel } = await getLookupLib();
        this._addItem(ToSourceModel(result, source, keyProperty).at(0), this._selectorTabId);
    }

    private _removeItemFromFilterDescription(item: Model): void {
        const filterDescription = this._getClonedFilterDescription(
            this._options.filterDescription || this._options.filterSource
        );
        const key = item.getKey();
        filterDescription.find((filterItem) => {
            const value = filterItem.value;
            const editorOptions = filterItem.editorOptions;
            const isMultiSelect = editorOptions?.multiSelect && value instanceof Array;
            if ((isMultiSelect && value && value[0] === key) || (!isMultiSelect && value === key)) {
                filterItem.value = filterItem.resetValue;
                filterItem.textValue = '';
                if (
                    (editorOptions?.extendedCaption || filterItem.extendedCaption) &&
                    filterItem.viewMode === 'basic'
                ) {
                    filterItem.viewMode = 'extended';
                }
                if (!editorOptions.multiSelect && editorOptions?.sourceController?.getItems()) {
                    editorOptions.selectedItems = editorOptions?.sourceController
                        ?.getItems()
                        .clone();
                    editorOptions.selectedItems.clear();
                }
                return true;
            }
        });
        this._notifyFilterSource(filterDescription);
        this._children.layout.openSuggest();
    }

    private _isSuggestFilterItem(editorTemplateName: string, category?: string): boolean {
        return (
            editorTemplateName === 'Controls/filterPanelEditors:Lookup' ||
            editorTemplateName === 'Controls/filterPanel:ListEditor' ||
            category !== undefined
        );
    }

    private _isShowCollection(): boolean {
        return !!this._items?.getCount();
    }

    private _loadSearchSelectedItemTemplates(): Promise<void> {
        const templates = [];
        this._options.filterDescription.forEach((filterItem) => {
            if (
                filterItem?.editorOptions?.searchSelectedItemTemplate &&
                typeof filterItem?.editorOptions?.searchSelectedItemTemplate === 'string'
            ) {
                templates.push(loadAsync(filterItem?.editorOptions?.searchSelectedItemTemplate));
            }
        });
        return Promise.all(templates);
    }

    paste(value: string): void {
        this._children.layout.paste(value);
    }

    reset(): void {
        this._children.layout.reset();
    }

    static getDefaultOptions(): Partial<ILookupInputOptions> {
        return {
            maxVisibleItems: 7,
            displayProperty: 'title',
            multiSelect: true,
        };
    }
}
export default Input;

/**
 * @name Controls-ListEnv/ExtSearch#afterInputSuggestTemplate
 * @cfg {String|TemplateFunction} Путь до шаблона или шаблон, содержащие прикладной контент, который будет отображаться справа
 * от поля ввода.
 * @demo Engine-demo/ExtSearch/Suggest/AfterInputSuggestTemplate/Index
 */
