import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dateRange/LinkView/ReadOnly/ReadOnly';
import 'css!Controls-demo/dateRange/LiteSelector/LiteSelector';

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}

export default DemoControl;
