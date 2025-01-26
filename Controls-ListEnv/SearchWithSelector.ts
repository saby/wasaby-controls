import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import ISuggest from 'Controls/interface/ISuggest';
import SuggestSearch from 'Controls-ListEnv/SuggestSearch';
import * as ContentTemplate from 'wml!Controls-ListEnv/_SearchWithSelector/dropdownContentTemplate';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TKey } from 'Controls/interface';
import { TColumns } from 'Controls/grid';
import { RecordSet } from 'Types/collection';
import { INavigationOptionValue, INavigationSourceConfig, IItemPadding } from 'Controls/interface';
import { isEqual } from 'Types/object';
import * as template from 'wml!Controls-ListEnv/_SearchWithSelector/Input';
import 'css!Controls-ListEnv/SearchWithSelector';

interface ISearchInputOptions extends ISuggest, IControlOptions {}

interface ISelectedSuggestOptions {
    caption: string;
    id: TKey;
    source: RecordSet;
    order?: number;
    navigation?: INavigationOptionValue<INavigationSourceConfig>;
    filter?: object;
    searchParam?: string;
    displayProperty?: string;
    suggestDisplayProperty?: string;
    keyProperty?: string;
    nodeProperty?: string;
    parentProperty?: string;
    suggestItemTemplate?: Function;
    searchSelectedItemTemplate?: Function;
    footerTemplate?: Function;
    suggestColumns?: TColumns;
    selectorTemplate?: Function;
    suggestItemPadding?: IItemPadding;
}
/**
 * Строка поиска, которая позволяет искать записи по выбранному справочнику.
 * Подробнее о настройке контрола читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/input/ в статье}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @class Controls-ListEnv/SearchWithSelector
 * @extends UI/Base:Control
 * @control
 * @extends Controls-ListEnv/SuggestSearch
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISuggest
 * @demo Controls-ListEnv-demo/SearchWithSelector/Input
 * @public
 */

class Input extends Control<ISearchInputOptions> {
    protected _template: TemplateFunction = template;
    protected _suggestOptions: ISearchInputOptions;
    protected _menuSelectedKey: TKey;
    protected _selectedSuggestOptions: ISelectedSuggestOptions;
    protected _menuItems: RecordSet;
    protected _menuContentTemplate: TemplateFunction = ContentTemplate;
    protected _children: {
        searchInput: SuggestSearch;
    };

    protected _beforeMount(options: ISearchInputOptions): void {
        if (options.suggestListsOptions) {
            this._setSelectedItemOptions(options);
        }
        this._suggestOptions = this._getSuggestOptions(options);
    }

    protected _beforeUpdate(newOptions: ISearchInputOptions): void {
        const suggestListsOptionsChanged = !isEqual(
            this._options.suggestListsOptions,
            newOptions.suggestListsOptions
        );
        const sourceChanged = !isEqual(this._options.source, newOptions.source);
        const navigationChanged = !isEqual(this._options.navigation, newOptions.navigation);
        const filterChanged = !isEqual(this._options.filter, newOptions.filter);
        const suggestColumnsChanged = !isEqual(
            this._options.suggestColumns,
            newOptions.suggestColumns
        );
        const selectorTemplateChanged = !isEqual(
            this._options.selectorTemplate,
            newOptions.selectorTemplate
        );
        const footerTemplateChanged = !isEqual(
            this._options.footerTemplate,
            newOptions.footerTemplate
        );
        const searchParamChanged = this._options.searchParam !== newOptions.searchParam;
        const placeholderChanged = this._options.placeholder !== newOptions.placeholder;
        const displayPropertyChanged = this._options.displayProperty !== newOptions.displayProperty;
        if (suggestListsOptionsChanged) {
            this._setSelectedItemOptions(newOptions);
        }
        if (
            suggestListsOptionsChanged ||
            sourceChanged ||
            navigationChanged ||
            filterChanged ||
            suggestColumnsChanged ||
            selectorTemplateChanged ||
            searchParamChanged ||
            displayPropertyChanged ||
            placeholderChanged ||
            footerTemplateChanged
        ) {
            this._suggestOptions = this._getSuggestOptions(newOptions);
        }
    }

