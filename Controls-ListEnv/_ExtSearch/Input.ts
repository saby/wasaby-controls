/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { TemplateFunction } from 'UI/Base';
import { BaseLookupInput, ILookupInputOptions, ToSourceModel } from 'Controls/lookup';
import * as template from 'wml!Controls-ListEnv/_ExtSearch/Input';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { IFilterItem } from 'Controls/filter';
import { List, RecordSet } from 'Types/collection';
import { ISuggestListsOptions } from './interface/ISuggestListsOptions';
import { ISearchSuggestOptions } from './interface/ISearchSuggest';
import SuggestSearch from 'Controls/SuggestSearch';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { TFIlter } from 'Controls/interface';
import { IStackPopupOptions } from 'Controls/popup';
import 'css!Controls-ListEnv/ExtSearch';

interface ISuggestFooterTemplate {
    templateName: string;
    templateOptions: object;
}

type Key = string | number | null;
export type SelectedItems = RecordSet | List<Model> | List<void>;

/**
 * Строка поиска с автодополнением, которая поддерживает синхронизацию выбранных значений с окном фильтров.
 * @class Controls-ListEnv/ExtSearch
 * @extends Controls/SuggestSearch
 * @mixes ExtSearch/suggest:ISearchSuggest
 * @ignoreOptions start end
 * @control
 * @demo Engine-demo/ExtSearch/Suggest/Index
 * @remark Отличается от обычной {@link Controls/SuggestSearch строки поиска} возможностью выбора нескольких
 * значений, по одному из каждой вкладки автодополнения.
 * @public
 */

class Input extends BaseLookupInput {
    protected _template: TemplateFunction = template;
    protected _suggestSettingsOptions: IFilterItem[];
    protected _suggestListsOptions: Record<string, ISuggestListsOptions>;
    protected _isSettingsButtonVisible: boolean;
    protected _filterDescription: IFilterItem[];
    protected _keyProperty: string;
    protected _searchParam: string;
    protected _displayProperty: string;
    protected _footerTemplate: ISuggestFooterTemplate;
    protected _selectorTabId: Key;
    protected _needShowSettings: boolean = false;
    protected _onlySettings: boolean;
    protected _children: {
        layout: typeof SuggestSearch;
    };
    private _isOpened: boolean;

    protected _inheritorBeforeMount(options: ISearchSuggestOptions): void {
        super._inheritorBeforeMount(options);
        this._prepareSuggestData(options.filterDescription || options.filterSource);
    }

    protected _inheritorBeforeUpdate(options: ISearchSuggestOptions): void {
        super._inheritorBeforeUpdate(options);
        if (
            this._options.filterDescription !== options.filterDescription ||
            this._options.filterSource !== options.filterSource
        ) {
            this._prepareSuggestData(options.filterDescription || options.filterSource);
        }
    }

