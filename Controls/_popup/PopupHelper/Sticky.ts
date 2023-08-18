/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import Base from 'Controls/_popup/PopupHelper/Base';
import StickyOpener from 'Controls/_popup/Opener/Sticky';
import { IStickyPopupOptions, TActionOnScroll, TTarget } from 'Controls/_popup/interface/ISticky';
import { toggleActionOnScroll } from 'Controls/_popup/utils/SubscribeToScroll';
import * as randomId from 'Core/helpers/Number/randomId';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import getAdaptiveDesktopMode from 'Controls/_popup/utils/getAdaptiveDesktopMode';
import ManagerController from 'Controls/_popup/Manager/ManagerController';

const DEFAULT_MODE = 'dialog';

/**
 * Хелпер для открытия прилипающих окон
 * @implements Controls/popup:IStickyOpener
 * @implements Controls/popup:IBaseOpener
 * @remark
 * Для предотвращения потенциальной утечки памяти не забывайте уничтожать экземпляр опенера с помощью метода {@link Controls/_popup/PopupHelper/Sticky#destroy destroy}.
 *
 * @public
 */

export default class Sticky extends Base {
    protected _opener = StickyOpener;
    private _instanceId: string = randomId('stickyPopup-');
    private _target: TTarget;
    private _actionOnScroll: TActionOnScroll;
    protected _slidingPanelOpener;

    protected _getSlidingPanelOpener(popup): unknown {
        if (!this._slidingPanelOpener) {
            this._slidingPanelOpener = new popup.SlidingPanelOpener();
        }
        return this._slidingPanelOpener;
    }

    constructor(config: IStickyPopupOptions = {}) {
        super(config);
        this._updateState(config);
    }

    open(popupOptions: IStickyPopupOptions = {}): Promise<string> {
        const openPopup = () => {
            if (
                unsafe_getRootAdaptiveMode().device.isPhone() &&
                popupOptions.allowAdaptive !== false &&
                ManagerController.getIsAdaptive()
            ) {
                return import('Controls/popup').then((popup) => {
                    const viewMode = popupOptions.adaptiveOptions?.viewMode;
                    const desktopMode = getAdaptiveDesktopMode(viewMode, DEFAULT_MODE);
                    return this._getSlidingPanelOpener(popup)
                        .open({
                            template: this._options.template,
                            ...popupOptions,
                            desktopMode,
                            ...popupOptions.adaptiveOptions,
                            slidingPanelOptions: {
                                autoHeight: true,
                            },
                        })
                        .then((popupId) => {
                            this._popupId = popupId;
                        });
                });
            }
            this._updateState(popupOptions);
            return super.open(popupOptions);
        };
        return openPopup();
    }

    // Для Корректной работы registerUtil, хэлпер работат с контролом
    getInstanceId(): string {
        return this._instanceId;
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
        StickyOpener._scrollHandler(scrollEvent, this._actionOnScroll, this._popupId);
    }

    private _updateState(options: IStickyPopupOptions): void {
        if (options.actionOnScroll) {
            this._actionOnScroll = options.actionOnScroll;
        }
        if (options.target) {
            this._target = options.target;
        }
    }
}
