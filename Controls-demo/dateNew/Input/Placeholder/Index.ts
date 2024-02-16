import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dateNew/Input/Placeholder/Placeholder';

class DemoControl extends Control {
    protected _template: TemplateFunction = template;
    protected _date: Date = new Date(2021, 0, 1);
}

export default DemoControl;
