import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/toggle/CheckboxMarker/HorizontalPadding/HorizontalPadding');

class CheckboxMarker extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _value1: boolean = null;
    protected _value2: boolean = true;
}
export default CheckboxMarker;
