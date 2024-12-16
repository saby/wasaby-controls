import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Input-demo/GUID/GUID';

class IP extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _value: string = '';
}

export default IP;
