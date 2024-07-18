import Base from 'Controls/_popup/Openers/Base';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:StackController';

/**
 * Хелпер для открытия стековых окон.
 * @class Controls/_popup/StackOpener
 * @implements Controls/interface:IPropStorage
 * @implements Controls/popup:IStackOpener
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IBasePopupOptions
 * @implements Controls/popup:IAdaptivePopup
 *
 * @demo Controls-demo/Popup/Stack/RestrictiveContainer/Index
 * @remark
 * Для предотвращения потенциальной утечки памяти не забывайте уничтожать экземпляр опенера с помощью метода {@link Controls/_popup/PopupHelper/Stack#destroy destroy}.
 *
 * @public
 */
export default class StackOpener extends Base<IStackPopupOptions> {
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
