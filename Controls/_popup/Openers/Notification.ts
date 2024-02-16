import Base from 'Controls/_popup/Openers/Base';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import { INotificationPopupOptions } from 'Controls/_popup/interface/INotification';
import { LocalStorageNative } from 'Browser/Storage';
import { Logger } from 'UI/Utils';
import { IPopupItemInfo } from 'Controls/_popup/interface/IPopup';
import { List } from 'Types/collection';

const POPUP_CONTROLLER = 'Controls/popupTemplateStrategy:NotificationController';

const BASE_OPTIONS = {
    autofocus: false,
    autoClose: true,
};

const findItemById = (popupItems: List<IPopupItemInfo>, id: string): IPopupItemInfo | null => {
    const index = popupItems && popupItems.getIndexByValue('id', id);
    if (index > -1) {
        return popupItems.at(index);
    }
    return null;
};

const isLinkedPopup = (
    popupItems: List<IPopupItemInfo>,
    parentItem: IPopupItemInfo,
    item: IPopupItemInfo
): boolean => {
    while (item && item.parentId) {
        item = findItemById(popupItems, item.parentId);
        if (item === parentItem) {
            return true;
        }
    }
    return false;
};

export default class Notification extends Base<INotificationPopupOptions> {
    protected _type: string = 'notification';

    protected _controller: string = POPUP_CONTROLLER;

    protected _isAdaptive(popupOptions: IStackPopupOptions): boolean {
        return false;
    }

    open(popupOptions: INotificationPopupOptions): Promise<string | void | Error> {
        const config = { ...BASE_OPTIONS, ...this._options, ...popupOptions };
        if (LocalStorageNative.getItem('hideNotificationAutotest') === 'true') {
            Logger.warn(
                'Notification не будет открыт, т.к. в localStorage лежит hideNotificationAutotest'
            );
            return Promise.resolve();
        }
        if (config.autoClose) {
            config.topPopup = true;
        }
        if (!config.topPopup) {
            config.zIndexCallback = Notification.zIndexCallback;
        }
        return super.open(config);
    }

    static zIndexCallback(item: IPopupItemInfo, popupItems: List<IPopupItemInfo>): number {
        const count: number = popupItems.getCount();
        const zIndexStep: number = 10;
        const baseZIndex: number = 100;
        for (let i = 0; i < count; i++) {
            // if popups are linked, then notification must be higher then parent
            const isMaximize: boolean = popupItems.at(i).popupOptions.maximize;
            const isModal: boolean = popupItems.at(i).popupOptions.modal;
            const isChild = isLinkedPopup(popupItems, popupItems.at(i), item);
            const isParent = isLinkedPopup(popupItems, item, popupItems.at(i));
            if ((isMaximize || isModal) && !isChild && !isParent) {
                const maximizedPopupZIndex = (i + 1) * zIndexStep;
                return maximizedPopupZIndex - 1;
            }
        }
        return baseZIndex;
    }
}
