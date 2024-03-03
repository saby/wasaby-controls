/**
 * @kaizen_zone bac621e3-f301-4c70-903a-f74de6eae794
 */
import { Logger } from 'UI/Utils';
import { default as Base, IBaseInputOptions } from 'Controls/_input/Base';
import { descriptor } from 'Types/entity';
import ViewModel from './Number/ViewModel';
import { INumberLengthOptions } from 'Controls/_input/interface/INumberLength';
import { IOnlyPositive, IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { IFieldTemplateOptions } from 'Controls/_input/interface/IFieldTemplate';

export interface INumberInputOptions
    extends IBaseInputOptions,
        INumberLengthOptions,
        IOnlyPositiveOptions,
        IFieldTemplateOptions {
    value?: number | string | null;
    useGrouping?: boolean;
    showEmptyDecimals?: boolean;
}

/**
 * Поле ввода числовых значений.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FExample%2FInput демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/number/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @class Controls/input:Number
 * @extends Controls/_input/Base
 *
 * @implements Controls/baseDecorator:IOnlyPositive
 * @implements Controls/interface:INumberFormat
 * @implements Controls/input:INumberLength
 * @implements Controls/input:IFieldTemplate
 *
 * @public
 * @demo Controls-demo/Input/Number/Base/Index
 *
 */
// TODO: https://online.sbis.ru/doc/f654ff87-5fa9-4c80-a16e-fee7f1d89d0f
class NumberInput extends Base<INumberInputOptions> implements IOnlyPositive {
    readonly '[Controls/_decorator/interfaces/IOnlyPositive]': boolean = true;
    _inputMode: string = 'decimal';
    _controlName: string = 'Number';

    protected _getDefaultValue() {
        return 0;
    }

    getInputMode() {
        return 'decimal';
    }

    protected _getViewModelOptions(options: INumberInputOptions): object {
        NumberInput._validateOptions(options);

        return {
            precision: NumberInput._convertToNumber(options.precision),
            useGrouping: options.useGrouping,
            onlyPositive: options.onlyPositive,
            integersLength: NumberInput._convertToNumber(options.integersLength),
            showEmptyDecimals: options.showEmptyDecimals,
            useAdditionToMaxPrecision: options.showEmptyDecimals,
        };
    }

    constructor(props) {
        super(props);
        if (this._getReadOnly()) {
            this._viewModel.trimTrailingZeros(false);
        }
    }

    shouldComponentUpdate(nextProps: IBaseInputOptions, nextState): boolean {
        const res = super.shouldComponentUpdate(nextProps, nextState);
        if (
            nextProps.readOnly !== this._getReadOnly() &&
            (nextProps.readOnly || this._getReadOnly())
        ) {
            this._viewModel.trimTrailingZeros(false);
        }
        return res;
    }

    protected _getViewModelConstructor(): typeof ViewModel {
        return ViewModel;
    }

    protected _notifyInputCompleted(): void {
        if (this._viewModel.trimTrailingZeros(true)) {
            this._notifyValueChanged();
        }

        super._notifyInputCompleted();
    }

    protected _focusOutHandler(event): void {
        if (this._viewModel.trimTrailingZeros(false)) {
            this._notifyValueChanged();
        }

        super._focusOutHandler(event);
    }

    private static _validateOptions(options: INumberInputOptions): void {
        if (options.integersLength <= 0) {
            Logger.error(
                'Number: Incorrect integers length: ' +
                    options.integersLength +
                    '. Integers length must be greater than 0.'
            );
        }
    }

    private static _convertToNumber(value: number): void | number {
        return value === null ? void 0 : value;
    }

    static defaultProps = {
        ...Base.defaultProps,
        useGrouping: true,
        onlyPositive: false,
        showEmptyDecimals: false,
    };

    static getOptionTypes(): object {
        const optionTypes = Base.getOptionTypes();

        optionTypes.value = descriptor(Number, String, null);
        optionTypes.precision = descriptor(Number, null);
        optionTypes.integersLength = descriptor(Number, null);
        optionTypes.useGrouping = descriptor(Boolean);
        optionTypes.onlyPositive = descriptor(Boolean);
        optionTypes.showEmptyDecimals = descriptor(Boolean);

        return optionTypes;
    }
}

// TODO: generics https://online.sbis.ru/opendoc.html?guid=ef345c4d-0aee-4ba6-b380-a8ca7e3a557f
/**
 * @name Controls/_input/Number#value
 * @cfg {String|Number|null}
 * @remark
 * При установке опции value в контроле ввода, отображаемое значение всегда будет соответствовать её значению. В этом случае родительский контрол управляет отображаемым значением. Например, вы можете менять значение по событию {@link valueChanged}:
 *
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.input:Number
 *    value="{{_value}}"
 *    on:valueChanged="_handleValueChange()"/>
 * </pre>
 * <pre class="brush: js; highlight: [5]">
 * // TypeScript
 * export class Form extends Control<IControlOptions, void> {
 *     private _value: string = '';
 *
 *     private _handleValueChange(event: SyntheticEvent<Event>, value) {
 *         this._value = value;
 *     }
 * }
 * </pre>
 * Пример можно упростить, воспользовавшись синтаксисом шаблонизатора {@link /doc/platform/developmentapl/interface-development/ui-library/options/#two-way-binding bind}:
 *
 * <pre class="brush: html; highlight: [3]">
 * <!-- WML -->
 * <Controls.input:Number
 *    bind:value="_value"/>
 * </pre>
 *
 * Альтернатива - не задавать опцию value. Значение контрола будет кешироваться в контроле ввода:
 *
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.input:Number/>
 * </pre>
 *
 * Не рекомендуем использовать опцию для изменения поведения обработки ввода. Такой подход увеличит время перерисовки.
 *
 * Плохо:
 *
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.input:Number
 *    value="{{_value}}"
 *    on:valueChanged="_handleValueChange()"/>
 * </pre>
 * <pre class="brush: js; highlight: [5]">
 * // TypeScript
 * export class Form extends Control<IControlOptions, void> {
 *     private _value: string = '';
 *
 *     private _handleValueChange(event: SyntheticEvent<Event>, value) {
 *         this._value = value.toUpperCase();
 *     }
 * }
 * </pre>
 *
 * Лучшим подходом будет воспользоваться опцией {@link inputCallback}.
 *
 * Хорошо:
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.input:Number
 *    bind:value="{{_value}}"
 *    inputCallback="{{_toUpperCase}}"/>
 * </pre>
 * <pre class="brush: js; highlight: [4]">
 * // TypeScript
 * class Form extends Control<IControlOptions, void> {
 *     private _value: string = '';
 *     private _toUpperCase(data) {
 *         return {
 *             position: data.position,
 *             value: data.value.toUpperCase(),
 *             displayValue: data.displayValue.toUpperCase()
 *         }
 *     }
 * }
 * </pre>
 * @example
 * Сохраняем данные о пользователе и текущее время при отправке формы.
 * <pre class="brush: html; highlight: [5]">
 * <!-- WML -->
 * <form action="Auth.php" name="form">
 *     <Controls.input:Text bind:value="_login"/>
 *     <Controls.input:Password bind:value="_password"/>
 *     <Controls.input:Number bind:value="_age" integerLengths="{{3}}" precision="{{0}}"/>
 *     <Controls.buttons:Button on:click="_saveUser()" caption="Отправить"/>
 * </form>
 * </pre>
 * <pre class="brush: js;">
 * // TypeScript
 * export class Form extends Control<IControlOptions, void> {
 *     private _login: string = '';
 *     private _password: string = '';
 *     private _age: number = null;
 *     private _server: Server = new Server();
 *
 *     private _saveUser() {
 *         this._server.saveData({
 *             date: new Date(),
 *             login: this._login,
 *             password: this._password,
 *             age: this._age,
 *         });
 *
 *         this._children.form.submit();
 *     }
 * }
 * </pre>
 * @see valueChanged
 * @see inputCompleted
 */
/**
 * @name Controls/_input/Number#valueChanged
 * @event Происходит при изменении отображаемого значения контрола ввода.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String | Number} value Значение контрола ввода.
 * @param {String} displayValue Отображаемое значение контрола ввода.
 * @remark
 * Событие используется в качестве реакции на изменения, вносимые пользователем.
 * @example
 * Контрол ввода числа с информационной подсказкой. Подсказка содержит информацию об унивкальности цифр в числе.
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <Controls.input:Number
 *    name="number"
 *    on:valueChanged="_validateNumber()"/>
 * </pre>
 * <pre class="brush: js; highlight: [3]">
 * // TypeScript
 * export class InfoNumber extends Control<IControlOptions, void> {
 *     private _validateNumber(event, value) {
 *         let cfg = {
 *             target: this._children.number,
 *             targetSide: 'top',
 *             alignment: 'end',
 *             message: null
 *         }
 *         ...
 *         this._notify('openInfoBox', [cfg], {
 *             bubbling: true
 *         });
 *     }
 * }
 * </pre>
 * @see value
 */
/**
 * @event inputCompleted Происходит при завершении ввода.
 * @name Controls/_input/Number#inputCompleted
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String|Number} value Значение контрола ввода.
 * @param {String} displayValue Отображаемое значение контрола ввода.
 * @remark
 * Завершение ввода — это контрол потерял фокус, или пользователь нажал клавишу "Enter".
 * Событие используется в качестве реакции на завершение ввода пользователем. Например, проверка на валидность введенных данных или отправка данных в другой контрол.
 * @example
 * Подписываемся на событие inputCompleted и сохраняем значение поля в базе данных.
 * <pre class="brush: html; highlight: [3]">
 * <!-- WML -->
 * <Controls.input:Number
 *    on:inputCompleted="_inputCompletedHandler()"/>
 * </pre>
 * <pre class="brush: js; highlight: [4]">
 * // TypeScript
 * export class Form extends Control<IControlOptions, void> {
 *     ...
 *     private _inputCompletedHandler(event, value) {
 *         this._saveEnteredValueToDatabase(value);
 *     }
 *     ...
 * }
 * </pre>
 * @see value
 */
export default NumberInput;
