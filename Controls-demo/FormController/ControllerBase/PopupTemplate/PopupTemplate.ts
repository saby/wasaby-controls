import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/FormController/ControllerBase/PopupTemplate/PopupTemplate');
import { Confirmation } from 'Controls/popup';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import 'css!Controls-demo/FormController/ControllerBase/PopupTemplate/PopupTemplate';

interface IDemoOptions extends IControlOptions {
    isNewRecord: boolean;
    record: Model;
    saveCallback: (record: Model, isNewRecord?: boolean) => void;
}

class BaseTemplate extends Control<IDemoOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _isNewRecord: boolean;
    protected _propertyGridSource: any[] = [
        {
            name: 'operation',
            caption: 'Регламент',
            type: 'string',
        },
        {
            name: 'storage',
            caption: 'Хранилище',
            type: 'string',
        },
        {
            name: 'milestone',
            caption: 'Веха',
            type: 'string',
        },
    ];

    protected _validationFailedHandler(): void {
        Confirmation.openPopup({
            message: 'Валидация не прошла!',
            style: 'danger',
            type: 'ok',
        });
    }

    protected _beforeMount(options: IDemoOptions) {
        this._isNewRecord = options.isNewRecord;
    }

    protected _onRecordChangedHandler(): void {
        this._isNewRecord = this._options.isNewRecord;
    }

    protected _editingObjectChanged(event: SyntheticEvent<Event>, newValue: Model): void {
        this._options.record.set(newValue.getRawData());
    }

    protected _updateSuccessedHandler(event: SyntheticEvent<MouseEvent>, record: Model): void {
        this._options.saveCallback(record, this._isNewRecord);
    }

    protected _saveClickHandler(): void {
        this._children.formController
            .update()
            .then((result) => {
                this._notify('close', [], { bubbling: true });

                // Т.к. FC при ошибках валидации кидает ошибку,
                // то нужен как минимум заглушечный catch, чтобы не было ошибки в консоли
            })
            .catch((error) => {
                return error;
            });
    }
}

export default BaseTemplate;
