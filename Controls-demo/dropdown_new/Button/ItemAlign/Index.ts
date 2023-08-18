import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/dropdown_new/Button/ItemAlign/ItemAlign';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static _styles: string[] = ['Controls-demo/dropdown_new/Menu/Menu'];
}
