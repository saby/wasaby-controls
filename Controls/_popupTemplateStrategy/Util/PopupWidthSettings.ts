/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import {
    setSettings,
} from 'Controls/Application/SettingsController';
import {getPopupWidth as utilGetPopupWidth, IStackSavedConfig} from 'Controls/popupTemplate';

/**
 * Утилита позволяет получить размеры попапа из хранилища данных
 * @function Controls/_popupTemplateStrategy/Utils/PopupWidthSettings#getPopupWidth
 * @param propStorageId Уникальный идентификатор контрола, по которому будет браться конфигурация в хранилище данных
 */

export function getPopupWidth(
    propStorageId: string
): Promise<IStackSavedConfig | void> {
    return utilGetPopupWidth(propStorageId);
}

export function savePopupWidth(
    propStorageId: string,
    data: IStackSavedConfig
): void {
    if (propStorageId && data) {
        setSettings({ [propStorageId]: data });
    }
}
