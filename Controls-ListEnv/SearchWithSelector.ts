import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import ISuggest from 'Controls/interface/ISuggest';
import SuggestSearch from 'Controls/SuggestSearch';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as template from 'wml!Controls-ListEnv/_SearchWithSelector/Input';
import 'css!Controls-ListEnv/SearchWithSelector';

interface ISearchInputOptions extends ISuggest, IControlOptions {}

/**
 * Строка поиска.
 * @class Controls-ListEnv/SearchWithSelector
 * @extends UI/Base:Control
 * @control
 * @extends Controls/SuggestSearch
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISuggest
 * @demo Engine-demo/ExtSearch/Input/Input
 * @public
 */

class Input extends Control<ISearchInputOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        searchInput: SuggestSearch;
    };

    protected _searchClick(event: SyntheticEvent): void {
        this.activate();
        this._children.searchInput.searchClick(event, event.nativeEvent);
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
