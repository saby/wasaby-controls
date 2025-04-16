import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Calculator/_container/Container';
import Calculator from './View';
import Number from './Number';
import { SyntheticEvent } from 'UICommon/Events';

/**
 * Контрол, связывающий числа вводимые в калькулятор и сам калькулятор.
 * @extends UI/Base:Control
 * @control
 * @demo Controls-Calculator-demo/ClickOnNumber/ClickOnNumber
 * @public
 */
export default class Container extends Control {
    protected _template: TemplateFunction = template;
    private _calculators: Record<string, Calculator> = {};
    private _numbers: Record<string, Number> = {};

    private _registerCalculator(_: SyntheticEvent, instance: Calculator, id: string): void {
        this._calculators[id] = instance;

        Object.values(this._numbers).forEach((item) => {
            return item.setCalculatorRegistered(true);
        });
    }

    private _unregisterCalculator(_: SyntheticEvent, id: string): void {
        delete this._calculators[id];

        if (!Object.keys(this._calculators).length) {
            Object.values(this._numbers).forEach((item) => {
                return item.setCalculatorRegistered(false);
            });
        }
    }

    private _registerNumber(_: SyntheticEvent, instance: Number, id: string): void {
        this._numbers[id] = instance;

        if (Object.keys(this._calculators).length) {
            instance.setCalculatorRegistered(true);
        }
    }

    private _unregisterNumber(_: SyntheticEvent, id: string): void {
        delete this._numbers[id];
    }
}
