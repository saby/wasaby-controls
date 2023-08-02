import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/HintManager/HintManager';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
