/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import Base from 'Controls/_popup/PopupHelper/Base';
import StackOpener from 'Controls/_popup/Opener/Stack';
import { getConfig } from 'Application/Env';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import getAdaptiveDesktopMode from 'Controls/_popup/utils/getAdaptiveDesktopMode';

/**
 * Хелпер для открытия стековых окон.
 * @class Controls/_popup/PopupHelper/Stack
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

const DEFAULT_MODE = 'stack';

export default class Stack extends Base {
    _opener = StackOpener;
    open(popupOptions: IStackPopupOptions): Promise<void> {
        if (getConfig('isAdaptive') && popupOptions.allowAdaptive) {
            return import('Controls/popup').then((popup) => {
                const viewMode = popupOptions.adaptiveOptions?.viewMode;
                const desktopMode = getAdaptiveDesktopMode(
                    viewMode,
                    DEFAULT_MODE
                );
                return new popup.SlidingPanelOpener().open({
                    template: this._options.template,
                    ...popupOptions,
                    ...popupOptions.adaptiveOptions,
                    slidingPanelOptions: {
                        desktopMode,
                        autoHeight: true,
                    },
                });
            });
        }
        return super.open(popupOptions);
    }
}
