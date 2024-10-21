/**
 * @kaizen_zone 75e61337-2408-4b9e-b6c7-556929cedca1
 */
import Base from 'Controls/_popup/Openers/Base';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import { getAdaptiveModeForLoaders } from 'UI/Adaptive';
import * as randomId from 'Core/helpers/Number/randomId';
import { toggleActionOnScroll } from 'Controls/_popup/utils/SubscribeToScroll';
import { constants, detection } from 'Env/Env';
import GlobalController from 'Controls/_popup/Popup/GlobalController';
import { IStickyPopupOptions, TActionOnScroll, TTarget } from 'Controls/_popup/interface/ISticky';


function isKeyboardVisible() {
    if (constants.isBrowserPlatform && document.activeElement) {
        const isInput = document.activeElement.tagName === 'INPUT';
        const isTextArea = document.activeElement.tagName === 'TEXTAREA';
        const isContentEditable = document.activeElement.getAttribute('contenteditable') === 'true';

        if (isInput || isTextArea || isContentEditable) {
            return true;
        }
    }
    return false;
}

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:StickyController';

/**
 * Хелпер для открытия прилипающих окон
 * @class Controls/_popup/StickyOpener
 * @implements Controls/popup:IStickyOpener
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IAdaptivePopup
 * @remark
 * Для предотвращения потенциальной утечки памяти не забывайте уничтожать экземпляр опенера с помощью метода {@link Controls/_popup/PopupHelper/Sticky#destroy destroy}.
 *
 * @public
 */
export default class StickyOpener extends Base<IStickyPopupOptions> {
    private _instanceId: string = randomId('stickyPopup-');

    private _target: TTarget;
    private _targetControl: TTarget;
    private _actionOnScroll: TActionOnScroll;
    protected _adaptiveOptions: {
        slidingPanelOptions: {};
        defaultMode: string;
    } = {
        slidingPanelOptions: {
            autoHeight: true,
        },
        defaultMode: 'dialog',
    };

    protected _type: string = 'sticky';

    protected _slidingPanelOpener;

    protected _controller: string = POPUP_CONTROLLER;

    constructor(config: IStickyPopupOptions = {}) {
        super(config);
        this._updateState(config);
    }

    open(popupOptions: IStickyPopupOptions): Promise<string | void | Error> {
        this._updateState(popupOptions);
        return super.open(popupOptions);
    }

    // Для Корректной работы registerUtil, хэлпер работат с контролом
    getInstanceId(): string {
        return this._instanceId;
    }

    protected _isAdaptive(popupOptions: IStackPopupOptions): boolean {
        return (
            getAdaptiveModeForLoaders().device.isPhone() &&
            popupOptions.allowAdaptive !== false &&
            GlobalController.getIsAdaptive()
        );
    }

    protected _openHandler(): void {
        super._openHandler();
        if (this._actionOnScroll) {
            this._targetControl = toggleActionOnScroll(
                this._target,
                true,
                this._popupId,
                (scrollEvent: Event) => {
                    this._scrollHandler(scrollEvent);
                }
            );
        }
    }

    protected _closeHandler(): void {
        if (this._actionOnScroll) {
            toggleActionOnScroll(this._targetControl || this._target, false, this._popupId);
        }
        super._closeHandler();
    }

    destroy(): void {
        super.destroy();
        this._target = null;
    }

    protected _scrollHandler(scrollEvent: Event): void {
        if (scrollEvent.type === 'scroll' || scrollEvent.type === 'customscroll') {
            // Из-за флага listenAll на listener'e, подписка доходит до application'a всегда.
            // На ios при показе клавиатуры стреляет событие скролла, что приводит к вызову текущего обработчика
            // и закрытию окна. Для ios отключаю реакцию на скролл, событие скролла стрельнуло на body.
            if (
                detection.isMobileIOS &&
                (scrollEvent.target === document.body || scrollEvent.target === document) &&
                isKeyboardVisible()
            ) {
                return;
            }
            if (this._actionOnScroll === 'close') {
                GlobalController.getController()?.remove(this._popupId);
            } else if (this._actionOnScroll === 'track') {
                GlobalController.getController()?.eventHandler('pageScrolled', []);
            } else if (this._actionOnScroll === 'hide') {
                GlobalController.getController()?.eventHandler('hideOnScroll', [this._popupId]);
            }
        }
    }

    private _updateState(options: IStickyPopupOptions): void {
        if (options?.actionOnScroll) {
            this._actionOnScroll = options.actionOnScroll;
        }
        if (options?.target) {
            this._target = options.target;
        }
    }
}
