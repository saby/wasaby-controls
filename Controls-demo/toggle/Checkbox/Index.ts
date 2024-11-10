import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Checkbox/Template';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _trueStateValue: boolean = null;
    protected _widthClass: string;

    protected _beforeMount(options: {}): void {
        this._widthClass =
            options.theme.indexOf('default') < 0
                ? 'controlsDemo_fixedWidth800'
                : 'controlsDemo_fixedWidth500';
    }
}
