import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/FontWeight/FontWeight');

class FontStyles extends Control<IControlOptions> {
    protected _defaultValue: string = FontStyles._defaultValue;
    protected _boldValue: string = FontStyles._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}
export default FontStyles;