    protected _searchClick(event: SyntheticEvent, searchClickCallback: Function): void {
        searchClickCallback(event);
    }

    protected _onMousedown(event: SyntheticEvent): void {
        event.stopPropagation();
    }

    protected _handleSelectedKeysChanged(event: SyntheticEvent, selectedKeys: TKey[]): void {
        this._menuSelectedKey = selectedKeys[0];
        this._selectedSuggestOptions = this._getSelectedSuggestOptions(
            this._options.suggestListsOptions
        );
        this._suggestOptions = this._getSuggestOptions(this._options);
    }

    private _setSelectedItemOptions(options: ISearchInputOptions): void {
        this._menuItems = this._getMenuItems(options.suggestListsOptions);
        this._selectedSuggestOptions = this._getSelectedSuggestOptions(options.suggestListsOptions);
        this._menuSelectedKey = this._selectedSuggestOptions.id;
    }

    private _getSuggestOptions(options: ISearchInputOptions): ISearchInputOptions {
        if (options.suggestListsOptions) {
            return {
                ...options,
                ...this._selectedSuggestOptions,
            };
        }
        return options;
    }

    private _getMenuItems(suggestListsOptions: object): RecordSet {
        return new RecordSet({
            keyProperty: 'id',
            rawData: Object.keys(suggestListsOptions).map((key) => {
                return {
                    id: key,
                    title: suggestListsOptions[key].caption,
                };
            }),
        });
    }

    private _getSelectedSuggestOptions(suggestListsOptions: object): ISelectedSuggestOptions {
        if (this._menuSelectedKey && suggestListsOptions[this._menuSelectedKey]) {
            return suggestListsOptions[this._menuSelectedKey];
        }
        return this._getFirstItemByOrder(suggestListsOptions);
    }

    private _getFirstItemByOrder(suggestListsOptions: object): ISelectedSuggestOptions {
        return Object.values(suggestListsOptions).sort((a, b) => {
            return a.order - b.order;
        })[0];
    }

    openSuggest(): void {
        this._children.searchInput.openSuggest();
    }

    closeSuggest(): void {
        this._children.searchInput.closeSuggest();
    }

    static getDefaultOptions(): Partial<ISearchInputOptions> {
        return {
            inlineHeight: 'm',
        };
    }
}

/**
 * @typedef {Object} TSuggestListsOptions
 * @description Конфигурация справочника контрола Controls-ListEnv/SearchWithSelector
 * @property {Number} order Индекс в списке справочников
 * @property {TKey} id Идентификатор.
 * @property {Types/source:Memory} source Источник данных справочника.
 * @property {INavigation} navigation Источник данных справочника.
 * @property {Object} filter Конфигурация фильтров.
 * @property {String} searchParam Имя поля фильтра, в значение которого будет записываться текст для поиска.
 * @property {String} displayProperty Имя поля записи, в котором хранится текст содержимого элемента.
 * @property {String} keyProperty Имя поля записи, уникально идентифицирующего элемент коллекции.
 * @property {TemplateFunction} suggestItemTemplate Шаблон отображения элемента в списке автодополнения.
 * @property {TemplateFunction} searchSelectedItemTemplate Шаблон отображения элемента в списке выбранных значений строки поиска.
 * @property {TemplateFunction} footerTemplate Шаблон отображения подвала в списке автодополнения.
 * @property {TColumns} suggestColumns Колонки элементов в списке автодополнения.
 * @property {Controls/interface:ISelectorDialog} selectorTemplate Настройки окна выбора в автодополнении.
 */

/**
 * @name Controls-ListEnv/SearchWithSelector#suggestListsOptions
 * @cfg {TSuggestListsOptions} Конфигурация справочников контрола Controls-ListEnv/SearchWithSelector
 * @demo Controls-ListEnv-demo/SearchWithSelector/SuggestListsOptions/Input
 */

export default Input;
