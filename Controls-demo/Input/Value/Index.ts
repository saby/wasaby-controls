import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Value/Value');

class Value extends Control<IControlOptions> {
    protected _value: string = 'text';
    protected _template: TemplateFunction = controlTemplate;
}

export default Value;
