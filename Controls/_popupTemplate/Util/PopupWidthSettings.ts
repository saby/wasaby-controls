/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import {
    getSettings,
    setSettings,
} from 'Controls/Application/SettingsController';

export interface IStackSavedConfig {
    width: number;
    minSavedWidth?: number;
    maxSavedWidth?: number;
}

/**
 * Утилита позволяет получить размеры попапа из хранилища данных
 * @function Controls/_popupTemplate/Utils/PopupWidthSettings#getPopupWidth
 * @param propStorageId Уникальный идентификатор контрола, по которому будет браться конфигурация в хранилище данных
 */

export function getPopupWidth(
    propStorageId: string
): Promise<IStackSavedConfig | void> {
    return new Promise((resolve) => {
        if (propStorageId) {
            getSettings([propStorageId]).then((storage) => {
                resolve(storage && storage[propStorageId]);
            });
        } else {
            resolve();
        }
    });
}

export function savePopupWidth(
    propStorageId: string,
    data: IStackSavedConfig
): void {
    if (propStorageId && data) {
        setSettings({ [propStorageId]: data });
    }
}
