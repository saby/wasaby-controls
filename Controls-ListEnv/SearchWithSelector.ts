import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import ISuggest from 'Controls/interface/ISuggest';
import SuggestSearch from 'Controls-ListEnv/SuggestSearch';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as template from 'wml!Controls-ListEnv/_SearchWithSelector/Input';
import 'css!Controls-ListEnv/SearchWithSelector';

interface ISearchInputOptions extends ISuggest, IControlOptions {}

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
    protected _children: {
        searchInput: SuggestSearch;
    };

    protected _searchClick(event: SyntheticEvent, searchClickCallback: Function): void {
        searchClickCallback(event);
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
export default Input;
