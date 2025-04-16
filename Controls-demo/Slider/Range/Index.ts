import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Slider/Range/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
