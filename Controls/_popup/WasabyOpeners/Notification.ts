import { IControlOptions } from 'UI/Base';
import BaseOpener from './BaseOpener';
import Notification from '../Openers/Notification';
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

export default class NotificationOpener extends BaseOpener<IControlOptions> {
    protected _popupOpener: Notification = new Notification();

    open(popupOptions: INotificationPopupOptions) {
        if (isNewEnvironment()) {
            return super.open(popupOptions);
        }
        return compatibleOpen({ ...BASE_OPTIONS, ...this._options, ...popupOptions });
    }

    static openPopup(popupOptions: INotificationPopupOptions): Promise<string | void | Error> {
        return new Notification().open(popupOptions);
    }
}
