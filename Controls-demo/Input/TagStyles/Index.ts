import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/TagStyles/TagStyles');

class TagStyles extends Control<IControlOptions> {
    protected _primaryValue: string = TagStyles._defaultValue;
    protected _secondaryValue: string = TagStyles._defaultValue;
    protected _successValue: string = TagStyles._defaultValue;
    protected _warningValue: string = TagStyles._defaultValue;
    protected _dangerValue: string = TagStyles._defaultValue;
    protected _infoValue: string = TagStyles._defaultValue;
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    private static _defaultValue: string = 'text';
}
export default TagStyles;
