/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control } from 'UI/Base';
import ManagerController from 'Controls/_popup/Manager/ManagerController';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import { goUpByControlTree } from 'UI/Focus';
import { ILoadingIndicatorOptions, IndicatorOpener } from 'Controls/LoadingIndicator';
import * as rk from 'i18n!Controls';
import * as CoreMerge from 'Core/core-merge';
import * as cInstance from 'Core/core-instance';
import { IBaseOpenerOptions } from './BaseOpener';
import { Logger } from 'UICommon/Utils';

let ManagerWrapperCreatingPromise; // TODO: Compatible
let isLayerCompatibleLoaded; // TODO: Compatible

export default {
    loadCompatibleLayer(callback: Function, errorFn?: Function): void {
        const layerCompatibleModuleName: string = 'Lib/Control/LayerCompatible/LayerCompatible';
        const loadedCallback = () => {
            isLayerCompatibleLoaded = true;
            callback();
        };
        const errorCallback = (error) => {
            try {
                requirejs.onError(error);
            } finally {
                import('Controls/error').then(({ process }) => {
                    process({ error }).then(() => {
                        Logger.error('Controls/popup' + ': ' + error.message, undefined, error);
                        if (errorFn) {
                            errorFn(error);
                        }
                    });
                });
            }
        };
        if (!isLayerCompatibleLoaded) {
            if (requirejs.defined(layerCompatibleModuleName)) {
                const Layer = requirejs(layerCompatibleModuleName);
                Layer.load().addCallback(loadedCallback);
            } else {
                requirejs(
                    [layerCompatibleModuleName],
                    (Layer) => {
                        Layer.load().addCallback(loadedCallback);
                    },
                    errorCallback
                );
            }
        } else {
            loadedCallback();
        }
    },

    getManagerWithCallback(callback: Function): void {
        if (ManagerController.getManager()) {
            callback();
        } else {
            this.getManager().then(callback);
        }
    },

    showIndicator(cfg): void {
        const hideFunction = () => {
            IndicatorOpener.hide(id);
        };
        const indicatorConfig = this.getIndicatorConfig(null, cfg);
        const id: string = IndicatorOpener.show(indicatorConfig);
        cfg._events = cfg._events || {};
        cfg._events.onOpen = hideFunction;
        if (!cfg._events.onClose) {
            cfg._events.onClose = hideFunction;
        }
    },

    getIndicatorConfig(id: string, cfg: IBaseOpenerOptions = {}): ILoadingIndicatorOptions {
        const findParentPopupId = () => {
            if (!cfg.opener?._destroyed) {
                const parentControls: Control[] = goUpByControlTree(cfg.opener?._container);
                for (let i = 0; i < parentControls.length; i++) {
                    if (parentControls[i]._moduleName === 'Controls/_popup/Manager/Popup') {
                        return parentControls[i]._options.id;
                    }
                }
            }
            return false;
        };
        const popupId = findParentPopupId();
        const indicatorConfig = cfg.indicatorConfig || {};
        const defaultIndicatorCfg = {
            id,
            message: rk('Загрузка'),
            delay: 2000,
        };
        const config = { ...defaultIndicatorCfg, ...indicatorConfig };
        if (popupId) {
            config.popupId = popupId;
        }
        return config;
    },

    // TODO Compatible
    getManager(): Promise<void> {
        if (!ManagerWrapperCreatingPromise) {
            if (!isNewEnvironment()) {
                const managerContainer = document.createElement('div');
                managerContainer.classList.add('controls-PopupContainer');
                document.body.insertBefore(managerContainer, document.body.firstChild);

                ManagerWrapperCreatingPromise = new Promise((resolve, reject) => {
                    const compatibleDeps = [
                        import('UI/Base'),
                        import('Controls/compatiblePopup'),
                        import('Controls/Popup/Compatible/ManagerWrapper/Controller'),
                    ];

                    Promise.all(compatibleDeps)
                        .then(([base, compatiblePopup, compatibleController]) => {
                            const managerCfg = {};
                            const theme = compatibleController.default.getTheme();
                            if (theme) {
                                managerCfg.theme = theme;
                            }
                            requirejs(['optional!Page/base'], (PageBaseLib) => {
                                if (PageBaseLib) {
                                    managerCfg.dataLoaderModule = 'Page/base:DataLoader';
                                }
                                base.AsyncCreator(
                                    compatiblePopup.ManagerWrapper,
                                    managerCfg,
                                    managerContainer
                                ).then(resolve);
                            });
                        })
                        .catch(reject);
                });
            } else {
                // Защита от случаев, когда позвали открытие окна до полного построения страницы
                if (ManagerController.getManager()) {
                    return Promise.resolve();
                } else {
                    ManagerWrapperCreatingPromise = new Promise((resolve) => {
                        const intervalDelay: number = 20;
                        const intervalId: number = setInterval(() => {
                            if (ManagerController.getManager()) {
                                clearInterval(intervalId);
                                resolve();
                            }
                        }, intervalDelay);
                    });
                }
            }
        }

        return ManagerWrapperCreatingPromise;
    },

    isControl(data: unknown): boolean {
        return (
            cInstance.instanceOfModule(data, 'UI/Base:Control') ||
            cInstance.instanceOfModule(data, 'Lib/Control/Control:Control') ||
            cInstance.instanceOfModule(data, 'Lib/Control/CompoundControl/CompoundControl')
        );
    },

    getConfig(options: IBaseOpenerOptions, popupOptions: IBaseOpenerOptions): IBaseOpenerOptions {
        // Все опции опенера брать нельзя, т.к. ядро добавляет свои опции опенеру (в режиме совместимости),
        // которые на окно попасть не должны.
        const baseConfig = { ...options };
        const ignoreOptions = [
            'iWantBeWS3',
            '_$createdFromCode',
            '_logicParent',
            'theme',
            'vdomCORE',
            'name',
            'esc',
        ];

        for (let i = 0; i < ignoreOptions.length; i++) {
            const option = ignoreOptions[i];
            if (options[option] !== undefined) {
                delete baseConfig[option];
            }
        }

        const templateOptions = {};
        CoreMerge(templateOptions, baseConfig.templateOptions || {});
        CoreMerge(templateOptions, popupOptions.templateOptions || {}, {
            rec: false,
        });

        const baseCfg = { ...baseConfig, ...popupOptions, templateOptions };

        return baseCfg;
    },
};
