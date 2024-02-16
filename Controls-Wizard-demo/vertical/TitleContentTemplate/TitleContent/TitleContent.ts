import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Wizard-demo/vertical/TitleContentTemplate/TitleContent/Index';

export default class TitleContentDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
