/**
 * @kaizen_zone f4aee25a-8072-469d-b51f-fa0b1c29931d
 */
import Base from './Base';
import Notification from '../Opener/Notification';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import { INotificationPopupOptions } from '../interface/INotification';
import { LocalStorageNative } from 'Browser/Storage';
import { Logger } from 'UI/Utils';

/**
 * Хелпер для открытия {@link /doc/platform/developmentapl/interface-development/controls/openers/notification/ окон уведомления}.
 * @class Controls/_popup/PopupHelper/Notification
 * @implements Controls/popup:INotificationOpener
 *
 * @public
 */
export default class NotificationOpener extends Base {
    protected _opener = Notification;
    private _compatiblePopupInstance: unknown;

    open(popupOptions: INotificationPopupOptions): Promise<void> {
        if (LocalStorageNative.getItem('hideNotificationAutotest') === 'true') {
            Logger.warn('Notification не будет открыт, т.к. в localStorage лежит hideNotificationAutotest');
            return Promise.resolve();
        }
        return super.open(popupOptions);
    }

    close(): void {
        if (isNewEnvironment()) {
            return super.close();
        }
        this._compatiblePopupInstance.close();
        this._compatiblePopupInstance = null;
    }

    isOpened(): boolean {
        if (isNewEnvironment()) {
            return super.isOpened();
        }
        if (this._compatiblePopupInstance) {
            // @ts-ignore На старой странице для идентификатора используется инстанс PopupMixin'a
            return this._compatiblePopupInstance.isDestroyed() === false;
        }
        return false;
    }

    protected _openPopup(config, popupController): void {
        // На старых страницах нотификационные окна открываются через PopupMixin
        // Нужно учитывать, чтобы работал метод close
        if (!isNewEnvironment()) {
            this._opener.openPopup(config, popupController).then((popupInstance) => {
                this._compatiblePopupInstance = popupInstance;
            });
        } else {
            super._openPopup.apply(this, arguments);
        }
    }
}
