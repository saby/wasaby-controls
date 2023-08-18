import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Popup/SearchParam/Index');

class SearchParamDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default SearchParamDemo;
