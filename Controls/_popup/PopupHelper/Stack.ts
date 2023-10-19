/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import Base from 'Controls/_popup/PopupHelper/Base';
import StackOpener from 'Controls/_popup/Opener/Stack';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import getAdaptiveDesktopMode from 'Controls/_popup/utils/getAdaptiveDesktopMode';

const DEFAULT_MODE = 'stack';

/**
 * Хелпер для открытия стековых окон.
 * @implements Controls/interface:IPropStorage
 * @implements Controls/popup:IStackOpener
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IBasePopupOptions
 *
 * @remark
 * Для предотвращения потенциальной утечки памяти не забывайте уничтожать экземпляр опенера с помощью метода {@link Controls/_popup/PopupHelper/Stack#destroy destroy}.
 *
 * @public
 */
export default class Stack extends Base {
    // @ts-ignore
    _opener = StackOpener;
    protected _slidingPanelOpener;

    protected _getSlidingPanelOpener(popup): {
        open: (unknown) => Promise<string>;
    } {
        if (!this._slidingPanelOpener) {
            this._slidingPanelOpener = new popup.SlidingPanelOpener();
        }
        return this._slidingPanelOpener;
    }

    open(popupOptions: IStackPopupOptions): Promise<void> {
        if (unsafe_getRootAdaptiveMode().device.isPhone() && popupOptions.allowAdaptive) {
            return import('Controls/popup').then((popup) => {
                const viewMode = popupOptions.adaptiveOptions?.viewMode;
                const desktopMode = getAdaptiveDesktopMode(viewMode, DEFAULT_MODE);
                return this._getSlidingPanelOpener(popup)
                    .open({
                        template: this._options.template,
                        ...popupOptions,
                        ...popupOptions.adaptiveOptions,
                        slidingPanelOptions: {
                            desktopMode,
                            autoHeight: true,
                        },
                    })
                    .then((id) => {
                        return (this._popupId = id);
                    });
            });
        }
        return super.open(popupOptions);
    }
}
