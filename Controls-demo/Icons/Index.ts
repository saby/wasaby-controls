import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/Icons/Index';
import * as cssText from 'text!Controls-default-theme/fonts/cbus-icons.css';
import 'css!Controls-default-theme/fonts/cbus-icons';
import 'css!DemoStand/Controls-demo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _iconClasses: string[];

    protected _beforeMount(): void {
        this._iconClasses = cssText.match(/icon\-\w+/g).sort();
    }
}
