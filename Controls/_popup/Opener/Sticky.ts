import BaseOpener, {IBaseOpenerOptions, ILoadDependencies} from 'Controls/_popup/Opener/BaseOpener';
import {IStickyOpener, IStickyPopupOptions} from 'Controls/_popup/interface/ISticky';
import {TemplateFunction} from 'UI/Base';
import Template = require('wml!Controls/_popup/Opener/Sticky');
import {detection} from 'Env/Env';
import ManagerController from 'Controls/_popup/Manager/ManagerController';
import CancelablePromise from 'Controls/_popup/utils/CancelablePromise';
import openPopup from 'Controls/_popup/utils/openPopup';

const getStickyConfig = (config) => {
    config = config || {};
    config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
    // Открывается всегда вдомным
    return config;
};

const POPUP_CONTROLLER = 'Controls/popupTemplate:StickyController';

interface IStickyOpenerOptions extends IStickyPopupOptions, IBaseOpenerOptions {}
/**
 * Контрол, открывающий всплывающее окно, которое позиционируется относительно вызывающего элемента.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/sticky/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/897d41142ed56c25fcf1009263d06508aec93c32/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 * Для открытия прилипающих окон из кода используйте {@link Controls/popup:StickyOpener}.
 * @author Красильников А.С.
 * @implements Controls/popup:IBaseOpener
 * @demo Controls-demo/Popup/Sticky/Index
 * @public
 */
class Sticky extends BaseOpener<IStickyOpenerOptions> implements IStickyOpener {
    protected _template: TemplateFunction = Template;
    readonly '[Controls/_popup/interface/IStickyOpener]': boolean;
    private _actionOnScroll: string = 'none';

    open(popupOptions: IStickyPopupOptions): Promise<string | undefined> {
        return super.open(getStickyConfig(popupOptions), POPUP_CONTROLLER);
    }

    protected _getConfig(popupOptions: IStickyOpenerOptions = {}): IStickyOpenerOptions {
        const baseConfig = super._getConfig(popupOptions);
        if (baseConfig.actionOnScroll) {
            this._actionOnScroll = baseConfig.actionOnScroll;
        }
        return baseConfig;
    }

    protected _getIndicatorConfig(): void {
        // В случае со стики глобальный индикатор только мешает, к примеру в саггесте пока вводят в поле ввода
        // зовется открытие автодополнения. при открытии глобальный индикатор блокирует нажатие клавиш и не позволяет
        // вводить символы, пока саггест не откроется, хотя в этом случае блокировка не нужна.
        // По сути так со всеми окнами, открывающимися от таргета.
        const baseConfig = super._getIndicatorConfig();
        baseConfig.isGlobal = false;
        return baseConfig;
    }

    protected _scrollHandler(event: Event, scrollEvent: Event, initiator: string): void {
        Sticky._scrollHandler(event, scrollEvent, this._actionOnScroll, this._getCurrentPopupId());
    }

    static getDefaultOptions(): IStickyOpenerOptions {
        const baseConfig: IStickyPopupOptions = BaseOpener.getDefaultOptions();
        baseConfig.actionOnScroll = 'none';
        return baseConfig;
    }

    static _openPopup(config: IStickyPopupOptions): CancelablePromise<string> {
        const newCfg = getStickyConfig(config);
        const moduleName = Sticky.prototype._moduleName;
        return openPopup(newCfg, POPUP_CONTROLLER, moduleName);
    }

    static _scrollHandler(event: Event, scrollEvent: Event, actionOnScroll: string, popupId: string): void {
        if (event.type === 'scroll') {
            // Из-за флага listenAll на listener'e, подписка доходит до application'a всегда.
            // На ios при показе клавиатуры стреляет событие скролла, что приводит к вызову текущего обработчика
            // и закрытию окна. Для ios отключаю реакцию на скролл, событие скролла стрельнуло на body.
            if (detection.isMobileIOS && (scrollEvent.target === document.body || scrollEvent.target === document)) {
                return;
            } else if (actionOnScroll === 'close') {
                BaseOpener.closeDialog(popupId);
            } else if (actionOnScroll === 'track') {
                ManagerController.popupUpdated(popupId);
            }
        }
    }

    static openPopup(config: IStickyPopupOptions): Promise<string> {
        const cancelablePromise = Sticky._openPopup(config);
        return new Promise((resolve, reject) => {
            cancelablePromise.then(resolve);
            cancelablePromise.catch(reject);
        });
    }

    static closePopup(popupId: string): void {
        BaseOpener.closeDialog(popupId);
    }
}

Object.defineProperty(Sticky, 'defaultProps', {
   enumerable: true,
   configurable: true,

   get(): object {
      return Sticky.getDefaultOptions();
   }
});

export default Sticky;
