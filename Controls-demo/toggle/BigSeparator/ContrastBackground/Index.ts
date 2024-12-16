import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/BigSeparator/ContrastBackground/ContrastBackground');

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _expanded: boolean = false;
}

export default Index;
