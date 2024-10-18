import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Search/Input/Select/Index');

class SearchInputSelect extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _select(): void {
        this._children.search.select();
    }

    static _styles: string[] = ['Controls-demo/Search/Input/Base/Style'];
}
export default SearchInputSelect;
