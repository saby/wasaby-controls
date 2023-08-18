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
