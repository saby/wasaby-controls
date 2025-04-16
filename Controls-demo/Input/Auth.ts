import { Control, TemplateFunction } from 'UI/Base';
import { Confirmation } from 'Controls/popup';
import * as template from 'wml!Controls-demo/Input/Auth/Auth';
import * as rk from 'i18n!Controls-demo';

export default class Auth extends Control {
    protected _template: TemplateFunction = template;
    protected _login: string = '';
    protected _password: string = '';
    protected _children: {
        form: HTMLFormElement;
        confirmationEmptyField: Confirmation;
    };

    protected _update(): void {
        this._children.form.submit();
    }

    protected _signIn(): void {
        if (this._login === '' || this._password === '') {
            this._children.confirmationEmptyField.open({
                type: 'ok',
                style: 'danger',
                message: rk('Для входа укажите логин и пароль'),
            });

            return;
        }

        this._update();
    }

    static _styles: string[] = ['Controls-demo/Input/Auth/Auth'];
}
