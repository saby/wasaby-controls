import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import ICalculator, { ICalculatorOptions, IViewMode } from 'Controls-Calculator/ICalculator';
import * as template from 'wml!Controls-Calculator/_dialog/Dialog';
import { SessionStorage } from 'Browser/Storage';
import * as rk from 'i18n!Controls-Calculator';
import 'css!Controls-Calculator/Dialog';

const LOCAL_STORAGE_DIALOG_STATE_PARAM = 'calculatorMode';
export const CALCULATOR_POSITION_SESSION_STORAGE_PARAM = 'calculatorPosition';

/**
 * Диалоговое окно с калькулятором и кнопкой переключения режима калькулятора.
 * @extends UI/Base:Control
 * @implements Controls-Calculator/ICalculator
 * @control
 * @public
 * @demo Controls-Calculator-demo/Calculator
 */
export default class Dialog extends Control<ICalculatorOptions> implements ICalculator {
    protected _template: TemplateFunction = template;
    readonly '[Controls-Calculator/ICalculator]': boolean = true;
    protected _viewMode: IViewMode;
    protected _memoryNumber: string = null;
    protected _rk: rk = rk;
    protected _children: {
        Layout: Control;
    };

    protected _beforeMount(options: ICalculatorOptions): void {
        this._viewMode =
            (localStorage.getItem(LOCAL_STORAGE_DIALOG_STATE_PARAM) as IViewMode) || 'standart';
    }

    protected _headerClickHandler(): void {
        this._children.Layout.activate();
    }

    protected _viewModeButtonHandler(): void {
        this._viewMode = this._viewMode === 'standart' ? 'extended' : 'standart';
        localStorage.setItem(LOCAL_STORAGE_DIALOG_STATE_PARAM, this._viewMode);
    }

    protected _closeHandler(): void {
        // TODO: будем использовать опции после задачи
        //  https://online.sbis.ru/opendoc.html?guid=58037627-5523-4719-917c-bc5e78217253
        // @ts-ignore
        const { left, top } = this._logicParent._options.position;
        SessionStorage.set(CALCULATOR_POSITION_SESSION_STORAGE_PARAM, {
            left,
            top,
        });
    }

    protected _memoryNumberChangeHandler(e: SyntheticEvent, memoryNumber: string): void {
        this._memoryNumber = memoryNumber;
    }
}
