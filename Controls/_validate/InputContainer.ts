/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import Container, { IValidateContainerOptions } from 'Controls/_validate/Container';
import { TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_validate/InputContainer');

interface IValidateInputContainerOptions extends IValidateContainerOptions {
    validateOnFocusOut?: boolean;
    onlyMobilePhone?: boolean;
}

/**
 * Контрол, регулирующий валидацию своего контента. Используется с контролами, поддерживающими интерфейс {@link Controls/_input/interface/IValue IValue}.
 * Валидация запускается автоматически при потере фокуса.
 * @remark
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 * @class Controls/_validate/InputContainer
 * @extends Controls/_validate/Container
 *
 * @public
 */

class Input extends Container<IValidateInputContainerOptions> {
    _template: TemplateFunction = template;
    _shouldValidate: boolean;

    /*
     * Валидация по уходу фокуса должна начинаться только в случае,
     * если была ручная валидация или пользователь ввел что-то в поле ввода
     */
    _shouldValidateByFocusOut: boolean = false;

    validate(...args: unknown[]): Promise<string[] | null> {
        this._shouldValidateByFocusOut = true;
        return super.validate(...args);
    }

    protected _deactivatedHandler(): void {
        this._contentActive = false;
        this._validationStatus = this._getValidStatus(this._contentActive);
        if (
            this._options.validateOnFocusOut &&
            !this._options.readOnly &&
            this._shouldValidateByFocusOut
        ) {
            this._shouldValidate = true;
            this._forceUpdate();
        }
    }

    _inputCompletedHandler(event: Event, ...rest: any): void {
        this._notify('inputCompleted', rest);
        // Because of this error:
        // https://online.sbis.ru/opendoc.html?guid=ef52bfb5-56ea-4397-a77f-89e5c3413ed9
        // we need to stop event propagation, otherwise all subscribtions to inputComplete-event of
        // this control will be called twice
        event.stopPropagation();
    }

    _valueChangedHandler(...args: unknown[]): void {
        // Не сбрасываем валидацию если в значение пришло +7, так как при приходе фокуса,
        // поле ввода телефона само вставляет +7 и стреляет valueChanged
        if (args[1] === '+7' && this._options.onlyMobilePhone) {
            return;
        }
        this._shouldValidateByFocusOut = true;
        return super._valueChangedHandler(...args);
    }

    _afterUpdate(oldOptions): void {
        if (
            (this._shouldValidate || this._options.value !== oldOptions.value) &&
            !this._options.readOnly
        ) {
            this._shouldValidate = false;
            this.validate();
        }
    }

    static getDefaultOptions(): IValidateInputContainerOptions {
        return {
            ...Container.getDefaultOptions(),
            validateOnFocusOut: true,
        };
    }
}

export default Input;

/**
 * @name Controls/_validate/InputContainer#validateOnFocusOut
 * @cfg {Boolean} Определяет должна ли запускаться валидация при потере фокуса.
 * @default true
 */

/**
 * @name Controls/_validate/InputContainer#inputCompleted
 * @event inputCompleted Происходит при завершении ввода. Завершение ввода — это контрол потерял фокус, или пользователь нажал клавишу "Enter".
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String | Number} value Значение контрола ввода.
 * @param {String} displayValue Отображаемое значение контрола ввода.
 * @remark
 * Событие используется в качестве реакции на завершение ввода пользователем. Например, проверка на валидность введенных данных или отправка данных в другой контрол.
 * Важно! Подписываться на событие нужно именно на InputContainer. При подписке на событие в полее вода, событие будет срабатывать дважды.
 * @example
 * Подписываемся на событие inputCompleted и сохраняем значение поля в базе данных.
 * <pre>
 *    <Controls.validate:InputContainer on:inputCompleted="_inputCompletedHandler()">
 *        <Controls.input:Text/>
 *    </Controls.validate:InputContainer>
 *
 *    export class Validate extends Control<IControlOptions, void> {
 *        ...
 *        private _inputCompletedHandler(event, value) {
 *            this._saveEnteredValueToDatabase(value);
 *        }
 *        ...
 *    }
 * </pre>
 */

/**
 * @name Controls/_validate/InputContainer#valueChanged
 * @event valueChanged Происходит при изменении значения.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String | Number} value Новое значение поля.
 * @remark
 * Это событие должно использоваться для реагирования на изменения, вносимые пользователем в поле.
 * Важно! Подписываться на событие нужно именно на InputContainer. При подписке на событие в полее вода, событие будет срабатывать дважды.
 * @example
 * <pre>
 *    <Controls.validate:InputContainer on:valueChanged="_valueChangedHandler()">
 *        <Controls.input:Text/>
 *    </Controls.validate:InputContainer>
 * </pre>
 */
