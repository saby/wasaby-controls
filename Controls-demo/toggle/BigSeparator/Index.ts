import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/BigSeparator/Index');

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Index;
