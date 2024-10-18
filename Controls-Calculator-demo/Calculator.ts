import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Dialog } from 'Controls/popup';
import { SessionStorage } from 'Browser/Storage';
import * as template from 'wml!Controls-Calculator-demo/Calculator';
import 'css!Controls-Calculator-demo/Calculator';

export default class Calculator extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _reloadState: boolean = false;
    _number: number;

    protected _afterUpdate(): void {
        this._reloadState = false;
    }
    protected _onClick(): void {
        Dialog.openPopup({
            template: 'Controls-Calculator/Dialog',
            templateOptions: {
                value: this._number,
                viewMode: 'standart',
            },
            opener: this,
            eventHandlers: {
                onResult: (numberFromCalculator: number) => {
                    this._number = numberFromCalculator;
                },
            },
        });
    }

    protected _clearHistory(): void {
        SessionStorage.remove('calculationHistory');
        this._reloadState = true;
    }
}
