import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/CheckboxGroup/Template';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _widthClass: string;

    protected _beforeMount(options: IControlOptions): void {
        this._widthClass =
            options.theme.indexOf('default') < 0
                ? 'controlsDemo_fixedWidth800'
                : 'controlsDemo_fixedWidth500';
    }
}
