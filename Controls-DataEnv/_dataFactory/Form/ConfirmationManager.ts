import { Model as SbisRecord } from 'Types/entity';
import rk = require('i18n!Controls-DataEnv');
import {
    IFormSliceConfirmationOptions,
    IFormSliceConfirmationOptionsSafe,
} from './IFormDataFactory';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

/*
 * Управляет механизмом подтверждения изменений в слайсе формы
 */
export class ConfirmationManager {
    private readonly _options: IFormSliceConfirmationOptionsSafe;

    private _isDisplayed: boolean = false;

    constructor(options?: IFormSliceConfirmationOptions) {
        this._options = prepareOptions(options);
    }

    confirmSave(record: SbisRecord): Promise<boolean | void> {
        if (this._isDisplayed) {
            // Защита от множ. вызова окна
            return Promise.resolve();
        }

        if (this._needShowConfirmation(record)) {
            this._showPopup()
                .then((answer) => {
                    this._isDisplayed = false;
                    if (answer === true) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.reject();
                    }
                })
                .catch(() => {
                    this._isDisplayed = false;
                });
        } else {
            return Promise.resolve(true);
        }

        return Promise.resolve(true);
    }

    reset(): void {
        this._isDisplayed = false;
    }

    protected _needShowConfirmation(record: SbisRecord): boolean {
        return this._options.needShowConfirmationCallback(record);
    }

    private async _showPopup(): Promise<string | void | Error> {
        this._isDisplayed = true;
        const { Confirmation } = await loadAsync<typeof import('Controls/popup')>('Controls/popup');
        return Confirmation.openPopup(
            {
                message: this._options.message,
                type: 'yesno',
            },
            null
        );
    }
}

function prepareOptions(
    options: IFormSliceConfirmationOptions = {}
): IFormSliceConfirmationOptionsSafe {
    return {
        message: options?.message || rk('Сохранить изменения?'),
        needShowConfirmationCallback:
            options?.needShowConfirmationCallback || isNeedShowConfirmation,
    };
}

function isNeedShowConfirmation(record: SbisRecord): boolean {
    return !!(record && record.isChanged());
}
