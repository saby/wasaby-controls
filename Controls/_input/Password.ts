/**
 * @kaizen_zone 65fef2fb-b3db-4b89-83f4-29bb8d85ff30
 */
import { default as Base, IBaseInputOptions } from 'Controls/_input/Base';
import { descriptor } from 'Types/entity';
import { ViewModel } from 'Controls/_input/Password/ViewModel';
import { SyntheticEvent } from 'react';
import { IMaxLengthOptions } from 'Controls/_input/interface/IMaxLength';
import 'css!Controls/input';
import PasswordVisibilityButtonTemplate from 'Controls/_input/Password/PasswordVisibilityButton';

export interface IPasswordOptions extends IBaseInputOptions, IMaxLengthOptions {
    passwordVisible?: boolean;
    revealable?: boolean;
    /**
     * callback, который будет вызван при нажатии на глазик. Если callback вернет false, то отменяется стандартное поведение, и пароль не показывается.
     */
    revealButtonClickCallback?: () => boolean | Promise<boolean>;
}

/*
 *  Control that hides all entered characters and shows replacer-symbols in place of them.
 *  Visibility of entered text can be toggled by clicking on 'eye' icon.
 *  <a href="/materials/DemoStand/app/Controls-demo%2FExample%2FInput">Configured Inputs Demo.</a>.
 *
 * @class Controls/_input/Password
 * @extends Controls/_input/Base
 *
 * @public
 * @demo Controls-demo/Input/Password/Base/Index
 *
 * @author Мочалов М.А.
 */

/**
 * Поле ввода пароля.
 *
 * @remark
 * Контрол скрывает введенные символы и вместо них отображает символы-заменители.
 * Видимость введенного текста можно переключить, нажав на иконку 'eye'.
 *
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FExample%2FInput демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/password/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @extends Controls/_input/Base
 * @implements Controls/input:IMaxLength
 *
 * @public
 * @demo Controls-demo/Input/Password/Base/Index
 *
 */
class Password extends Base<IPasswordOptions, ViewModel> {
    protected _passwordVisible: boolean = false;
    protected _controlName: string = 'Password';

    protected _getDefaultValue() {
        return '';
    }

    protected _getViewModelOptions(options: IPasswordOptions): object {
        return {
            readOnly: options.readOnly,
            autoComplete: Password._isAutoComplete(this._autoComplete),
            passwordVisible: this._passwordVisible,
            maxLength: options.maxLength,
        };
    }

    protected _getViewModelConstructor() {
        return ViewModel;
    }

    protected _cutHandler(event: SyntheticEvent<HTMLElement, KeyboardEvent>): void {
        super._cutHandler.apply(this, [event]);

        /*
         * Запрещаем вырезать текст, если пароль скрыт.
         */
        if (!this._passwordVisible) {
            event.preventDefault();
        }
    }

    protected _copyHandler(event: SyntheticEvent<HTMLElement, ClipboardEvent>): void {
        super._copyHandler.apply(this, [event]);

        /*
         * Запрещаем копировать текст, если пароль скрыт.
         */
        if (!this._passwordVisible) {
            event.preventDefault();
        }
    }

    protected _initProperties(options: IPasswordOptions): void {
        super._initProperties.apply(this, [options]);
        const CONTROL_NAME: string = 'Password';

        this._field.scope.controlName = CONTROL_NAME;
        this._readOnlyField.scope.controlName = CONTROL_NAME;

        this._type = Password._calculateType(
            this._passwordVisible,
            Password._isAutoComplete(this._autoComplete)
        );

        this._type = Password._calculateType(
            this._passwordVisible,
            Password._isAutoComplete(this._autoComplete)
        );

        this._rightFieldWrapper.template = PasswordVisibilityButtonTemplate;
        this._rightFieldWrapper.scope.horizontalPadding = options.horizontalPadding;
        this._rightFieldWrapper.scope.isVisibleButton = this._isVisibleButton.bind(this);
        this._rightFieldWrapper.scope.isVisiblePassword = this._isVisiblePassword.bind(this);
        this._rightFieldWrapper.scope.passwordVisible = this.props.passwordVisible;
        this._rightFieldWrapper.scope.revealable = options.revealable;
        this._rightFieldWrapper.scope.toggleVisibilityHandler =
            this._toggleVisibilityHandler.bind(this);
    }

