import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/toggle/SwitchButton/Tooltip/Template');

class CaptionPosition extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
}
export default CaptionPosition;
