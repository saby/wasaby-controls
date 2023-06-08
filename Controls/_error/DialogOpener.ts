/**
 * @kaizen_zone 6c2c3a3e-9f32-4e3f-a2ed-d6042ebaaf7c
 */
import { IBasePopupOptions } from 'Controls/popup';
import { ErrorViewConfig } from 'ErrorHandling/interface';
import Popup, { IPopupHelper, PopupId } from './Popup';

/**
 * Класс позволяет открывать диалог дружелюбных ошибок и работать с ним.
 * @class Controls/_error/DialogOpener
 * @private
 */
export default class DialogOpener {
    private _popupHelper: IPopupHelper;
    private _popupId: PopupId | void;

    constructor(options?: { _popupHelper?: IPopupHelper }) {
        this._popupHelper = options?._popupHelper || new Popup();
    }

    /**
     * Дополняет опции открытия диалога
     * @param dialogOptions
     * @private
     */
    private getDialogOptions(dialogOptions: IBasePopupOptions): IBasePopupOptions {
        const options: IBasePopupOptions = {
            ...dialogOptions,
        };

        if (this._popupId) {
            options.id = this._popupId;
        }

        options.eventHandlers = {
            ...options.eventHandlers,
            onClose: () => {
                this._popupId = null;
                dialogOptions?.eventHandlers?.onClose();
            },
        };

        return options;
    }

    open(viewConfig: ErrorViewConfig, dialogOptions: IBasePopupOptions): Promise<void> {
        if (!viewConfig) {
            return Promise.resolve();
        }

        return this._popupHelper
            .openDialog(viewConfig, this.getDialogOptions(dialogOptions))
            .then((popupId) => {
                this._popupId = popupId;
            });
    }

    close(): Promise<void> {
        return this._popupId ? this._popupHelper.closeDialog(this._popupId) : Promise.resolve();
    }

    destroy(): void {
        this.close();
        this._popupId = null;
    }
}
