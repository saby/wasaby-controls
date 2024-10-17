import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Calendar/MonthSlider/Index');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}

export default DemoControl;
