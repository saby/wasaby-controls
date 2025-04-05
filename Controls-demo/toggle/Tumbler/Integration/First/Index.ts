import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/Integration/First/Template';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _widthClass: string;

    protected _beforeMount(options: IControlOptions): void {
        this._widthClass =
            options.theme.indexOf('default') < 0
                ? 'controlsDemo_fixedWidth600'
                : 'controlsDemo_fixedWidth400';
    }
}
