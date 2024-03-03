import type { ErrorController, DialogOpener, ErrorViewConfig } from 'Controls/error';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

export class ErrorManager {
    private _errorController: ErrorController;
    private _dialogOpener: DialogOpener;

    /**
     * Обработка ошибки возникшей при доступе к источнику.
     * @param {Error} error
     * @return {Promise.<CrudResult>}
     */
    async processSourceError(error: Error): Promise<void> {
        const errorController = await this._getErrorController();
        return errorController
            .process({
                error,
            })
            .then((errorConfig) => {
                if (errorConfig) {
                    //@ts-ignore
                    this._showError(errorConfig);
                }
            });
    }

    private async _showError(errorConfig: ErrorViewConfig): Promise<void> {
        const dialogOpener = await this._getDialogOpener();

        dialogOpener.open(errorConfig, {
            opener: null,
            modal: false,
        });
    }

    private async _getErrorController(): Promise<ErrorController> {
        if (this._errorController) {
            return Promise.resolve(this._errorController);
        }
        const { ErrorController } = await loadAsync<typeof import('Controls/error')>(
            'Controls/error'
        );

        return new ErrorController();
    }

    private async _getDialogOpener(): Promise<DialogOpener> {
        if (this._dialogOpener) {
            return Promise.resolve(this._dialogOpener);
        }
        const { DialogOpener } = await loadAsync<typeof import('Controls/error')>('Controls/error');

        return new DialogOpener();
    }
}
