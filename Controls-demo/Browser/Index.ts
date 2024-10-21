import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Browser/Browser';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
