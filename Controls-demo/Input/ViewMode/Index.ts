import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/ViewMode/View');

class View extends Control<IControlOptions> {
    protected _value: string = 'text';
    protected _valueReadonly: string = 'text';
    protected _template: TemplateFunction = controlTemplate;
}

export default View;
