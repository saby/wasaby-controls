/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_validate/Controller');
import ValidateContainer from 'Controls/_validate/Container';
import {
    default as ControllerClass,
    IControllerConfig,
} from 'Controls/_validate/ControllerClass';
import IValidateResult from 'Controls/_validate/interfaces/IValidateResult';

/**
 * Контрол, регулирующий валидацию формы.
 * Валидация запускается при вызове метода {@link Controls/_validate/Controller#submit submit}.
 * @class Controls/_validate/Controller
 * @extends UI/Base:Control
 *
 * @public
 * @demo Controls-demo/Input/Validate/FormController
 */

class Form extends Control<IControlOptions> {
    private _validateController: ControllerClass = new ControllerClass();

    protected _template: TemplateFunction = template;
    private _validateConfig: IControllerConfig;

    protected _afterUpdate(
        oldOptions?: IControlOptions,
        oldContext?: any
    ): void {
        super._afterUpdate(oldOptions, oldContext);
        this._validateController.resolveSubmit(this._validateConfig);
        this._validateConfig = null;
    }

    onValidateCreated(e: Event, control: ValidateContainer): void {
        this._validateController.addValidator(control);
    }

    onValidateDestroyed(e: Event, control: ValidateContainer): void {
        this._validateController.removeValidator(control);
    }

    submit(config?: IControllerConfig): Promise<IValidateResult | Error> {
        // Для чего нужен _forceUpdate см внутри метода deferSubmit
        this._forceUpdate();
        this._validateConfig = config;
        return this._validateController.deferSubmit();
    }

    setValidationResult(): void {
        return this._validateController.setValidationResult();
    }

    getValidationResult(): IValidateResult {
        return this._validateController.getValidationResult();
    }

    isValid(): boolean {
        return this._validateController.isValid();
    }

    protected _beforeUnmount(): void {
        this._validateController.destroy();
        this._validateController = null;
    }
}

export default Form;

/**
 * @name Controls/_validate/Controller#content
 * @cfg {Content} Содержимое, к которому добавлена логика валидации.
 */

/**
 * @typedef {Object} ControllerConfig
 * @property {Boolean} activateInput Определяет, нужно ли активировать невалидное поле после завершения валидации.
 * По умолчанию: <b>true</b>
 */

/**
 * Запускает валидацию.
 * @name Controls/_validate/Controller#submit
 * @param {Controls/_validate/Controller/ControllerConfig.typedef}  ControllerConfig Параметры, определяющие поведение при валидации.
 * @function
 * @return {Promise<Controls/_validate/interfaces/IValidateResult>}
 * @example
 * <pre>
 * <!-- WML -->
 * <Controls.validate:Controller name="validateController">
 *    <ws:content>
 *       <Controls.validate:Container>
 *          <ws:validators>
 *             <ws:Function value="{{_value}}">Controls/validate:isRequired</ws:Function>
 *          </ws:validators>
 *          <ws:content>
 *             <Controls.input:Text bind:value="_value"/>
 *          </ws:content>
 *       </Controls.validate:Container>
 *    </ws:content>
 * </Controls.validate:Controller>
 * <Controls.buttons:Button caption="Submit" on:click="_clickHandler()"
 * </pre>
 * <pre>
 * // TypeScript
 * _clickHandler(): void {
 *     this._children.validateController.submit().then((result) => {
 *         if (!result.hasErrors) {
 *             self._children.Confirmation.open({
 *                 message: 'Валидация прошла успешно',
 *                 type: 'ok'
 *             });
 *         }
 *     });
 * };
 * </pre>
 */

/**
 * Возвращает значение, указывающее, прошла ли проверка валидации содержимого успешно.
 * @name Controls/_validate/Controller#isValid
 * @function
 * @returns {Boolean}
 */

/**
 * Устанавливает результат валидации.
 * @name Controls/_validate/Controller#setValidationResult
 * @function
 * @see isValid
 * @see validate
 */
