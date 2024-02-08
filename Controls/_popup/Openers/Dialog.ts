import Base from 'Controls/_popup/Openers/Base';
import { IDialogPopupOptions } from 'Controls/_popup/interface/IDialog';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:DialogController';

export default class Dialog extends Base {
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
            unsafe_getRootAdaptiveMode().device.isPhone() && popupOptions.allowAdaptive !== false
        );
    }
}