import { loadAsync } from 'WasabyLoader/ModulesLoader';

export class ErrorManager {
    // не можем взять тип из Controls/error:ErrorController чтобы не иметь статическую зависимость
    private _errorController: any;
    // не можем взять тип из Controls/error:DialogOpener чтобы не иметь статическую зависимость
    private _dialogOpener: any;

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
            .then((errorConfig: unknown) => {
                if (errorConfig) {
                    //@ts-ignore
                    this._showError(errorConfig);
                }
            });
    }

    // не можем взять тип из Controls/error:ErrorViewConfig чтобы не иметь статическую зависимость
    private async _showError(errorConfig: unknown): Promise<void> {
        const dialogOpener = await this._getDialogOpener();

        dialogOpener.open(errorConfig, {
            opener: null,
            modal: false,
        });
    }

    // не можем взять тип из Controls/error:ErrorController чтобы не иметь статическую зависимость
    private async _getErrorController(): Promise<any> {
        if (this._errorController) {
            return Promise.resolve(this._errorController);
        }
        const { ErrorController } = await loadAsync('Controls/error');

        return new ErrorController();
    }

    // не можем взять тип из Controls/error:DialogOpener чтобы не иметь статическую зависимость
    private async _getDialogOpener(): Promise<any> {
        if (this._dialogOpener) {
            return Promise.resolve(this._dialogOpener);
        }
        const { DialogOpener } = await loadAsync('Controls/error');

        return new DialogOpener();
    }
}
