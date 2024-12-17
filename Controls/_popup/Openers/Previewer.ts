/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import Base from 'Controls/_popup/Openers/Base';
import { IPreviewerPopupOptions } from 'Controls/_popup/interface/IPreviewerOpener';
import GlobalController from 'Controls/_popup/Popup/GlobalController';
import * as randomId from 'Core/helpers/Number/randomId';
import { getAdaptiveModeForLoaders } from 'UI/Adaptive';

const DISPLAY_DURATION: number = 1000;
const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:PreviewerController';

/**
 * Отчищает таймаут закрытия доченрих окон
 * @param {IPreviewerPopupOptions} config
 * @returns void
 */
const clearChildClosingInterval = (config) => {
    if (config.childClosingIntervalId) {
        clearTimeout(config.childClosingIntervalId);
        config.childClosingIntervalId = null;
    }
};

/**
 * Отчищает таймаут закрытия окна
 * @param {IPreviewerPopupOptions} config
 * @returns void
 */
const clearClosingTimeout = (config: IPreviewerPopupOptions) => {
    if (config.closingTimerId) {
        clearInterval(config.closingTimerId);
        config.closingTimerId = null;
    }
};

/**
 * Отчищает таймаут открытия окна
 * @param {IPreviewerPopupOptions} config
 * @returns void
 */

const clearOpeningTimeout = (config: IPreviewerPopupOptions) => {
    if (config.openingTimerId) {
        clearTimeout(config.openingTimerId);
        config.openingTimerId = null;
    }
};

/**
 * Закрывает окно
 * @param {Function} callback
 * @param {IPreviewerPopupOptions} config
 * @param {String} type
 * @returns void
 */
const close = (callback: Function, config: IPreviewerPopupOptions, type?: string): void => {
    clearOpeningTimeout(config);
    clearClosingTimeout(config);
    clearChildClosingInterval(config);
    if (type === 'hover' || config.type === 'hover') {
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

/**
 * Отменяет открытие/закрытие окна по таймауту.
 * @param {IPreviewerPopupOptions} config
 * @param {String} action
 * @returns void
 */
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

/**
 * Приватный опенер превьювера
 * @implements IPreviewerPopupOptions
 * @remark
 * Используется для открытия окно в универсальном опенере Controls/popup:Opener
 * @private
 */
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
            let openResolve;
            const openPromise = new Promise((resolve) => {
                openResolve = resolve;
            });
            config.id = config.id || randomId('popup-');
            if (type === 'hover' || popupOptions.type === 'hover') {
                config.openingTimerId = setTimeout(() => {
                    config.openingTimerId = null;
                    this._currentConfig = config;
                    super.open(config).then(() => {
                        openResolve();
                    });
                }, config.delay || DISPLAY_DURATION);
            } else {
                this._currentConfig = config;
                super.open(config).then(() => {
                    openResolve();
                });
            }
            popupOptions.eventHandlers?.onStartOpening?.(config);
            // Для работы через типажи сводим API открываторов
            if (popupOptions.isPortal) {
                openPromise.then(() => {
                    resolve(config.id);
                });
            } else {
                resolve(config);
            }
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
        Previewer.cancel(config || this._currentConfig, action);
    }

    protected _isAdaptive(popupOptions: IPreviewerPopupOptions): boolean {
        return (
            getAdaptiveModeForLoaders().device.isPhone() &&
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

    static cancel(action: string, config?: IPreviewerPopupOptions): void {
        if (config) {
            cancel(config, action);
        }
    }
}
