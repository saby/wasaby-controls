import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/toggle/Button/ViewModes/ViewModes');

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _button1Value: boolean = false;
    protected _button2Value: boolean = false;
    protected _button3Value: boolean = false;
    protected _button4Value: boolean = false;
    protected _button5Value: boolean = false;
    protected _button6Value: boolean = false;
    protected _button7Value: boolean = false;
}
export default ViewModes;
