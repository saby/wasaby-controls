import { IControlOptions } from 'UI/Base';
import BaseOpener from './BaseOpener';
import NotificationOpener from '../Openers/Notification';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import BaseOpenerUtil from './BaseOpenerUtil';
import { loadModule } from 'Controls/_popup/utils/moduleHelper';
import { INotificationPopupOptions } from '../interface/INotification';

const BASE_OPTIONS = {
    autofocus: false,
    autoClose: true,
};

const compatibleOpen = (popupOptions: INotificationPopupOptions): Promise<string> => {
    const config = BaseOpenerUtil.getConfig({}, popupOptions);
    delete config.id;
    return new Promise((resolve) => {
        Promise.all([
            loadModule('Controls/compatiblePopup:BaseOpener'),
            loadModule('SBIS3.CONTROLS/Utils/InformationPopupManager'),
            loadModule('Controls/compatiblePopup:OldNotification'),
            loadModule(config.template),
        ]).then((results) => {
            const BaseOpenerCompat = results[0];
            const InformationPopupManager = results[1];
            config.template = results[3];
            const compatibleConfig = getCompatibleConfig(BaseOpenerCompat, config);
            const popupId = InformationPopupManager.showNotification(
                compatibleConfig,
                compatibleConfig.notHide
            );
            resolve(popupId);
        });
    });
};

const getCompatibleConfig = (BaseOpenerCompat: any, config) => {
    const cfg = BaseOpenerCompat.prepareNotificationConfig(config);
    cfg.notHide = !cfg.autoClose;
    cfg.isCompoundNotification = true;
    // элемент проставляется из createControl в совместимости, удаляем его чтобы потом при мерже получить новый элемент
    delete cfg.element;
    return cfg;
};

/**
 * Контрол, открывающий окно, которое позиционируется в правом нижнем углу окна браузера. Одновременно может быть открыто несколько окон уведомлений. В этом случае они выстраиваются в стек по вертикали.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FPopup%2FNotification%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/notification/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @implements Controls/popup:IBaseOpener
 * @public
 * @demo Controls-demo/Popup/Notification/Index
 */
export default class Notification extends BaseOpener<IControlOptions> {
    protected _popupOpener: Notification = new NotificationOpener();

    open(popupOptions: INotificationPopupOptions) {
        if (isNewEnvironment()) {
            return super.open(popupOptions);
        }
        return compatibleOpen({ ...BASE_OPTIONS, ...this._options, ...popupOptions });
    }

    static openPopup(popupOptions: INotificationPopupOptions): Promise<string | void | Error> {
        return new NotificationOpener().open(popupOptions);
    }

    /**
     * Статический метод для открытия окна уведомления.
     * @name Controls/popup:Notification#openPopup
     * @function
     * @param {Controls/_popup/interface/INotificationOpener/PopupOptions.typedef} config Конфигурация окна.
     * @returns {Promise<string>} Возвращает Promise, который в качестве результата вернет идентификатор окна.
     * Такой идентификатор используют в методе {@link closePopup} для закрытия окна.
     * @static
     * @remark
     * Дополнительный пример работы со статическим методом доступен {@link /doc/platform/developmentapl/interface-development/controls/openers/notification/#open-popup здесь}.
     * При использовании метода не требуется создавать {@link Controls/popup:Notification} в верстке.
     * @example
     * <pre class="brush: js">
     * // TypeScript
     * import {Notification} from 'Controls/popup';
     * ...
     * _afterMount(){
     *      Notification.openPopup({
     *          template: 'Controls/popupTemplate:NotificationSimple',
     *          autoClose: true,
     *          templateOptions: {
     *              style: 'success',
     *              text: `Новое уведомление`,
     *              icon: 'icon-Admin'
     *          }
     *      });
     * }
     *
     * _beforeUnmount(){
     *      this._opener.destroy();
     * }
     * </pre>
     * @see closePopup
     * @see close
     * @see open
     */
}
