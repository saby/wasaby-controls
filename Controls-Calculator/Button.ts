import { Control, TemplateFunction } from 'UI/Base';
import { ICalculatorOptions } from 'Controls-Calculator/ICalculator';
import { default as Opener, setActiveInput } from 'Controls-Calculator/_button/Opener';
import * as template from 'wml!Controls-Calculator/_button/Button';
import { IViewMode } from 'Controls/buttons';
import { Guid } from 'Types/entity';

export interface ICalculatorButtonOptions extends ICalculatorOptions {
    /**
     * @name Controls-Calculator/Button#buttonViewMode
     * @cfg {Controls/buttons:IViewMode.typedef} Определяет режим отображения кнопки.
     * @example
     * В данном примере показано, как задавать режим отображения кнопки калькулятора.
     * WML:
     * <pre class="brush: html">
     *      <Controls-Calculator.Button buttonViewMode="link"/>
     * </pre>
     */
    buttonViewMode: IViewMode;
}

/**
 * Кнопка открытия калькулятора
 * @class Controls-Calculator/Button
 * @extends UI/Base:Control
 * @control
 * @public
 * @demo Controls-Calculator-demo/Calculator
 */

/**
 * @event Controls-Calculator/Button#open Происходит при открытии калькулятора.
 */

/**
 * @event Controls-Calculator/Button#close Происходит при закрытии калькулятора.
 */

export default class Button extends Control<ICalculatorButtonOptions> {
    protected _template: TemplateFunction = template;
    private _isOpened: boolean = false;
    private _id: string;
    private _opener: Opener;

    protected _afterMount(options?: ICalculatorButtonOptions): void {
        this._id = Guid.create();
        this._opener = new Opener();
    }

    protected _beforeUnmount(): void {
        if (this._isOpened) {
            this._opener.close();
        }
    }

    protected _clickHandler(): void {
        const popupOptions = {
            eventHandlers: {
                onOpen: () => {
                    this._isOpened = true;
                    this._notify('open', []);
                    this._notify('CalculatorRegisterCalculator', [this, this._id], {
                        bubbling: true,
                    });
                },
                onClose: () => {
                    this._isOpened = false;
                    this._notify('close', []);
                    this._notify('CalculatorUnregisterCalculator', [this._id], {
                        bubbling: true,
                    });
                },
            },
        };
        this._opener.open(popupOptions);
    }

    static getDefaultOptions(): Partial<ICalculatorButtonOptions> {
        return {
            buttonViewMode: 'ghost',
        };
    }
}

export { Opener, setActiveInput };
