export interface IPopupSettingsController {
    getSettings: Function;
    setSettings: Function;
}

let settingsController;

export function setController(controller: IPopupSettingsController): void {
    settingsController = controller;
}

export function hasSettingsController(): boolean {
    return !!settingsController;
}

export function getSettings(ids: string[]): Promise<unknown> {
    if (settingsController && settingsController.getSettings) {
        const settings = settingsController.getSettings(ids);
        // protect against wrong api
        if (settings instanceof Promise) {
            return settings;
        }
        return Promise.resolve(settings);
    }
    return Promise.resolve();
}

export function setSettings(config: unknown): void {
    if (settingsController && settingsController.setSettings) {
        settingsController.setSettings(config);
    }
}

export async function loadSavedConfig<K extends string[] = string[]>(
    propStorageId: string,
    propNames?: string[]
): Promise<Record<K[number], any>> {
    return new Promise((resolve) => {
        getSettings([propStorageId]).then((storage) => {
            let loadedCfg = {};

            if (storage && storage[propStorageId]) {
                if (propNames) {
                    propNames.forEach((prop) => {
                        if (storage[propStorageId].hasOwnProperty(prop)) {
                            loadedCfg[prop] = storage[propStorageId][prop];
                        }
                    });
                } else {
                    loadedCfg = { ...storage[propStorageId] };
                }
            }
            resolve(loadedCfg);
        });
    });
}

export function saveConfig(
    propStorageId: string,
    propNames: string[],
    cfg: object
): Promise<unknown> {
    if (propStorageId && propNames) {
        return loadSavedConfig(propStorageId).then((currentConfig) => {
            const configToSave = currentConfig || {};

            propNames.forEach((prop) => {
                if (cfg.hasOwnProperty(prop)) {
                    configToSave[prop] = cfg[prop];
                }
            });
            setSettings({ [propStorageId]: configToSave });
        });
    }
}


/**
 * Набор утилит, для работы с данными в хранилище через заданный контроллер.
 * @class Controls/Application/SettingsController
 * @remark
 * Перед работой с утилитами, убедитесь что на странице задан контроллер.
 * @public
 */

/**
 * Метод, который устаналивает контроллер.
 * @function Controls/Application/SettingsController#setController
 * @param {Function} controller Контроллер для работы с данными.
 * @remark
 * Контроллер должен поддерживать два метода:
 * 1. getSettings(propStorageIds: string[]): Promise<unknown> - В качестве аргумента получает массив из ключей.
 * записей в хранилизще, возвращает промис с данными.
 * 2. setSettings(config: IConfig): void - В качестве аргумента принимает объект с конфигурацией,
 * где ключ - propStorageId.
 * interface IConfig = {
 *      [ string ]: any
 * }
 */

/**
 * Метод для получения данных из хранилища.
 * @function Controls/Application/SettingsController#getSettings
 * @param {String[]} propStorageIds Массив ключей, для получения данных.
 * @returns {Promise<unknown>}
 */

/**
 * Метод для добавления данных в хранилище.
 * @function Controls/Application/SettingsController#setSettings
 * @param {{ [string]: any}} config Конфигурация помещаемых в хранилище данных. В качестве ключа принимает propStorageId
 */

/**
 * Метод для изменения данных в хранилище.
 * @function Controls/Application/SettingsController#saveConfig
 * @param {String} propStorageId Ключ данных в хранилище.
 * @param {String[]} propNames Массив имен полей объекта, которые подлежат изменению.
 * @param {Object} config Объект с измененными данными.
 * @returns {Promise<unknown>} Новый объект, записанный в хранилище.
 */
