/**
 * @kaizen_zone 02d84b65-7bf1-4508-9e22-9363de793974
 */
import Base from 'Controls/_popup/Openers/Base';
import { IDialogPopupOptions } from 'Controls/_popup/interface/IDialog';
import { getAdaptiveModeForLoaders } from 'UI/Adaptive';
import GlobalController from 'Controls/_popup/Popup/GlobalController';

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:DialogController';

/**
 * Хелпер для открытия диалоговых окон.
 * @class Controls/_popup/DialogOpener
 * @implements Controls/popup:IDialogOpener
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IAdaptivePopup
 * @implements Controls/interface:IPropStorage
 *
 * @remark
 * Для предотвращения потенциальной утечки памяти не забывайте уничтожать экземпляр опенера с помощью метода {@link Controls/popup:IDialogOpener#destroy destroy}.
 * @public
 */
export default class DialogOpener extends Base<IDialogPopupOptions> {
    protected _adaptiveOptions: {
        slidingPanelOptions: {};
        defaultMode: string;
    } = {
        slidingPanelOptions: {
            autoHeight: true,
        },
        defaultMode: 'dialog',
    };

    protected _type: string = 'dialog';

    protected _slidingPanelOpener;

    protected _controller: string = POPUP_CONTROLLER;

    protected _isAdaptive(popupOptions: IDialogPopupOptions): boolean {
        return (
            getAdaptiveModeForLoaders().device.isPhone() &&
            popupOptions.allowAdaptive !== false &&
            GlobalController.getIsAdaptive()
        );
    }

    open(popupOptions: IDialogPopupOptions = {}): Promise<string | void | Error> {
        const config: IDialogPopupOptions = {
            resizeDirection: {
                horizontal: 'right',
                vertical: 'bottom',
            },
            ...popupOptions,
        };
        return super.open(config);
    }
}
