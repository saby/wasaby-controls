import { Control, IControlOptions } from 'UI/Base';
import { goUpByControlTree } from 'UI/Focus';
import { DialogOpener, IDialogPopupOptions } from 'Controls/popup';
import CalculatorUtils from '../Utils';

const CALCULATOR_DIALOG_PROP_STORAGE_ID = 'calculatorPosition';
const CONTROLS_RENDER = '.controls-Render';
let dialogOpener: DialogOpener;
let activeInput: HTMLInputElement;

export const setActiveInput = (newActiveInput: HTMLInputElement): void => {
    activeInput = newActiveInput;
};

export default class Opener {
    open(popupOptions: { eventHandlers?: object } = {}): void {
        if (!dialogOpener) {
            dialogOpener = new DialogOpener();
        }
        const value = this._getValue();
        const opener = this._getOpener();
        const dialogPopupOptions: IDialogPopupOptions = {
            template: 'Controls-Calculator/Dialog',
            restrictiveContainer: 'body',
            className: 'Calculator-Popup__Container controls-Popup__isolatedFocusingContext',
            resizeDirection: {
                horizontal: 'left',
            },
            topPopup: true,
            opener,
            templateOptions: {
                value,
            },
            fittingMode: 'adaptive',
            eventHandlers: {
                onOpen: popupOptions.eventHandlers?.onOpen,
                onClose: popupOptions.eventHandlers?.onClose,
                onResult: (data: string, resultValue: string) => {
                    if (activeInput) {
                        this._setValueToInput(activeInput, data, resultValue);
                        activeInput = null;
                        this.close();
                    }
                },
            },
        };
        // Если есть opener, значит открываем калькулятор из input, поэтому открываем окно с дополнительными опциями
        if (!opener) {
            dialogPopupOptions.propStorageId = CALCULATOR_DIALOG_PROP_STORAGE_ID;
        } else {
            /*
             * Из-за того, что у поля ввода могут быть отступы, либо контент справа, калькулятор отобразится не там где ожидалось
             * Поэтому завязывается на класс controls-render
             */
            const element = (activeInput.closest(CONTROLS_RENDER) || activeInput) as HTMLElement;
            dialogPopupOptions.className += ' Calculator-Popup__Offset';

            dialogPopupOptions.target = element;
            dialogPopupOptions.targetPoint = {
                vertical: 'bottom',
                horizontal: 'right',
            };
            dialogPopupOptions.direction = {
                horizontal: 'left',
            };
        }
        dialogOpener.open(dialogPopupOptions);
    }

    close(): void {
        dialogOpener?.close();
    }

    isOpened(): boolean {
        return dialogOpener?.isOpened();
    }

    destroy(): void {
        this.close();
    }

    private _getOpener(): Control<IControlOptions, void> | null {
        if (activeInput) {
            const inpupParents = goUpByControlTree(activeInput);
            const firstControlIndex = 0;
            return inpupParents[firstControlIndex];
        }
        return null;
    }

    private _setValueToInput(input: HTMLInputElement, value: string, resultValue: string): void {
        let event;
        input.value = Number(resultValue || value) + '';
        if (typeof Event === 'function') {
            event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
        } else {
            event = document.createEvent('Event');
            event.initEvent('input', true, true);
        }
        // На Event нельзя задать inputType из конструктора
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        event.inputType = 'insertFromPaste';
        input.dispatchEvent(event);
        activeInput.focus();
    }

    private _getValue(): string | void {
        const activeNode: Element = document.activeElement;
        const tagName = activeNode.tagName;
        let text = '';

        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
            text = (activeNode as HTMLInputElement).value;
            activeInput = activeNode as HTMLInputElement;
        } else if (activeNode.getAttribute?.('contenteditable') === 'true') {
            text = activeNode.textContent as string;
            activeInput = activeNode as HTMLInputElement;
        } else {
            text = (activeNode as HTMLElement).innerText;
            activeInput = null;
        }

        if (window?.getSelection) {
            const selectedValue = window.getSelection().toString();
            if (selectedValue.length) {
                text = selectedValue;
            }
        }
        text = text.replace(/\n$/g, '');
        return CalculatorUtils.prepareStringToNumber(text);
    }

    static isOpened(): boolean {
        return dialogOpener?.isOpened();
    }
}
