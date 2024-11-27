import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/TextAlign/TextAlign');

class TextAlign extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default TextAlign;
