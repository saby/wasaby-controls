import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { ValidateControllerClass } from 'Controls/hintManager';
import { Controller } from 'Controls/validate';
import { Confirmation } from 'Controls/popup';
import * as template from 'wml!Controls-demo/HintManager/ValidateController/ValidateController';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        formController: Controller,
        Confirmation: Confirmation
    };
    private _validateControllerClass: ValidateControllerClass;
    private _value1 = 'Иван';
    private _value2 = '';
    private _value3 = '';

    protected _beforeMount() {
        this._validateControllerClass = new ValidateControllerClass();
    }

    protected _cleanValid() {
        this._children.formController.setValidationResult();
    }

    protected _clickHandler() {
        this._children.formController.submit().then((result) => {
            if (!result.hasErrors) {
                this._children.Confirmation.open({
                    message: 'Валидация прошла успешно',
                    type: 'ok'
                });
            }
        });
    }
}
