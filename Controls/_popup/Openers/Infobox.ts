/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import Base from 'Controls/_popup/Openers/Base';
import { IInfoBoxPopupOptions } from 'Controls/_popup/interface/IInfoBoxOpener';
import { toggleActionOnScroll } from 'Controls/_popup/utils/SubscribeToScroll';
import { IPopupItemInfo } from 'Controls/_popup/interface/IPopup';
import { List } from 'Types/collection';

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:InfoBoxController';

const INFOBOX_HIDE_DELAY = 300;
const INFOBOX_SHOW_DELAY = 300;

let InfoBoxId: string;
let openTimeoutId: number;
let closeTimeoutId: number;

const DEFAULT_CONFIG = {
    borderStyle: 'secondary',
    position: 'tl',
    targetSide: 'top',
    alignment: 'start',
    floatCloseButton: false,
    closeOnOutsideClick: true,
    closeButtonVisible: true,
    actionOnScroll: 'close',
    hideDelay: INFOBOX_HIDE_DELAY,
    showDelay: INFOBOX_SHOW_DELAY,
};

/**
 * Приватный опенер подсказок.
 * @implements IInfoBoxPopupOptions
 * @remark
 * Используется для открытия окно в универсальном опенере Controls/popup:Opener
 * @private
 */
export default class InfoboxOpener extends Base<IInfoBoxPopupOptions> {
    protected _type: string = 'sticky';

    protected _controller: string = POPUP_CONTROLLER;

    protected _isAdaptive(popupOptions: IInfoBoxPopupOptions): boolean {
        return false;
    }

    open(popupOptions: IInfoBoxPopupOptions): Promise<string | void | Error> {
        const baseConfig = { ...this._options, ...popupOptions };
        if (this.isOpened()) {
            this.close(0);
        }

        InfoboxOpener._clearTimeout();

        let openPromiseResolver;
        const openPromise = new Promise<string | void | Error>((resolve) => {
            openPromiseResolver = resolve;
        });

        const openCallback = (config) => {
            return super.open(config).then((id) => {
                // На странице может быть только один инфобокс, завписываем его
                InfoBoxId = id;
                openPromiseResolver(id);
            });
        };

        const newConfig = this._getInfoBoxConfig(baseConfig);
        if (newConfig.showDelay > 0) {
            openTimeoutId = setTimeout(() => {
                openCallback(newConfig);
            }, newConfig.showDelay);
        } else {
            openCallback(newConfig);
        }
        return openPromise;
    }

    close(delay?: number): void {
        InfoboxOpener._close(() => {
            super.close(InfoBoxId);
        }, delay);
    }

    protected _setPopupId(popupOptionsId: string): void {
        super._setPopupId(popupOptionsId);
        InfoBoxId = this._popupId;
    }

    private _getInfoBoxConfig(config: IInfoBoxPopupOptions): IInfoBoxPopupOptions {
        // smart merge of two objects. Standart "core-merge util" will rewrite field value of first object even
        // if value of second object will be undefined
        const newCfg = { ...DEFAULT_CONFIG, ...config };

        if (config.targetSide || config.alignment) {
            newCfg.position = InfoboxOpener._preparePosition(config.targetSide, config.alignment);
        }

        if (!newCfg.opener) {
            newCfg.opener = newCfg.target;
        }

        newCfg.eventHandlers = newCfg.eventHandlers || {};
        const baseOnOpen = newCfg.eventHandlers.onOpen;
        const baseOnClose = newCfg.eventHandlers.onClose;
        const onOpenHandler = () => {
            if (baseOnOpen) {
                baseOnOpen();
            }
            toggleActionOnScroll(newCfg.target, true, () => {
                this.close(0);
            });
        };
        const onCloseHandler = () => {
            if (baseOnClose) {
                baseOnClose();
            }
            toggleActionOnScroll(newCfg.target, false);
        };

        newCfg.eventHandlers.onOpen = onOpenHandler;
        newCfg.eventHandlers.onClose = onCloseHandler;
        return {
            isPortal: newCfg.isPortal,
            target: newCfg.target,
            position: newCfg.position,
            autofocus: false,
            actionOnScroll: newCfg.actionOnScroll,
            maxWidth: newCfg.maxWidth,
            eventHandlers: newCfg.eventHandlers,
            closeOnOutsideClick: newCfg.closeOnOutsideClick,
            opener: newCfg.opener,
            updateCallback: newCfg.updateCallback,
            removeCallback: newCfg.removeCallback,
            zIndexCallback: (
                item: IPopupItemInfo,
                list: List<IPopupItemInfo>,
                baseZIndex: number
            ) => {
                if (newCfg.zIndex) {
                    return newCfg.zIndex;
                }
                if (item.parentZIndex) {
                    return item.parentZIndex + 1;
                }
                if (item.hasParentPage) {
                    return baseZIndex - 1;
                }
            },
            templateOptions: {
                template: newCfg.template,
                templateOptions: newCfg.templateOptions,
                message: newCfg.message,
                borderStyle: newCfg.style || newCfg.borderStyle || 'secondary',
                backgroundStyle: newCfg.backgroundStyle,
                floatCloseButton: newCfg.floatCloseButton,
                closeButtonVisible: newCfg.closeButtonVisible,
                validationStatus: newCfg.validationStatus,
                horizontalPadding: newCfg.horizontalPadding,
                theme: newCfg.theme,
                verticalPadding: newCfg.verticalPadding,
            },
            indicatorConfig: newCfg.indicatorConfig,
            template: 'Controls/popupTemplate:templateInfoBox',
            showDelay: newCfg.showDelay,
            top: newCfg.top,
            left: newCfg.left,
        };
    }

    static _close(callback: Function, delay: number = INFOBOX_HIDE_DELAY): void {
        InfoboxOpener._clearTimeout();

        if (delay > 0) {
            closeTimeoutId = setTimeout(callback, delay);
        } else {
            callback();
        }
    }

    private static _clearTimeout(): void {
        if (openTimeoutId) {
            clearTimeout(openTimeoutId);
        }
        if (closeTimeoutId) {
            clearTimeout(closeTimeoutId);
        }
    }

    private static _preparePosition(targetSide: string, alignment: string): string {
        let position = targetSide[0];
        const leftRight = {
            start: 't',
            center: 'c',
            end: 'b',
        };
        const topBottom = {
            start: 'l',
            center: 'c',
            end: 'r',
        };
        if (targetSide === 'left' || targetSide === 'right') {
            position += leftRight[alignment];
        } else {
            position += topBottom[alignment];
        }
        return position;
    }
}
