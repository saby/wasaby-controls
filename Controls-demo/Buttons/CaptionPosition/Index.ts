import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Buttons/CaptionPosition/CaptionPosition');

class CaptionPosition extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default CaptionPosition;
