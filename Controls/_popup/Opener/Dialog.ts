/**
 * @kaizen_zone 02d84b65-7bf1-4508-9e22-9363de793974
 */
import BaseOpener, { IBaseOpenerOptions } from 'Controls/_popup/Opener/BaseOpener';
import { IDialogOpener, IDialogPopupOptions } from 'Controls/_popup/interface/IDialog';
import CancelablePromise from 'Controls/_popup/utils/CancelablePromise';
import { IPropStorage, IPropStorageOptions } from 'Controls/interface';
import openPopup from 'Controls/_popup/utils/openPopup';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import getAdaptiveDesktopMode from 'Controls/_popup/utils/getAdaptiveDesktopMode';
import ManagerController from 'Controls/_popup/Manager/ManagerController';

interface IDialogOpenerOptions
    extends IDialogPopupOptions,
        IBaseOpenerOptions,
        IPropStorageOptions {}

const getDialogConfig = (config: IDialogOpenerOptions): IDialogOpenerOptions => {
    config = config || {};
    // The dialog is isDefaultOpener by default. For more information,
    // see  {@link Controls/_interface/ICanBeDefaultOpener}
    config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
    return config;
};

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:DialogController';
const DEFAULT_MODE = 'dialog';

/**
 * Контрол, открывающий всплывающее окно, которое позиционируется по центру экрана.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FPopup%2FOpener%2FStackDemo%2FStackDemo демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 * Для открытия диалоговых окон из кода используйте {@link Controls/popup:DialogOpener}.
 * @implements Controls/popup:IBaseOpener
 * @demo Controls-demo/Popup/Dialog/Index
 * @public
 */
class Dialog extends BaseOpener<IDialogOpenerOptions> implements IDialogOpener, IPropStorage {
    readonly '[Controls/_popup/interface/IDialogOpener]': boolean;
    readonly '[Controls/_interface/IPropStorage]': boolean;
    protected _slidingPanelOpener;

    protected _getSlidingPanelOpener(popup): unknown {
        if (!this._slidingPanelOpener) {
            this._slidingPanelOpener = new popup.SlidingPanelOpener();
        }
        return this._slidingPanelOpener;
    }

    open(popupOptions: IDialogOpenerOptions): Promise<string | undefined> {
        const eventHandlers = {
            onResult: (...arg) => {
                if (popupOptions?.eventHandlers?.onResult) {
                    popupOptions.eventHandlers.onResult(...arg);
                }
                this._notify('result', [...arg], { bubbling: true });
            },
            onClose: (e) => {
                if (popupOptions?.eventHandlers?.onClose) {
                    popupOptions.eventHandlers.onClose(e);
                }
                this._notify('close', [e]);
            },
        };
        if (popupOptions?.eventHandlers?.onOpen) {
            eventHandlers.onOpen = popupOptions.eventHandlers.onOpen;
        }
        const templateOptions = {
            ...this._options?.templateOptions,
            ...popupOptions?.templateOptions,
        };
        const config = {
            ...popupOptions,
            ...this._options,
            eventHandlers,
            templateOptions,
        };
        if (unsafe_getRootAdaptiveMode().device.isPhone() && config.allowAdaptive !== false &&
            ManagerController.getIsAdaptive()) {
            return import('Controls/popup').then((popup) => {
                config.opener = this._getConfig(popupOptions).opener;
                return Dialog._openSliding(config, this._getSlidingPanelOpener(popup)).then(
                    (popupID) => {
                        return (this._popupId = popupID);
                    }
                );
            });
        }
        return super.open(this._getDialogConfig(popupOptions), POPUP_CONTROLLER);
    }

    private _getDialogConfig(popupOptions: IDialogOpenerOptions): IDialogOpenerOptions {
        return getDialogConfig(popupOptions);
    }

    static _openSliding(popupOptions: IDialogOpenerOptions, opener): Promise<string | undefined> {
        const viewMode = popupOptions.adaptiveOptions?.viewMode;
        const desktopMode = getAdaptiveDesktopMode(viewMode, DEFAULT_MODE);
        return opener.open({
            ...popupOptions,
            ...popupOptions.adaptiveOptions,
            desktopMode,
            slidingPanelOptions: {
                autoHeight: true,
            },
        });
    }

    static _openPopup(config: IDialogOpenerOptions): CancelablePromise<string> {
        const newCfg = getDialogConfig(config);
        const moduleName = Dialog.prototype._moduleName;
        if (unsafe_getRootAdaptiveMode().device.isPhone() && newCfg.allowAdaptive !== false &&
            ManagerController.getIsAdaptive()) {
            return import('Controls/popup').then((popup) => {
                const opener = new popup.SlidingPanelOpener();
                return Dialog._openSliding(config, opener);
            });
        }
        return openPopup(newCfg, POPUP_CONTROLLER, moduleName);
    }
    static openPopup(config: IDialogOpenerOptions): Promise<string> {
        const cancelablePromise = Dialog._openPopup(config);
        return new Promise((resolve, reject) => {
            cancelablePromise.then(resolve);
            cancelablePromise.catch(reject);
        });
    }

    static closePopup(popupId: string): void {
        BaseOpener.closeDialog(popupId);
    }
}

export default Dialog;

/**
 * Статический метод для открытия всплывающего окна. При использовании метода не требуется создавать {@link Controls/popup:Dialog} в верстке.
 * @name Controls/_popup/Opener/Dialog#openPopup
 * @function
 * @static
 * @deprecated Используйте методы класса {@link Controls/popup:DialogOpener}.
 */

/**
 * Статический метод для закрытия всплывающего окна.
 * @name Controls/_popup/Opener/Dialog#closePopup
 * @function
 * @static
 * @param {String} popupId Идентификатор окна. Такой идентификатор можно получить при открытии окна методом {@link openPopup}.
 * @deprecated Используйте методы класса {@link Controls/popup:DialogOpener}.
 */
