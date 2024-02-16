import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout-demo/Floating/Template/Request';

export default class FloatingTabsDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
}
