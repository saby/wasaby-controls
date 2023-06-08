/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import cClone = require('Core/core-clone');
import { IPopupItemInfo } from 'Controls/_popup/interface/IPopup';
import BaseOpener, {
    IBaseOpenerOptions,
    ILoadDependencies,
} from 'Controls/_popup/Opener/BaseOpener';
import getZIndex = require('Controls/Utils/getZIndex');
import { DefaultOpenerFinder } from 'UI/Focus';
import {
    IInfoBoxPopupOptions,
    IInfoBoxOpener,
} from 'Controls/_popup/interface/IInfoBoxOpener';
import { toggleActionOnScroll } from 'Controls/_popup/utils/SubscribeToScroll';

/**
 * Component that opens a popup that is positioned relative to a specified element. {@link /doc/platform/developmentapl/interface-development/controls/openers/infobox/ see more}.
 * @remark
 * Private control. This control uses Popup/Infobox and Application to open popup on openInfobox events
 * @class Controls/_popup/Opener/InfoBox
 * @mixes Controls/popup:IInfoBoxOpener
 * @extends UI/Base:Control
 *
 * @private
 *
 * @private
 */

const INFOBOX_HIDE_DELAY = 300;
const INFOBOX_SHOW_DELAY = 300;
const POPUP_CONTROLLER = 'Controls/popupTemplate:InfoBoxController';
const Z_INDEX_STEP = 10;

// Default popup configuration
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

let InfoBoxId: string;
let openId: number;
let closeId: number;

interface IInfoBoxOpenerOptions
    extends IInfoBoxPopupOptions,
        IBaseOpenerOptions {
    templateOptions?: IInfoBoxPopupOptions;
}

