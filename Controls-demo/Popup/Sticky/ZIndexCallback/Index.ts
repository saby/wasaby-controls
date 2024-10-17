import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/Popup/Sticky/ZIndexCallback/Template';
import 'css!DemoStand/Controls-demo';
import { StackOpener } from 'Controls/popup';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _stackOpener: StackOpener = new StackOpener();

    protected _openClickHandler(): void {
        this._stackOpener.open({
            opener: this,
            template: 'Controls-demo/Popup/Sticky/ZIndexCallback/templates/Stack',
            width: 450,
        });
    }
}