    _getTooltip(): string {
        /*
         * If the password is hidden, there should be no tooltip. Otherwise, the tooltip is defined as usual.
         */
        if (this._passwordVisible) {
            return super._getTooltip.apply(this, []);
        }

        return '';
    }

    protected _toggleVisibilityHandler(): void {
        const updatePasswordVisible = () => {
            this._passwordVisible = !this._passwordVisible;
            this._type = Password._calculateType(
                this._passwordVisible,
                Password._isAutoComplete(this._autoComplete)
            );
            this._nextLocalVersion();
        };

        if (this.props.revealButtonClickCallback) {
            const res = this.props.revealButtonClickCallback();
            if (res instanceof Promise) {
                res.then((pRes) => {
                    if (pRes !== false) {
                        updatePasswordVisible();
                    }
                });
            } else {
                if (res !== false) {
                    updatePasswordVisible();
                }
            }
        } else {
            updatePasswordVisible();
        }
    }

    private _isVisibleButton(): boolean {
        return !!(!this._getReadOnly() && this._viewModel.displayValue && this.props.revealable);
    }

    private _isVisiblePassword(): boolean {
        return this._passwordVisible;
    }

    private static _calculateType(passwordVisible: boolean, autoComplete: boolean): string {
        return passwordVisible || !autoComplete ? 'text' : 'password';
    }

    private static _isAutoComplete(autoComplete: string): boolean {
        return autoComplete !== 'off';
    }

    static defaultProps = {
        ...Base.defaultProps,
        autoComplete: 'on',
        revealable: true,
    };

    static getOptionTypes(): Record<string, unknown> {
        const optionTypes = Base.getOptionTypes();

        optionTypes.revealable = descriptor(Boolean);

        return optionTypes;
    }
}

export default Password;

/**
 * @name Controls/_input/Password#revealable
 * @cfg {Boolean} В значении true в поле ввода присутствует кнопка-переключатель видимости введённых символов.
 * @default true
 * @remark
 *
 * Кнопка не отображается в {@link readOnly режиме чтения} и в незаполненном поле.
 * @demo Controls-demo/Input/Password/Base/Index
 */

/*
 * @name Controls/_input/Password#revealable
 * @cfg {Boolean} Determines whether to enables the reveal toggle button that will show the password in clear text.
 * @default true
 * @remark
 *
 * The button does not appear in {@link readOnly read mode} or in an empty field.
 */

/**
 * @name Controls/_input/Password#maxLength
 * @cfg {Number}
 * @demo Controls-demo/Input/Password/MaxLength/Index
 */

/**
 * @name Controls/_input/Password#revealButtonClickCallback
 * @cfg {Function} Сallback, который будет вызван при нажатии на глазик. Если callback вернет false или Promice<false>, то отменяется стандартное поведение, и пароль не показывается.
 * @demo Controls-demo/Input/Password/RevealButtonClickCallback/Index
 */

/**
 * @name Controls/_input/Password#value
 * @cfg {String}
 * @example
 * Сохраняем данные о пользователе и текущее время при отправке формы.
 *
 * <pre class="brush: html; highlight: [4]">
 * <!-- WML -->
 * <form action="Auth.php" name="form">
 *     <Controls.input:Text bind:value="_login"/>
 *     <Controls.input:Password bind:value="_password"/>
 *     <Controls.buttons:Button on:click="_saveUser()" caption="Отправить"/>
 * </form>
 * </pre>
 *
 * <pre class="brush: js; highlight: [4,11]">
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
 */
