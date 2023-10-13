import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
// @ts-ignore
import controlTemplate = require('wml!Controls-demo/Input/DatePicker/Validators/Validators');

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _value: Date;
}
export default DemoControl;
