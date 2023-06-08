/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import Base from 'Controls/_popup/PopupHelper/Base';
import DialogOpener from 'Controls/_popup/Opener/Dialog';
import { IDialogPopupOptions } from 'Controls/_popup/interface/IDialog';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import getAdaptiveDesktopMode from 'Controls/_popup/utils/getAdaptiveDesktopMode';

const DEFAULT_MODE = 'dialog';

/**
 * Хелпер для открытия диалоговых окон.
 * @class Controls/_popup/PopupHelper/Dialog
 * @implements Controls/popup:IDialogOpener
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/interface:IPropStorage
 *
 * @remark
 * Для предотвращения потенциальной утечки памяти не забывайте уничтожать экземпляр опенера с помощью метода {@link Controls/popup:IDialogOpener#destroy destroy}.
 * @public
 */

export default class Dialog extends Base {
    constructor(...args) {
        super(...args);
        // @ts-ignore
        this._opener = DialogOpener;
    }

    open(popupOptions: IDialogPopupOptions): Promise<string> {
        if (unsafe_getRootAdaptiveMode().device.isPhone() && popupOptions.allowAdaptive !== false) {
            return import('Controls/popup').then((popup) => {
                const viewMode = popupOptions.adaptiveOptions?.viewMode;
                const desktopMode = getAdaptiveDesktopMode(viewMode, DEFAULT_MODE);
                return new popup.SlidingPanelOpener()
                    .open({
                        template: this._options.template,
                        id: popupOptions.id || this._popupId,
                        ...popupOptions,
                        desktopMode,
                        ...popupOptions.adaptiveOptions,
                        slidingPanelOptions: {
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
