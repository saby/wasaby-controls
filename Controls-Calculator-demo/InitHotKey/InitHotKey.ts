import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-Calculator-demo/InitHotKey/InitHotKey';
import InitHotKeys from 'Controls-Calculator/InitHotKeys';
import 'css!Controls-Calculator-demo/Calculator';

export default class InitHotKey extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _number: string = '';

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        const hotKey = InitHotKeys;
        hotKey.init();
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
