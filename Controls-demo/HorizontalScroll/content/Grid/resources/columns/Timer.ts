import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/HorizontalScroll/content/Grid/resources/columns/Timer';

const INTERVAL_MS = 1000;

export default class Timer extends Control {
    protected _template: TemplateFunction = Template;
    protected _value: number = 0;

    private _intervalId: number;

    protected _beforeMount(): void {
        this._intervalId = setInterval(() => {
            this._value++;
        }, INTERVAL_MS);
    }

    protected _beforeUnmount(): void {
        clearInterval(this._intervalId);
    }
}
