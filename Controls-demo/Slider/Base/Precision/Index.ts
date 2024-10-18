import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/Slider/Base/Precision/Template');

class Precision extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _value1: number = 30;
    protected _value2: number = 30;
}

export default Precision;
