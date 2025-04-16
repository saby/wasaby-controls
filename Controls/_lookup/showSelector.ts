/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import merge = require('Core/core-merge');
import {
    DialogOpener,
    IDialogPopupOptions,
    StackOpener,
    IStackPopupOptions,
    StickyOpener,
    IEventHandlers,
} from 'Controls/popup';
import { clone } from 'Types/object';
import { Control } from 'UI/Base';
import { IndicatorOpener } from 'Controls/LoadingIndicator';
import { ISelectorTemplate } from 'Controls/interface';
import { SelectedItems } from './BaseControllerClass';
import { Loader, TDataConfigs } from 'Controls-DataEnv/dataLoader';
import { process } from 'Controls/error';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

const NEW_SELECTOR_TEMPLATE = 'Controls-Layout/selectorStack:Template';

function getPopupOptions(self: Control): IStackPopupOptions | IDialogPopupOptions {
    const selectorTemplate = self._options.selectorTemplate;

    return {
        opener: self,
        template: selectorTemplate?.templateName,
        closeOnOutsideClick: selectorTemplate?.mode === 'dialog',
        isCompoundTemplate: self._options.isCompoundTemplate,
        asyncShow: true,
        propStorageId: null,
    };
}

function getPopupHandlers(
    self: Control,
    popupOptions?: IStackPopupOptions | IDialogPopupOptions
): IEventHandlers {
    return {
        onResult: (result) => {
            self._selectCallback?.(null, result);
            popupOptions?.eventHandlers?.onResult?.(result);
        },
        onClose: () => {
            if (self._closeHandler) {
                self._closeHandler();
            }
            popupOptions?.eventHandlers?.onClose?.();
            self._notify('selectorClose');
        },
        onOpen: () => {
            if (self.__selectorOpenIndicatorId) {
                IndicatorOpener.hide(self.__selectorOpenIndicatorId);
                self.__selectorOpenIndicatorId = null;
            }
            popupOptions?.eventHandlers?.onOpen?.();
        },
    };
}

function getTemplateOptions(self: Control, multiSelect: boolean, searchValue?: string): object {
    return {
        selectedItems: self._lookupController?.getItems().clone(),
        selectedKeys: self._lookupController?.getSelectedKeys(),
        multiSelect,
        searchValue,
        handlers: {
            onSelectComplete(event, result) {
                self._opener.close();
                if (self._options.isCompoundTemplate) {
                    self._selectCallback(null, result);
                }
            },
        },
    };
}

function showNewSelector(
    selectorTemplate: ISelectorTemplate,
    stackPopupOptions: IStackPopupOptions,
    selectedItems?: SelectedItems,
    opener: StackOpener
): boolean {
    loadAsync<typeof import('Controls/selector')>('Controls/selector').then(
        ({ SELECT_SLICE_STORE_ID }) => {
            const selectorConfig = {
                [SELECT_SLICE_STORE_ID]: {
                    dataFactoryName: 'Controls/selector:Factory',
                    dataFactoryArguments: {
                        ...selectorTemplate.templateOptions,
                        selectedItems,
                    },
                },
            } as TDataConfigs;

            Loader.load(selectorConfig)
                .then((loadResults) => {
                    const selectorPopupOptions = {
                        propStorageId: null,
                        ...stackPopupOptions,
                        ...selectorTemplate.popupOptions,
                    };
                    selectorPopupOptions.templateOptions = {
                        ...selectorPopupOptions.templateOptions,
                        loadResults,
                        configs: selectorConfig,
                    };
                    opener.open(selectorPopupOptions);
                })
                .catch((error) => {
                    return process({ error });
                });
        }
    );
    return false;
}

/**
 * Открывает окно выбора
 * @param {UI/Base:Control} self Контрол, в контексте которого выполняется открытие окна выбора
 * @param {Object} popupOptions Опции для всплывающего окна
 * @param {Boolean} multiSelect Определяет, доступен ли множественный выбор
 * @param {String} searchValue Текущее значение поискового запроса
 * @param {Object} templateOptions Опции для шаблона всплывающего окна
 * @param {SelectedItems} selectedItems Текущие выбранные записи
 * @returns {Boolean}
 */
export default function showSelector(
    self: Control,
    popupOptions: IStackPopupOptions | IDialogPopupOptions,
    multiSelect?: boolean,
    searchValue?: string,
    templateOptions?: object,
    selectedItems?: SelectedItems
): boolean {
    const selectorTemplate = clone(self._options.selectorTemplate);
    const selectorMode = selectorTemplate?.mode;
    const stackPopupOptions = getPopupOptions(self);

    if (!self._opener) {
        if (selectorMode === 'dialog') {
            self._opener = popupOptions?.target ? new StickyOpener() : new DialogOpener();
        } else {
            self._opener = new StackOpener();
        }
    }

    if (selectorTemplate && selectorTemplate.templateName === NEW_SELECTOR_TEMPLATE) {
        stackPopupOptions.eventHandlers = getPopupHandlers(self, popupOptions);
        return showNewSelector(selectorTemplate, stackPopupOptions, selectedItems, self._opener);
    }

    if (selectorTemplate && selectorTemplate.popupOptions) {
        merge(stackPopupOptions, selectorTemplate.popupOptions);
    }

    if ((popupOptions && popupOptions.template) || selectorTemplate) {
        stackPopupOptions.templateOptions = getTemplateOptions(self, multiSelect, searchValue);
        if (selectorTemplate && (templateOptions || selectorTemplate.templateOptions)) {
            merge(
                stackPopupOptions.templateOptions,
                templateOptions || selectorTemplate.templateOptions
            );
        }

        if (popupOptions) {
            merge(stackPopupOptions, popupOptions);
            // merge при рекурсивном объединении объектов не заменяет непустые массивы на пустые
            if (popupOptions.templateOptions) {
                Object.assign(stackPopupOptions.templateOptions, popupOptions.templateOptions);

                if (searchValue) {
                    stackPopupOptions.templateOptions.searchValue = searchValue;
                }
            }
        }
        if (!self.__selectorOpenIndicatorId && !self._opener.isOpened()) {
            self.__selectorOpenIndicatorId = IndicatorOpener.show();
        }
        stackPopupOptions.eventHandlers = getPopupHandlers(self, popupOptions);
        self._opener.open(stackPopupOptions)?.catch(() => {
            if (self.__selectorOpenIndicatorId) {
                IndicatorOpener.hide(self.__selectorOpenIndicatorId);
            }
        });
        return false;
    }
    return true;
}
