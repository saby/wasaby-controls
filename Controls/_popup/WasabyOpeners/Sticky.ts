import BaseOpener from './BaseOpener';
import StickyOpener from '../Openers/Sticky';
import { IStickyPopupOptions } from 'Controls/_popup/interface/ISticky';

/**
 * Контрол, открывающий всплывающее окно, которое позиционируется относительно вызывающего элемента.
 * @class Controls/_popup/Sticky
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/sticky/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
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
