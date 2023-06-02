import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/ReverseType/ReverseType';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
