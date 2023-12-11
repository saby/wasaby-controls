import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/Checkbox/FontColorStyle/FontStyles');

class FontStyles extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _value1: boolean = false;
    protected _value2: boolean = false;
}
export default FontStyles;
