import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/CaptionPosition/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
