/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { ISelection } from '../Types';
import { constants, detection } from 'Env/Env';

interface ITextNode {
    children: HTMLElement;
    parent: HTMLElement;
}

/**
 * Класс для исправления багов при работе с выделением в нативных полях ввода.
 *
 * Баг №1: после вызова метода setSelectionRange генерируется событие select.
 * Поведение обнаружено во всех браузерах, кроме IE. https://jsfiddle.net/xcnmbg9e/
 * Если обработчик должен запускать только при пользовательском изменении выделения, то выполнять его будет лишним.
 * Решение: пропускаем вызов обработчика столько раз, сколько был вызван метод setSelectionRange.
 * @private
 */
class WorkWithSelection<TCallbackResult> {
    private _skipCall: number = 0;

    private _getTextNode(field: HTMLElement): ITextNode[] {
        let result = [];
        if (field) {
            if (field.childNodes.length) {
                for (let i = 0; i < field.childNodes.length; i++) {
                    if (field.childNodes[i].nodeType === 3) {
                        result.push({
                            parent: field,
                            children: field.childNodes[i],
                        });
                    } else {
                        result = [
                            ...result,
                            ...this._getTextNode(field.childNodes[i] as HTMLElement),
                        ];
                    }
                }
            }
        }
        return result;
    }

    setSelectionRange(field: HTMLInputElement, selection: ISelection): boolean {
        /*
         * В IE происходит авто-фокусировка поля, если вызвать изменение выделения. Поэтому меняем его только
         * при условии фокусировки в данный момент.
         */
        if (
            WorkWithSelection.hasSelectionChanged(field, selection) &&
            WorkWithSelection.isFieldFocused(field)
        ) {
            /*
             * См. выше "Баг №1".
             */
            if (!detection.isIE) {
                this._skipCall++;
            }
            if (field.setSelectionRange) {
                // Не стоит использовать setSelectionRange, так как при перерисовке,
                // можно получить неадекватное поведение, поэтому задаем выделение через selectionStart/End
                // https://online.sbis.ru/opendoc.html?guid=4a439ae2-5113-4731-b67a-65ee823de01c&client=3
                field.selectionStart = selection.start;
                field.selectionEnd = selection.end;
            } else {
                const nodes = this._getTextNode(field);
                let positionStart = selection.start;
                let positionEnd = selection.end;
                let isSetStart = false;
                const range = document.createRange();
                const sel = window.getSelection();
                sel.removeAllRanges();
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].parent.innerText.length >= positionStart && !isSetStart) {
                        range.setStart(nodes[i].children, positionStart);
                        isSetStart = true;
                    }
                    if (i === nodes.length - 1 && nodes[i].parent.innerText.length < positionEnd) {
                        positionEnd = nodes[i].parent.innerText.length;
                    }
                    if (nodes[i].parent.innerText.length >= positionEnd) {
                        range.setEnd(nodes[i].children, positionEnd);
                        if (isSetStart) {
                            sel.addRange(range);
                        }
                        break;
                    }
                    positionStart -= nodes[i].parent.innerText.length;
                    positionEnd -= nodes[i].parent.innerText.length;
                }
            }
            // Когда в поле ввода веден большой текст, не срабатывает авто подскролл к нужному месту
            // Поэтому если каретка находится в самом конце, то скролим самостоятельно
            // https://online.sbis.ru/opendoc.html?guid=c01d9df0-618b-4a0f-897b-2fc1e5f51f88
            if (field.value?.length === selection.start && field.value?.length === selection.end) {
                field.scrollLeft = field.scrollWidth;
            }
            return true;
        }
        return false;
    }

    call(handler: () => TCallbackResult): TCallbackResult | false {
        if (this._skipCall > 0) {
            this._skipCall--;
            return false;
        }

        return handler();
    }

    static hasSelectionChanged(field: HTMLInputElement, selection: ISelection): boolean {
        return field.selectionStart !== selection.start || field.selectionEnd !== selection.end;
    }

    static isFieldFocused(field: HTMLInputElement): boolean {
        if (constants.isBrowserPlatform) {
            return field === document.activeElement;
        }

        return false;
    }
}

export default WorkWithSelection;
