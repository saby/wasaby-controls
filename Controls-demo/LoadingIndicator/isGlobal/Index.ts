import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/isGlobal/IsGlobal');

class IsGlobal extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    private _firstId: number = null;

    protected _firstOpen(): void {
        const cfg = {
            id: this._firstId,
            message: 'first indicator text',
            overlay: 'none',
        };
        this._firstId = this._notify('showIndicator', [cfg], {
            bubbling: true,
        }) as number;
        setTimeout(() => {
            this._notify('hideIndicator', [this._firstId], { bubbling: true });
        }, 5000);
    }
    _secondOpen(e: Event, time: number): void {
        this._children.loadingIndicator.show({});
        setTimeout(
            function () {
                this._children.loadingIndicator.hide();
            }.bind(this),
            time
        );
    }

    static _styles: string[] = [
        'Controls-demo/LoadingIndicator/IndicatorContainer',
    ];
}
export default IsGlobal;
