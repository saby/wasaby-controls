import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Input-demo/GUID/Replacer/GUID';

class IP extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _value1: string = '';
    protected _value2: string = '';
    static _styles: string[] = ['DemoStand/Controls-demo'];
}

export default IP;
