import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/dropdown_new/Input/MultiSelect/PinnedItems/Index';

class SearchFlat extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default SearchFlat;
