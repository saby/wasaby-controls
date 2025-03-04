/**
 * @kaizen_zone 75e61337-2408-4b9e-b6c7-556929cedca1
 */
import BaseOpener from './BaseOpener';
import StickyOpener from '../Openers/Sticky';
import { IStickyPopupOptions } from 'Controls/_popup/interface/ISticky';

/**
 * Контрол, открывающий всплывающее окно, которое позиционируется относительно вызывающего элемента.
 * @class Controls/_popup/Sticky
 * @remark
 * Полезные ссылки:
 * <ul>
 *     <li>{@link https://n.sbis.ru/article/7c32a8ae-6e9b-4859-b9d3-7e7237663a6e руководство разработчика}</li>
 *     <li>{@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}</li>
 * </ul>
 * Для открытия прилипающих окон из кода используйте {@link Controls/popup:StickyOpener}.
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IAdaptivePopup
 * @demo Controls-demo/Popup/Sticky/Index
 * @public
 */
export default class Sticky extends BaseOpener<IStickyPopupOptions> {
    protected _popupOpener: StickyOpener = new StickyOpener();

    static openPopup(popupOptions: IStickyPopupOptions): Promise<string | void | Error> {
        return new StickyOpener().open(popupOptions);
    }
}