    protected _updateInputValue(options: ILookupInputOptions): void {
        if (this._options.value !== options.value) {
            this._setInputValue(options, options.value);
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
            return filterDescription.filter(({ editorTemplateName }) => {
                return !this._isSuggestFilterItem(editorTemplateName);
            });
        }
        if (optionsType === 'list') {
            const listOptionsItems = filterDescription.filter(({ editorTemplateName }) => {
                return this._isSuggestFilterItem(editorTemplateName);
            });
            if (!listOptionsItems.length) {
                return;
            }
            const listOptions = {};
            listOptionsItems.forEach((item, index) => {
                const editorOptions = item.editorOptions;
                listOptions[item.name] = {
                    order: index,
                    caption: item.caption,
                    id: item.name,
                    source: editorOptions.suggestSource || editorOptions.source,
                    navigation: editorOptions.suggestNavigation || editorOptions.navigation,
                    filter: this._getSuggestFilter(item),
                    searchParam: item.searchParam,
                    displayProperty: editorOptions.displayProperty,
                    suggestDisplayProperty: editorOptions.suggestDisplayProperty,
                    keyProperty: editorOptions.keyProperty,
                    nodeProperty: editorOptions.nodeProperty,
                    parentProperty: editorOptions.parentProperty,
                    suggestItemTemplate: editorOptions.suggestItemTemplate,
                    searchSelectedItemTemplate: editorOptions.searchSelectedItemTemplate,
                    footerTemplate: editorOptions.footerTemplate,
                    suggestColumns: editorOptions.suggestColumns,
                    selectorTemplate: editorOptions.selectorTemplate,
                    suggestItemPadding: editorOptions.suggestItemPadding,
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

    private _getSuggestFilter({ editorOptions }: TFIlter): TFIlter {
        const filter = { ...editorOptions.filter };
        delete filter[editorOptions.keyProperty];
        return filter;
    }

    protected _settingsButtonClick(): void {
        this._isOpened = true;
        this._children.layout.openSuggest();
        this._needShowSettings = this._onlySettings ? this._onlySettings : !this._needShowSettings;
    }

    protected _checkRadioGroup(): boolean {
        return this._suggestSettingsOptions.some((item) => {
            return item.editorTemplateName === 'Controls/filterPanelExtEditors:RadioGroupEditor';
        });
    }

    protected _updateFilterSource(e: SyntheticEvent, filter: object): void {
        const keys = Object.keys(filter);
        const filterDescription = object.clone(this._filterDescription);
        keys.forEach((key) => {
            const selectedItem = filterDescription.find((filterItem) => {
                return filterItem.name === key;
            });
            selectedItem.value = filter[key];
        });
        this._notifyFilterSource(filterDescription);
    }

    protected _searchButtonClick(): void {
        if (this._suggestSettingsOptions?.length) {
            this._notifyFilterSource(this._filterDescription);
        } else {
            this._notify('searchClick');
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
    }

    protected _onSuggestClose(): void {
        this._isSettingsButtonVisible = this._onlySettings;
        this._needShowSettings = this._onlySettings;
        this._isOpened = false;
    }

    protected _valueChanged(event: Event, value: string): void {
        this._notify('valueChanged', [value]);
    }

    protected _notifyFilterSource(filterDescription: IFilterItem[]): void {
        if (!isEqual(this._options.filterDescription, filterDescription)) {
            this._notify('filterDescriptionChanged', [filterDescription]);
        }
    }

    protected _choose(event: SyntheticEvent, item: Model, tabsSelectedKey?: string): void {
        super._choose(event, item, tabsSelectedKey);
        this._notify('valueChanged', ['']);
    }

    protected _addItem(item: Model, tabsSelectedKey?: Key): void {
        const tabId = tabsSelectedKey || this._selectorTabId;
        const filterDescription = this._getClonedFilterDescription(
            this._options.filterDescription || this._options.filterSource
        );
        const items = this._lookupController.getItems();
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
        if (selectedItem.viewMode === 'extended') {
            selectedItem.viewMode = 'basic';
        }
        this._lookupController.setItems(items);
        if (editorOptions?.sourceController) {
            const sourceControllerItems = new RecordSet({
                adapter: item.getAdapter(),
                keyProperty: editorOptions?.keyProperty,
                format: item.getFormat(),
                model: editorOptions.source.getModel(),
            });
            sourceControllerItems.append([item]);
            // когда не выбрана ни одна запись и форматы итемсов не совпадают, sourceController возьмет старый формат
            editorOptions.sourceController.setItems(null);
            editorOptions.sourceController.setItems(sourceControllerItems);
        }
        this._afterItemsChanged();
        this._notifyFilterSource(filterDescription);
    }

    protected _crossClick(event: SyntheticEvent, item: Model): void {
        super._crossClick(event, item);
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
                if (editorOptions?.extendedCaption && filterItem.viewMode === 'basic') {
                    filterItem.viewMode = 'extended';
                }
                if (!editorOptions.multiSelect) {
                    if (editorOptions?.sourceController?.getItems()) {
                        const emptyItems = editorOptions?.sourceController?.getItems().clone();
                        emptyItems.clear();
                        editorOptions?.sourceController?.setItems(null);
                        editorOptions?.sourceController?.setItems(emptyItems);
                    }
                }
                return true;
            }
        });
        this._notifyFilterSource(filterDescription);
        this._children.layout.openSuggest();
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
            this._showSelector(e, selectorOptions);
            return false;
        }
    }

    protected _selectCallback(
        event: SyntheticEvent,
        result: SelectedItems | Promise<SelectedItems>
    ): void {
        const source = this._suggestListsOptions[this._selectorTabId].source;
        const keyProperty = this._suggestListsOptions[this._selectorTabId].keyProperty;
        const preparedItems = ToSourceModel(result, source, keyProperty);
        this._addItem(preparedItems.at(0), this._selectorTabId);
    }

    private _isSuggestFilterItem(editorTemplateName: string): boolean {
        return (
            editorTemplateName === 'Controls/filterPanel:LookupEditor' ||
            editorTemplateName === 'Controls/filterPanel:ListEditor'
        );
    }

    static getDefaultOptions(): Partial<ILookupInputOptions> {
        return {
            ...BaseLookupInput.getDefaultOptions(),
            multiSelect: true,
        };
    }
}
export default Input;

/**
 * @typedef {Object} TSuggestListsOptions
 * @description Объект с настройкой списка в окне автодополнения.
 * @property {hoursFormat} searchValue Значение строки поиска
 * @property {lengthConstraint} searchParam Имя поля, по данным которого происходит поиск.
 * @property {lengthConstraint} filter Фильтр списка.
 * @property {lengthConstraint} source Источник данных списка.
 */

/**
 * @name Controls-ListEnv/ExtSearch#suggestListsOptions
 * @cfg {TSuggestListsOptions[]} Массив загрузчиков для источника данных автодополнения.
 * @demo Engine-demo/ExtSearch/Suggest/Index
 */

/**
 * @name Controls-ListEnv/ExtSearch#afterInputSuggestTemplate
 * @cfg {String|TemplateFunction} Путь до шаблона или шаблон, содержащие прикладной контент, который будет отображаться справа
 * от поля ввода.
 * @demo Engine-demo/ExtSearch/Suggest/AfterInputSuggestTemplate/Index
 */
