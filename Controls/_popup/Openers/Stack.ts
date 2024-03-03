import Base from 'Controls/_popup/Openers/Base';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:StackController';

export default class Stack extends Base<IStackPopupOptions> {
    protected _adaptiveOptions: {
        slidingPanelOptions: {};
        defaultMode: string;
    } = {
        slidingPanelOptions: {
            autoHeight: true,
        },
        defaultMode: 'stack',
    };

    protected _type: string = 'stack';

    protected _controller: string = POPUP_CONTROLLER;

    protected _isAdaptive(popupOptions: IStackPopupOptions): boolean {
        return unsafe_getRootAdaptiveMode().device.isPhone() && popupOptions.allowAdaptive;
    }
}
