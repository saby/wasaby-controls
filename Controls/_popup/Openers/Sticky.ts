import Base from 'Controls/_popup/Openers/Base';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import * as randomId from 'Core/helpers/Number/randomId';
import { toggleActionOnScroll } from 'Controls/_popup/utils/SubscribeToScroll';
import { detection } from 'Env/Env';
import GlobalController from 'Controls/_popup/Popup/GlobalController';
import { IStickyPopupOptions, TActionOnScroll, TTarget } from 'Controls/_popup/interface/ISticky';

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:StickyController';

export default class Sticky extends Base {
    private _instanceId: string = randomId('stickyPopup-');

    private _target: TTarget;
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
            unsafe_getRootAdaptiveMode().device.isPhone() && popupOptions.allowAdaptive !== false
        );
    }

    protected _openHandler(): void {
        super._openHandler();
        if (this._actionOnScroll) {
            toggleActionOnScroll(this._target, true, (scrollEvent: Event) => {
                this._scrollHandler(scrollEvent);
            });
        }
    }

    protected _closeHandler(): void {
        super._closeHandler();
        if (this._actionOnScroll) {
            toggleActionOnScroll(this._target, false);
        }
    }

    protected _scrollHandler(scrollEvent: Event): void {
        if (scrollEvent.type === 'scroll' || scrollEvent.type === 'customscroll') {
            // Из-за флага listenAll на listener'e, подписка доходит до application'a всегда.
            // На ios при показе клавиатуры стреляет событие скролла, что приводит к вызову текущего обработчика
            // и закрытию окна. Для ios отключаю реакцию на скролл, событие скролла стрельнуло на body.
            if (
                detection.isMobileIOS &&
                (scrollEvent.target === document.body || scrollEvent.target === document)
            ) {
                return;
            } else if (this._actionOnScroll === 'close') {
                GlobalController.getController()?.remove(this._popupId);
            } else if (this._actionOnScroll === 'track') {
                GlobalController.getController()?.eventHandler('pageScrolled', []);
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
