/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Logger } from 'UI/Utils';
import { Control } from 'UI/Base';
import BaseOpener, {
    ILoadDependencies,
    IBaseOpenerOptions,
} from 'Controls/_popup/Opener/BaseOpener';
import loadPopupPageConfig from 'Controls/_popup/utils/loadPopupPageConfig';
import { getModuleByName } from 'Controls/_popup/utils/moduleHelper';
import CancelablePromise from 'Controls/_popup/utils/CancelablePromise';
import ManagerController from 'Controls/_popup/Manager/ManagerController';
import BaseOpenerUtil from 'Controls/_popup/Opener/BaseOpenerUtil';
import { IPrefetchData, waitPrefetchData } from 'Controls/_popup/utils/Preload';
import { Feature } from 'Feature/feature';

/**
 * Запускает лоадеры, если они присутсвуют в конфиге,
 * после их вызова вызывает колбек в котором должно быть открытие попапа
 * @param config
 * @param openCallback
 */
export function startLoadersIfNecessary(
    config: IBaseOpenerOptions,
    openCallback: Function
): void {
    if (config.dataLoaders) {
        return BaseOpenerUtil.getManagerWithCallback(() => {
            config._prefetchPromise = ManagerController.loadData(
                config.dataLoaders
            );
            if (!config._prefetchPromise) {
                openCallback();
                return;
            }

            // Если initializingWay remote, то нужно вызывать открытие
            // и обновление попапа только после завершения лоадеров.
            if (config.initializingWay === 'remote') {
                waitPrefetchData(config._prefetchPromise).then(
                    (prefetchData: IPrefetchData) => {
                        config._prefetchData = prefetchData;
                        openCallback();
                    },
                    openCallback
                );
            } else {
                openCallback();
            }
        });
    } else {
        openCallback();
    }
}

export default function openPopup(
    config: IBaseOpenerOptions,
    controller: string,
    moduleName: string
): CancelablePromise<string | Error> {
    const promise = new CancelablePromise<string | Error>(
        (cancelablePromise, resolve, reject) => {
            const openPopup = () => {
                if (!config.hasOwnProperty('isHelper')) {
                    Logger.warn(
                        'Controls/popup:Dialog: Для открытия диалоговых окон из кода используйте DialogOpener'
                    );
                }
                if (!config.hasOwnProperty('opener')) {
                    Logger.error(
                        `${moduleName}: Для открытия окна через статический метод, обязательно нужно указать опцию opener`
                    );
                }

                const showDialog = (
                    templateModule: Control,
                    popupConfig: IBaseOpenerOptions,
                    controllerModule: Control
                ) => {
                    if (cancelablePromise.isCanceled() === false) {
                        startLoadersIfNecessary(popupConfig, () => {
                            BaseOpener.showDialog(
                                templateModule,
                                popupConfig,
                                controllerModule
                            ).then((popupId: string) => {
                                if (cancelablePromise.isCanceled() === true) {
                                    ManagerController.remove(popupId);
                                    reject();
                                }
                                resolve(popupId);
                            });
                        });
                    } else {
                        reject();
                    }
                };

                const openByConfig = (
                    popupCfg: IBaseOpenerOptions,
                    controllerModuleName: string
                ) => {
                    // что-то поменялось в ядре, в ie из-за частых синхронизаций(при d'n'd) отвалилась перерисовка окон,
                    // ядро пишет что создано несколько окон с таким ключом. Такой же сценарий актуален не только для диалогов.
                    // убираю асинхронную фазу, чтобы ключ окна не успевал протухнуть пока идут микротаски от промисов.
                    const tplModule = getModuleByName(
                        popupCfg.template as string
                    );
                    const contrModule = getModuleByName(controllerModuleName);
                    if (tplModule && contrModule) {
                        showDialog(tplModule, popupCfg, contrModule);
                    } else {
                        BaseOpener.requireModules(
                            popupCfg,
                            controllerModuleName
                        )
                            .then((result: ILoadDependencies) => {
                                showDialog(
                                    result.template,
                                    popupCfg,
                                    result.controller
                                );
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
                                popupCfg.templateOptions.prefetchResult.then(
                                    (result) => {
                                        popupCfg._prefetchData = result;
                                        openByConfig(popupCfg, controller);
                                    }
                                );
                            } else {
                                openByConfig(popupCfg, controller);
                            }
                        })
                        .catch(reject);
                } else {
                    openByConfig(config, controller);
                }
            };
            // Для автотестов
            const hasAutotestCookie =
                document.cookie.indexOf('autotest') !== -1;
            if (
                config.template === 'Controls/datePopup' &&
                !hasAutotestCookie
            ) {
                Feature.require(['new_date-picker']).then(([result]) => {
                    if (result.isOn()) {
                        config.template = 'Controls/datePopupNew';
                    }
                    openPopup();
                });
            } else {
                openPopup();
            }
        }
    ).catch((err: Error) => {
        Logger.error(`${moduleName}: ${err.message}`);
        return err;
    });
    return promise;
}
