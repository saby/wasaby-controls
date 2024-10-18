/**
 * @kaizen_zone 4eca12bb-c964-409a-b853-a3803e6a37a3
 */
import Base from 'Controls/_popup/Openers/Base';
import { IConfirmationOptions } from 'Controls/_popup/interface/IConfirmation';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:DialogController';

/**
 * Приватный опенер окон подверждения
 * @remark
 * Используется для открытия окно в универсальном опенере Controls/popup:Opener
 * @private
 */
export default class ConfirmationOpener extends Base {
    protected _type: string = 'confirmation';
    protected _controller: string = POPUP_CONTROLLER;

    open(popupOptions: IConfirmationOptions): Promise<boolean | undefined> {
        return new Promise((resolve) => {
            const baseConfig = { ...this._options, ...popupOptions };
            const config = ConfirmationOpener._getConfig(baseConfig, resolve);
            super.open(config);
        });
    }

    protected _isAdaptive(popupOptions: IConfirmationOptions): boolean {
        return false;
    }

    private static _getConfig(
        templateOptions: IConfirmationOptions,
        closeHandler: Function
    ): IConfirmationOptions {
        templateOptions.closeHandler = closeHandler;
        const popupOptions: IConfirmationOptions = {
            template: 'Controls/popupTemplate:ConfirmationDialog',
            topPopup: true,
            modal: true,
            opener: templateOptions.opener,
            autofocus: true,
            className: 'controls-Confirmation_popup',
            isCentered: true,
            templateOptions,
            allowAdaptive: false,
        };
        ConfirmationOpener._compatibleOptions(popupOptions);
        return popupOptions;
    }

    private static _compatibleOptions(popupOptions: IConfirmationOptions): void {
        const OLD_ENVIRONMENT_Z_INDEX = 5000;
        popupOptions.zIndex = popupOptions.zIndex || popupOptions.templateOptions.zIndex;
        if (!isNewEnvironment()) {
            // For the old page, set the zIndex manually
            popupOptions.zIndex = OLD_ENVIRONMENT_Z_INDEX;
        }
    }
}
