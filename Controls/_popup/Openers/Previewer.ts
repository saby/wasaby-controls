import Base from 'Controls/_popup/Openers/Base';
import { IPreviewerPopupOptions } from 'Controls/_popup/interface/IPreviewerOpener';
import GlobalController from 'Controls/_popup/Popup/GlobalController';
import * as randomId from 'Core/helpers/Number/randomId';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';

const DISPLAY_DURATION: number = 1000;
const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:PreviewerController';

const clearChildClosingInterval = (config) => {
    if (config.childClosingIntervalId) {
        clearTimeout(config.childClosingIntervalId);
        config.childClosingIntervalId = null;
    }
};

const clearClosingTimeout = (config: IPreviewerPopupOptions) => {
    if (config.closingTimerId) {
        clearInterval(config.closingTimerId);
        config.closingTimerId = null;
    }
};

const clearOpeningTimeout = (config: IPreviewerPopupOptions) => {
    if (config.openingTimerId) {
        clearTimeout(config.openingTimerId);
        config.openingTimerId = null;
    }
};

const close = (callback: Function, config: IPreviewerPopupOptions, type?: string): void => {
    clearOpeningTimeout(config);
    clearClosingTimeout(config);
    clearChildClosingInterval(config);
    if (type === 'hover') {
        const popup = GlobalController.getController()?.find(config.id);
        if (popup?.childs?.length) {
            config.childClosingIntervalId = setInterval(() => {
                if (!popup?.childs.length) {
                    close(callback, config, type);
                    clearChildClosingInterval(config);
                }
            }, 1000);
            return;
        }
        config.closingTimerId = setTimeout(() => {
            config.closingTimerId = null;
            if (popup && popup.popupState === 'initializing') {
                // Открытие попапа происходит с задержкой
                // Если таймер закончится раньше, чем открылся попап, перезапускаем его
                close(callback, config, type);
            } else {
                callback();
            }
        }, config.delay || DISPLAY_DURATION);
    } else {
        callback();
    }
};

const cancel = (config: IPreviewerPopupOptions, action: string): void => {
    switch (action) {
        case 'opening':
            config.isCancelOpening = true;
            clearOpeningTimeout(config);
            break;
        case 'closing':
            clearClosingTimeout(config);
            clearChildClosingInterval(config);
            break;
    }
};

export default class Previewer extends Base<IPreviewerPopupOptions> {
    protected _adaptiveOptions: {
        slidingPanelOptions: {};
        defaultMode: string;
    } = {
        slidingPanelOptions: {
            autoHeight: true,
        },
        defaultMode: 'sticky',
    };

    protected _type: string = 'sticky';

    protected _controller: string = POPUP_CONTROLLER;

    private _currentConfig: IPreviewerPopupOptions = {};

    open(popupOptions: IPreviewerPopupOptions, type?: string): Promise<string | void | Error> {
        return new Promise((resolve) => {
            const config = { ...this._options, ...popupOptions };

            config.closeOnOutsideClick = true;
            config.className = 'controls-PreviewerController';

            clearOpeningTimeout(config);
            clearClosingTimeout(config);
            clearChildClosingInterval(config);
            config.id = config.id || randomId('popup-');
            if (type === 'hover') {
                config.openingTimerId = setTimeout(() => {
                    config.openingTimerId = null;
                    this._currentConfig = config;
                    super.open(config);
                }, config.delay || DISPLAY_DURATION);
            } else {
                this._currentConfig = config;
                super.open(config);
            }
            resolve(config);
        });
    }

    close(config, type): void {
        close(
            () => {
                super.close(config?.id);
            },
            config || this._currentConfig,
            type
        );
    }

    cancel(action: string, config?: IPreviewerPopupOptions): void {
        if (config) {
            cancel(config || this._currentConfig, action);
        }
    }

    protected _isAdaptive(popupOptions: IPreviewerPopupOptions): boolean {
        return (
            unsafe_getRootAdaptiveMode().device.isPhone() &&
            !!popupOptions.allowAdaptive &&
            GlobalController.getIsAdaptive()
        );
    }

    destroy(): void {
        clearClosingTimeout(this._currentConfig);
        clearOpeningTimeout(this._currentConfig);
        clearChildClosingInterval(this._currentConfig);
        super.destroy();
    }
}
