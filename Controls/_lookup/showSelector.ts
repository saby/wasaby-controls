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
} from 'Controls/popup';
import * as clone from 'Core/core-clone';
import { Control } from 'UI/Base';

function getPopupOptions(self: Control): IStackPopupOptions | IDialogPopupOptions {
    const selectorTemplate = self._options.selectorTemplate;

    return {
        opener: self,
        template: selectorTemplate && selectorTemplate.templateName,
        closeOnOutsideClick: true,
        isCompoundTemplate: self._options.isCompoundTemplate,
        eventHandlers: {
            onResult: (result) => {
                self._selectCallback(null, result);
            },
            onClose: () => {
                if (self._closeHandler) {
                    self._closeHandler();
                }
                self._notify('selectorClose');
            },
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

/**
 * Открывает окно выбора
 * @param {UI/Base:Control} self Контрол, в контексте которого выполняется открытие окна выбора
 * @param {Object} popupOptions Опции для всплывающего окна
 * @param {Boolean} multiSelect Определяет, доступен ли множественный выбор
 * @returns {Boolean}
 */
export default function showSelector(
    self: Control,
    popupOptions: IStackPopupOptions | IDialogPopupOptions,
    multiSelect?: boolean,
    searchValue?: string
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

    if (selectorTemplate && selectorTemplate.popupOptions) {
        merge(stackPopupOptions, selectorTemplate.popupOptions);
    }

    if ((popupOptions && popupOptions.template) || selectorTemplate) {
        stackPopupOptions.templateOptions = getTemplateOptions(self, multiSelect, searchValue);
        if (selectorTemplate && selectorTemplate.templateOptions) {
            merge(stackPopupOptions.templateOptions, selectorTemplate.templateOptions);
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
        self._opener.open(stackPopupOptions);
        return false;
    }
    return true;
}
