import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/FontStyles/FontStyles');

class FontStyles extends Control<IControlOptions> {
    protected _linkValue: string = FontStyles._defaultValue;
    protected _primaryValue: string = FontStyles._defaultValue;
    protected _secondaryValue: string = FontStyles._defaultValue;
    protected _successValue: string = FontStyles._defaultValue;
    protected _warningValue: string = FontStyles._defaultValue;
    protected _dangerValue: string = FontStyles._defaultValue;
    protected _unaccentedValue: string = FontStyles._defaultValue;
    protected _labelValue: string = FontStyles._defaultValue;
    protected _infoValue: string = FontStyles._defaultValue;
    protected _defaultValue: string = FontStyles._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}
export default FontStyles;