class InfoBox
    extends BaseOpener<IInfoBoxOpenerOptions>
    implements IInfoBoxOpener
{
    readonly '[Controls/_popup/interface/IInfoBoxOpener]': boolean;
    _style: number = null;
    _openId: number | void;

    _beforeUnmount(): void {
        this.close(0);
    }

    open(cfg: IInfoBoxPopupOptions): void {
        // Only one popup can be opened
        if (this.isOpened()) {
            this.close(0);
        }
        this._openId = InfoBox._open((newCfg: object) => {
            const result = super.open(newCfg, POPUP_CONTROLLER);
            result.then((popupId) => {
                InfoBoxId = popupId;
            });
        }, cfg);
    }

    _getIndicatorConfig(): void {
        // В случае с подсказкой оверлей не нужен. Только мешает работе ховеров для открытия/закрытия.
        // Открытие подсказки всегда быстрее 2с, поэтому визуально оверлея с индикатором не появляется.
        const baseConfig = super._getIndicatorConfig();
        baseConfig.overlay = 'none';
        return baseConfig;
    }

    close(delay?: number): void {
        InfoBox._close(
            () => {
                super.close();
            },
            delay,
            this._openId
        );
    }

    private static _getInfoBoxConfig(
        cfg: IInfoBoxPopupOptions
    ): IInfoBoxOpenerOptions {
        // smart merge of two objects. Standart "core-merge util" will rewrite field value of first object even
        // if value of second object will be undefined
        const newCfg = cClone(DEFAULT_CONFIG);
        cfg = cfg || {};
        for (const i in cfg) {
            if (cfg.hasOwnProperty(i)) {
                if (cfg[i] !== undefined) {
                    newCfg[i] = cfg[i];
                }
            }
        }

        if (cfg.targetSide || cfg.alignment) {
            newCfg.position = InfoBox._preparePosition(
                cfg.targetSide,
                cfg.alignment
            );
        }

        // Find opener for InfoBox
        if (!newCfg.opener && newCfg.target) {
            newCfg.opener = DefaultOpenerFinder.find(newCfg.target);
        }

        newCfg.eventHandlers = newCfg.eventHandlers || {};
        const baseOnOpen = newCfg.eventHandlers.onOpen;
        const baseOnClose = newCfg.eventHandlers.onClose;
        const onOpenHandler = () => {
            if (baseOnOpen) {
                baseOnOpen();
            }
            toggleActionOnScroll(newCfg.target, true, () => {
                InfoBox.closePopup(0);
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

        // Высчитывается только на старой странице через утилиту getZIndex, т.к. открывать инфобокс могут со старых окон
        // Аналогично новому механизму, zIndex инфобокса на 1 больше родительского.
        const zIndex =
            newCfg.zIndex ||
            getZIndex(newCfg.opener || this) - (Z_INDEX_STEP - 1);
        return {
            // todo: https://online.sbis.ru/doc/7c921a5b-8882-4fd5-9b06-77950cbe2f79
            target: (newCfg.target && newCfg.target[0]) || newCfg.target,
            position: newCfg.position,
            autofocus: false,
            actionOnScroll: newCfg.actionOnScroll,
            maxWidth: newCfg.maxWidth,
            eventHandlers: newCfg.eventHandlers,
            closeOnOutsideClick: newCfg.closeOnOutsideClick,
            opener: newCfg.opener,
            zIndexCallback: (item: IPopupItemInfo) => {
                if (zIndex) {
                    return zIndex;
                }
                if (item.parentZIndex) {
                    return item.parentZIndex + 1;
                }
            },
            templateOptions: {
                // for template: Opener/InfoBox/resources/template
                template: newCfg.template,
                templateOptions: newCfg.templateOptions, // for user template: newCfg.template
                message: newCfg.message,
                borderStyle: newCfg.style || newCfg.borderStyle || 'secondary',
                backgroundStyle: newCfg.backgroundStyle,
                floatCloseButton: newCfg.floatCloseButton,
                closeButtonVisible: newCfg.closeButtonVisible,
                validationStatus: newCfg.validationStatus,
                horizontalPadding: newCfg.horizontalPadding,
                theme: newCfg.theme,
            },
            template: 'Controls/popupTemplate:templateInfoBox',
            showDelay: newCfg.showDelay,
        };
    }

    private static _preparePosition(
        targetSide: string,
        alignment: string
    ): string {
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

    private static _clearTimeout(): void {
        if (openId) {
            clearTimeout(openId);
        }
        if (closeId) {
            clearTimeout(closeId);
        }
    }

    private static _close(
        callback: Function,
        delay: number = INFOBOX_HIDE_DELAY,
        openerOpenId?: number
    ): void {
        if (closeId) {
            clearTimeout(closeId);
        }

        /*
            Если имеем инстанс и закрываем инфоблок,
            то отменяем открытие только в том случае, если окно открывается тем же инстансом
            Кейс: инфоблок закрывается с бОльшим таймаутом, чем открывается,
            т.е. закрытие предыдущего инфоблока вызовется позже чем открытие текущего
            и текущий инфоблок вообще не откроется
         */
        if (openId && (!openerOpenId || openerOpenId === openId)) {
            clearTimeout(openId);
        }
        if (delay > 0) {
            closeId = setTimeout(callback, delay);
        } else {
            callback();
        }
    }

    private static _open(
        callback: Function,
        cfg: IInfoBoxPopupOptions
    ): void | number {
        InfoBox._clearTimeout();

        const newCfg: IInfoBoxOpenerOptions = InfoBox._getInfoBoxConfig(cfg);
        if (newCfg.showDelay > 0) {
            openId = setTimeout(() => {
                callback(newCfg);
            }, newCfg.showDelay);
            return openId;
        } else {
            callback(newCfg);
        }
    }

    static openPopup(config: IInfoBoxPopupOptions): void {
        InfoBox._open((newCfg) => {
            BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then(
                (result: ILoadDependencies) => {
                    BaseOpener.showDialog(
                        result.template,
                        newCfg,
                        result.controller
                    ).then((popupId: string) => {
                        InfoBoxId = popupId;
                    });
                }
            );
        }, config);
    }

    static closePopup(delay?: number): void {
        InfoBox._close(() => {
            BaseOpener.closeDialog(InfoBoxId);
        }, delay);
    }

    static getDefaultOptions(): IInfoBoxOpenerOptions {
        const options = BaseOpener.getDefaultOptions();

        options.actionOnScroll = 'close';
        options.showIndicator = false;
        return options;
    }
}

export default InfoBox;
