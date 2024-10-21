import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/BorderStyles/BorderStyles');

class BorderStyles extends Control<IControlOptions> {
    protected _successValue: string = BorderStyles._defaultValue;
    protected _secondaryValue: string = BorderStyles._defaultValue;
    protected _warningValue: string = BorderStyles._defaultValue;
    protected _successContrastValue: string = BorderStyles._defaultValue;
    protected _secondaryContrastValue: string = BorderStyles._defaultValue;
    protected _warningContrastValue: string = BorderStyles._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}

export default BorderStyles;
