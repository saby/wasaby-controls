import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/datePopup/ReadOnly/Template');

class Single extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _startValue: Date = new Date(2019, 0, 1);
    protected _endValue: Date = new Date(2019, 0, 16);
}
export default Single;
