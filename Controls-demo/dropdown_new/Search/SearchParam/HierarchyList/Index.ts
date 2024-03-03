import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Search/SearchParam/HierarchyList/Index');

class SearchHierarchy extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default SearchHierarchy;
