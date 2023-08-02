/**
 * @kaizen_zone 8b1886ea-b987-4659-bc96-c96169eb1599
 */
import { BaseText, IBaseTextInputOptions } from 'Controls/_input/BaseText';
import { IFieldTemplateOptions } from 'Controls/_input/interface/IFieldTemplate';
import { getOptionBorderVisibilityTypes } from 'Controls/_input/interface/IBorderVisibility';

export interface ITextInputOptions extends IBaseTextInputOptions, IFieldTemplateOptions {}

/**
 * Однострочное поле ввода текста.
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FExample%2FInput демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/#text руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @extends Controls/input:Base
 *
 * @mixes Controls/input:IText
 * @implements Controls/interface:IInputPlaceholder
 * @mixes Controls/input:IFieldTemplate
 *
 * @public
 * @demo Controls-demo/Input/ViewMode/Index
 *
 */
export default class Text extends BaseText<ITextInputOptions> {
    static getDefaultTypes(): object {
        return {
            ...getOptionBorderVisibilityTypes(),
        };
    }
}

/**
 * @name Controls/_input/Text#value
 * @cfg {String}
 * @example
 * Сохраняем данные о пользователе и текущее время при отправке формы.
 *
 * <pre class="brush: html; highlight: [3]">
 * <!-- WML -->
 * <form action="Auth.php" name="form">
 *     <Controls.input:Text bind:value="_login"/>
 *     <Controls.input:Password bind:value="_password"/>
 *     <Controls.buttons:Button on:click="_saveUser()" caption="Отправить"/>
 * </form>
 * </pre>
 *
 * <pre class="brush: js; highlight: [3,10]">
 * // TypeScript
 * export class Form extends Control<IControlOptions, void> {
 *     private _login: string = '';
 *     private _password: string = '';
 *     private _server: Server = new Server();
 *
 *     private _saveUser() {
 *         this._server.saveData({
 *             date: new Date(),
 *             login: this._login,
 *             password: this._password
 *         });
 *
 *         this._children.form.submit();
 *     }
 * }
 * </pre>
 *  @demo Controls-demo/Input/Value/Index
 */

/**
 * @name Controls/_input/Text#valueChanged
 * @event
 * @example
 * Контрол ввода текста с информационной подсказкой. Подсказка содержит информацию о сложности логина.
 * <pre class="brush: html">
 * <Controls.input:Text name="login" on:valueChanged="_validateLogin()"/>
 * </pre>
 * <pre class="brush: js">
 * export class InfoLogin extends Control<IControlOptions, void> {
 *     private _validateLogin(event, value) {
 *         let lengthLogin: number = value.length;
 *         let cfg = {
 *             target: this._children.login,
 *             targetSide: 'top',
 *             alignment: 'end',
 *             message: null
 *         }
 *
 *         if (lengthLogin < 6) {
 *             cfg.message = 'Длина логина должна быть больше 5 символов';
 *         }
 *
 *         this._notify('openInfoBox', [cfg], {
 *             bubbling: true
 *         });
 *     }
 * }
 * </pre>
 */

/**
 * @name Controls/_input/Text#readOnly
 * @cfg {Boolean}
 * @demo Controls-demo/Input/ReadOnly/Index
 */
