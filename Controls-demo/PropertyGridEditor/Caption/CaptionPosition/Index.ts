import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridEditor/Caption/CaptionPosition/Index';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    static _styles: string[] = [
        'Controls-demo/PropertyGridEditor/PropertyGridEditor',
    ];
}
