import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/Caption/Template');

class ButtonCaption extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}

export default ButtonCaption;
