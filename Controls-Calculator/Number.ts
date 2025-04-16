import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Calculator/_number/Number';
import { Bus } from 'Env/Event';
import { SyntheticEvent } from 'UICommon/Events';
import { Guid } from 'Types/entity';
import { Opener as CalculatorOpener } from 'Controls-Calculator/Button';

/**
 * Контрол для отображения числа, вставляемого в калькулятор.
 * @control
 * @extends UI/Base:Control
 * @demo Controls-Calculator-demo/ClickOnNumber/ClickOnNumber
 * @public
 */
export default class Number extends Control {
    protected _template: TemplateFunction = template;
    protected _isCalculatorRegistered: boolean = false;
    protected _id: string;

    protected _afterMount(): void {
        this._id = Guid.create();
        this._notify('CalculatorRegisterNumber', [this, this._id], {
            bubbling: true,
        });
    }

    protected _clickHandler(event: SyntheticEvent): void {
        if (this._needProcessClick()) {
            event.stopPropagation();
            Bus.channel('CalculatorEvents').notify('numberClick', this._container.textContent);
        }
    }

    protected _beforeUnmount(): void {
        this._notify('CalculatorUnregisterNumber', [this._id], {
            bubbling: true,
        });
    }

    private _needProcessClick(): boolean {
        // Калькулятор может быть не в окне, только опенер проверять недостаточно.
        return this._isCalculatorRegistered || CalculatorOpener.isOpened();
    }

    setCalculatorRegistered(state: boolean): void {
        this._isCalculatorRegistered = state;
    }

    static _styles: string[] = ['Controls-Calculator/Number'];
}
