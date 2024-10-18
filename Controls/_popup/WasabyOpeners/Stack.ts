/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import BaseOpener, { IBaseOpenerOptions } from './BaseOpener';
import StackOpener from '../Openers/Stack';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
interface IStackOpenerOptions extends IStackPopupOptions, IBaseOpenerOptions {}

/**
 * Контрол, открывающий всплывающее окно с пользовательским шаблоном внутри. Всплывающее окно располагается в правой части контентной области приложения и растянуто на всю высоту экрана.
 * @class Controls/_popup/Stack
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FPopup%2FOpener%2FStackDemo%2FStackDemo демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/stack/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 * Для открытия стековых окон из кода используйте {@link Controls/popup:StackOpener}.
 * @implements Controls/interface:IPropStorage
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IAdaptivePopup
 * @demo Controls-demo/Popup/Stack/Index
 * @public
 */
export default class Stack extends BaseOpener<IStackOpenerOptions> {
    protected _popupOpener: StackOpener = new StackOpener();

    static openPopup(popupOptions: IStackOpenerOptions): Promise<string | void | Error> {
        return new StackOpener().open(popupOptions);
    }
}

/**
 * Статический метод для открытия всплывающего окна. При использовании метода не требуется создавать {@link Controls/popup:Stack} в верстке.
 * @name Controls/popup:Stack#openPopup
 * @function
 * @static
 * @deprecated Используйте методы класса {@link Controls/popup:StackOpener}.
 */

/**
 * Статический метод для закрытия всплывающего окна.
 * @name Controls/popup:Stack#closePopup
 * @function
 * @static
 * @param {String} popupId Идентификатор окна. Такой идентификатор можно получить при открытии окна методом {@link openPopup}.
 * @deprecated Используйте методы класса {@link Controls/popup:StackOpener}.
 */
