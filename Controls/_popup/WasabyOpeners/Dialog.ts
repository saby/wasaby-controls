import BaseOpener, { IBaseOpenerOptions } from './BaseOpener';
import { IDialogPopupOptions } from 'Controls/_popup/interface/IDialog';
import DialogOpener from '../Openers/Dialog';

interface IDialogOpenerOptions extends IDialogPopupOptions, IBaseOpenerOptions {}

/**
 * Контрол, открывающий всплывающее окно, которое позиционируется по центру экрана.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FPopup%2FOpener%2FStackDemo%2FStackDemo демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/dialog/#open-popup руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 * Для открытия диалоговых окон из кода используйте {@link Controls/popup:DialogOpener}.
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IAdaptivePopup
 * @demo Controls-demo/Popup/Dialog/Index
 * @public
 */
export default class Dialog extends BaseOpener<IDialogOpenerOptions> {
    protected _popupOpener: DialogOpener = new DialogOpener();

    static openPopup(popupOptions: IDialogOpenerOptions): Promise<string | void | Error> {
        return new DialogOpener().open(popupOptions);
    }
}
