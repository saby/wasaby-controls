/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Logger } from 'UI/Utils';
import { Control, IControlOptions } from 'UI/Base';
import { IBasePopupOptions } from 'Controls/_popup/interface/IBasePopupOptions';
import loadPopupPageConfig from 'Controls/_popup/utils/loadPopupPageConfig';
import { getModuleByName, loadModule } from 'Controls/_popup/utils/moduleHelper';
import CancelablePromise from 'Controls/_popup/utils/CancelablePromise';
import GlobalController from 'Controls/_popup/Popup/GlobalController';
import BaseOpenerUtil from 'Controls/_popup/WasabyOpeners/BaseOpenerUtil';
import { IPrefetchData, waitPrefetchData } from 'Controls/_popup/utils/Preload';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import { Loader } from 'Controls-DataEnv/dataLoader';
export { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { isWS3Template } from 'Controls/_popup/utils/isVdomTemplate';

export interface ILoadDependencies {
    template: Control;
    controller: Control;
}

export interface IOpenPopup extends IBasePopupOptions, IControlOptions {
    id?: string;
    closePopupBeforeUnmount?: boolean;
}

/**
 * Запускает лоадеры, если они присутсвуют в конфиге,
 * после их вызова вызывает колбек в котором должно быть открытие попапа
 * @param config
 * @param openCallback
 */
export function startLoadersIfNecessary(config: IOpenPopup, openCallback: Function): void {
    if (config.dataLoaders) {
        return BaseOpenerUtil.getManagerWithCallback(() => {
            config._prefetchPromise = GlobalController.loadData(config.dataLoaders);
            if (!config._prefetchPromise) {
                openCallback();
                return;
            }

            // Если initializingWay remote, то нужно вызывать открытие
            // и обновление попапа только после завершения лоадеров.
            if (config.initializingWay === 'remote') {
                waitPrefetchData(config._prefetchPromise).then((prefetchData: IPrefetchData) => {
                    config._prefetchData = prefetchData;
                    openCallback();
                }, openCallback);
            } else {
                openCallback();
            }
        });
    } else {
        openCallback();
    }
}

export default function openPopup(
    config: IOpenPopup,
    controller: string
): CancelablePromise<string | Error> {
    const promise = new CancelablePromise<string | Error>((cancelablePromise, resolve, reject) => {
        const show = (
            templateModule: Control,
            popupConfig: IOpenPopup,
            controllerModule: Control
        ) => {
            if (cancelablePromise.isCanceled() === false) {
                startLoadersIfNecessary(popupConfig, () => {
                    showDialog(templateModule, popupConfig, controllerModule).then(
                        (popupId: string) => {
                            if (cancelablePromise.isCanceled() === true) {
                                GlobalController.getController()?.remove(popupId);
                                reject();
                            }
                            resolve(popupId);
                        }
                    );
                });
            } else {
                reject();
            }
        };

        const openByConfig = (popupCfg: IOpenPopup, controllerModuleName: string) => {
            // что-то поменялось в ядре, в ie из-за частых синхронизаций(при d'n'd) отвалилась перерисовка окон,
            // ядро пишет что создано несколько окон с таким ключом. Такой же сценарий актуален не только для диалогов.
            // убираю асинхронную фазу, чтобы ключ окна не успевал протухнуть пока идут микротаски от промисов.
            const tplModule = getModuleByName(popupCfg.template as string);
            const contrModule = getModuleByName(controllerModuleName);
            let loaderPromise: Promise<unknown>;
            const loadConfigGetterPromise = _getLoadConfig(popupCfg);
            if (loadConfigGetterPromise) {
                loaderPromise = loadConfigGetterPromise.then((loadConfig: IDataConfig) => {
                    return Loader.load(loadConfig);
                });
            } else {
                loaderPromise = Promise.resolve(null);
            }
            if (tplModule && contrModule) {
                loaderPromise.then((loadResult) => {
                    popupCfg.templateOptions.loadResult = loadResult;
                    show(tplModule, popupCfg, contrModule);
                });
            } else {
                const requireModulesPromise = requireModules(popupCfg, controllerModuleName);
                Promise.all([requireModulesPromise, loaderPromise])
                    .then((values: [ILoadDependencies, IDataConfig]) => {
                        const result: ILoadDependencies = values[0];
                        const loadResult: IDataConfig = values[1];
                        popupCfg.templateOptions.loadResult = loadResult;
                        show(result.template, popupCfg, result.controller);
                    })
                    .catch((error: RequireError) => {
                        reject(error);
                    });
            }
        };

        if (config.pageId) {
            loadPopupPageConfig(config)
                .then((popupCfg) => {
                    if (popupCfg.initializingWay === 'remote') {
                        popupCfg.templateOptions.prefetchResult.then((result) => {
                            popupCfg._prefetchData = result;
                            openByConfig(popupCfg, controller);
                        });
                    } else {
                        openByConfig(popupCfg, controller);
                    }
                })
                .catch(reject);
        } else {
            openByConfig(config, controller);
        }
        return config.id;
    }).catch((err: Error) => {
        Logger.error(`Controls/popup: ${err.message}`);
        return err;
    });
    return promise;
}

const _getLoadConfig = (config: IOpenPopup): Promise<IDataConfig> => {
    if (config.loadConfig) {
        return Promise.resolve(config.loadConfig);
    }
    if (config.loadConfigGetter) {
        return config.loadConfigGetter(config);
    }
};

const requireModules = (
    config: IOpenPopup,
    controller: string
): Promise<ILoadDependencies | Error> => {
    return new Promise<ILoadDependencies | Error>((resolve, reject) => {
        const modules = [loadModule(config.template), loadModule(controller)];
        if (GlobalController.getRightPanelBottomTemplate()) {
            modules.push(loadModule(GlobalController.getRightPanelBottomTemplate()));
        }
        Promise.all(modules)
            .then((result: [Control, Control]) => {
                const controller = result[1];
                let template = result[0];
                if (template && template.__esModule && template.default) {
                    template = template.default;
                }
                resolve({
                    template,
                    controller,
                });
            })
            .catch((error: RequireError) => {
                // requirejs.onError бросает ошибку, из-за чего код ниже не выполняется.
                try {
                    requirejs.onError(error);
                } finally {
                    import('Controls/error').then(({ process }) => {
                        process({ error }).then(() => {
                            Logger.error('Controls/popup' + ': ' + error.message, undefined, error);
                            reject(error);
                        });
                    });
                }
            });
    });
};

export const showDialog = (
    template: Control,
    config: IOpenPopup,
    controller: Control
): Promise<string> => {
    let callbackPromiseResolver;
    const promise = new Promise((resolve) => {
        callbackPromiseResolver = resolve;
    }) as Promise<string>;

    if (!isNewEnvironment()) {
        showOnOldEnvironment(template, config, controller, callbackPromiseResolver);
        return promise;
    }

    if (isWS3Template(template)) {
        showCompatibleDialog(template, config, controller, callbackPromiseResolver);
        return promise;
    }

    BaseOpenerUtil.getManagerWithCallback(() => {
        _openPopup(config, controller, callbackPromiseResolver);
    });
    return promise;
};

const showOnOldEnvironment = (
    template: Control,
    config: IOpenPopup,
    controller: Control,
    callbackPromiseResolver: Function
) => {
    return BaseOpenerUtil.getManagerWithCallback(() => {
        // при открытии через стат. метод открыватора в верстке нет, нужно взять то что передали в опции
        // Если topPopup, то zIndex менеджер высчитает сам

        if (!config.zIndex) {
            if (!config.topPopup) {
                // На старой странице могут открывать на одном уровне 2 стековых окна.
                // Последнее открытое окно должно быть выше предыдущего, для этого должно знать его zIndex.
                // Данные хранятся в WM
                const oldWindowManager = requirejs('Core/WindowManager');
                const compatibleManagerWrapperName =
                    'Controls/Popup/Compatible/ManagerWrapper/Controller';
                let managerWrapperMaxZIndex = 0;
                // На старой странице может быть бутерброд из старых и новых окон. zIndex вдомных окон берем
                // из менеджера совместимости. Ищем наибольший zIndex среди всех окон
                if (requirejs.defined(compatibleManagerWrapperName)) {
                    managerWrapperMaxZIndex = requirejs(
                        compatibleManagerWrapperName
                    ).default.getMaxZIndex();
                }
                const zIndexStep = 9;
                const item = GlobalController.getController()?.find(config.id);
                // zindex окон, особенно на старой странице, никогда не обновлялся внутренними механизмами
                // Если окно уже открыто, zindex не меняем
                if (item) {
                    config.zIndex = item.popupOptions.zIndex;
                } else if (oldWindowManager) {
                    // Убираем нотификационные окна из выборки старого менеджера
                    const baseOldZIndex = 1000;
                    const oldMaxZWindow = oldWindowManager.getMaxZWindow((control) => {
                        return control._options.isCompoundNotification !== true;
                    });
                    const oldMaxZIndex = oldMaxZWindow?.getZIndex() || baseOldZIndex;
                    const maxZIndex = Math.max(oldMaxZIndex, managerWrapperMaxZIndex);
                    config.zIndex = maxZIndex + zIndexStep;
                }
            }
        }
        if (isWS3Template(template)) {
            showCompatibleDialog(template, config, controller, callbackPromiseResolver);
        } else {
            _openPopup(config, controller, callbackPromiseResolver);
        }
    });
};

const showCompatibleDialog = (
    template: Control,
    config: IOpenPopup,
    controller: Control,
    callbackPromiseResolver: Function
) => {
    requirejs(['Controls/compatiblePopup'], (compatiblePopup) => {
        compatiblePopup.BaseOpener._prepareConfigForOldTemplate(config, template);
        _openPopup(config, controller, callbackPromiseResolver);
    });
};

const _openPopup = async (
    config: IOpenPopup,
    controller: Control,
    callbackPromiseResolver: Function
): Promise<void> => {
    let popupIsCreating;
    if (!GlobalController.getController()) {
        await import('Controls/popupTemplateStrategy').then(({ Controller }) => {
            new Controller().init();
        });
    }
    const item = GlobalController.getController()?.find(config.id);
    if (item) {
        const popupInstance = GlobalController.getContainer()?.getPopupById(item.id);
        popupIsCreating =
            (item.popupState === 'initializing' || item.popupState === 'creating') &&
            !popupInstance;
    }
    if (!item || item.popupState !== 'startDestroying') {
        if (!popupIsCreating) {
            config.id = GlobalController.getController()?.show(config, controller);
        } else {
            GlobalController.getController()?.updateOptionsAfterInitializing(config.id, config);
        }
    }
    callbackPromiseResolver(config.id);
};
