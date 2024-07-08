import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/ItemTemplate/Index');

class ItemTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default ItemTemplate;
