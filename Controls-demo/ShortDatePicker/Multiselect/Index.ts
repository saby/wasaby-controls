import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ShortDatePicker/Multiselect/Index';

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _mockDate: Date = new Date(2022, 0, 1);
}

export default DemoControl;
