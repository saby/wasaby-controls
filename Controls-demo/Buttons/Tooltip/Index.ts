import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/Tooltip/Template');

class ButtonStyle extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default ButtonStyle;
