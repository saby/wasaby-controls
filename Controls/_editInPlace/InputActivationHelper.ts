/**
 * @kaizen_zone 9667df49-f81c-47b7-8671-9b43a1025495
 */
import { Model } from 'Types/entity';
import { getWidth } from 'Controls/sizeUtils';
import { hasHorizontalScroll as hasHorizontalScrollUtil } from 'Controls/scroll';
import { CONSTANTS } from './Types';
import { detection } from 'Env/Env';
import { activate } from 'UI/Focus';

const typographyStyles = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'letterSpacing',
    'textTransform',
    'wordSpacing',
    'textIndent',
];

// TODO: Импортировать из библиотеки полей ввода.
const NEW_INPUT_JS_SELECTOR = 'js-controls-Field';

/**
 * Интерфейс опций контроллера редактирования по месту.
 * @interface Controls/_editInPlace/InputActivationHelper
 * @private
 */

export class InputActivationHelper {
    private _clickItemInfo?: {
        clientX: number;
        clientY: number;
        item: Model;
    };
    private _editingTarget?: {
        item: Model;
        originTarget: HTMLElement;
        itemsContainer?: HTMLElement;
        selector?: string;
    };
    private _shouldActivate: boolean;
    private _paramsForFastEdit?: {
        container: HTMLDivElement | HTMLTableSectionElement;
        selector: string;
    };

    /**
     * Сохраняет метаинформацию о месте клика по записи
     */
    setClickInfo(event: MouseEvent, item: Model): void {
        if (this._clickItemInfo && this._clickItemInfo.item === item) {
            return;
        }
        this._clickItemInfo = {
            clientX: event.clientX,
            clientY: event.clientY,
            item,
        };
    }

    setEditingTarget(item: Model, target: HTMLElement): void {
        if (this._editingTarget && this._editingTarget.item === item) {
            return;
        }
        this._editingTarget = {
            item,
            originTarget: target,
            itemsContainer: target.closest(
                '.controls-GridViewV__itemsContainer'
            ),
        };

        if (
            this._editingTarget.originTarget &&
            this._editingTarget.itemsContainer
        ) {
            const currentRow = target.closest('.controls-Grid__row');
            const currentCell = target.closest('.controls-Grid__row-cell');
            const rows = Array.from(
                this._editingTarget.itemsContainer.children
            );
            const cells = Array.from(currentRow.children);
            const rowIndex = rows.indexOf(currentRow) + 1;
            const cellIndex = cells.indexOf(currentCell) + 1;
            this._editingTarget.selector = `.controls-Grid__row:nth-child(${rowIndex}) .controls-Grid__row-cell:nth-child(${cellIndex})`;
        }
    }

    /**
     * Сохраняет информацию о необходимости ставить фокус
     */
    shouldActivate(): void {
        this._shouldActivate = true;
    }

    /**
     * Устанавливает фокус в поле ввода.
     */
    activateInput(
        activateRowCallback: Function,
        beforeFocus?: (target: HTMLElement) => void
    ): void {
        if (
            detection.isMobileSafari ||
            !(
                this._clickItemInfo ||
                this._shouldActivate ||
                this._paramsForFastEdit
            )
        ) {
            return;
        }

        const reset = () => {
            this._clickItemInfo = null;
            this._shouldActivate = false;
            this._paramsForFastEdit = null;
            this._editingTarget = null;
        };

        // Активация контролов ввода по клику
        if (this._clickItemInfo) {
            // Сначала проверяем, не кликнули ли по полю ввода и пытаемся его активировать.
            // Если не получилось - пробуем активировать ближайшее поле ввода в редактируемой области.
            // Для таблицы области редактирования это ячейка и строка, для плоского списка только строка.
            // Если не получилось активировать контрол в ближайшей к клику ячейке
            // (метод _tryActivateByEditingTargetClick, работает через систему фокусов из ядра), активируем
            // контрол обертку строки, которая проставит фокус в первое поле ввода в строке.
            if (
                this._tryActivateByInputClick(beforeFocus) ||
                this._tryActivateByEditingTargetClick() ||
                (this._shouldActivate && activateRowCallback())
            ) {
                reset();
            }
        } else if (this._paramsForFastEdit) {
            let input = this._paramsForFastEdit.container.querySelector(
                this._paramsForFastEdit.selector
            );
            if (!input) {
                /*
                Если не удалось найти input, на который нужно навести фокус, то пытаемся найти 1 найденый input
                 */
                const selectors = this._paramsForFastEdit.selector.split(' ');
                const selector = `${selectors[0]} ${
                    selectors[selectors.length - 1]
                }`;
                const inputs = Array.from(
                    this._paramsForFastEdit.container.querySelectorAll(selector)
                );
                input = inputs.find((el) => {
                    return !el.closest('.js-controls-ListView__checkbox');
                });
            }
            if (input) {
                if (beforeFocus) {
                    beforeFocus(input);
                }
                input.focus(input);
                reset();
            }
        } else if (this._shouldActivate && activateRowCallback()) {
            reset();
        }
    }

    /**
     * Сохраняет информацию о поле ввода, в которое необходимо ставить фокус
     */
    setInputForFastEdit(
        currentTarget: HTMLElement,
        direction: CONSTANTS.GOTONEXT | CONSTANTS.GOTOPREV
    ): void {
        // Ячейка, с которой уходит фокус
        const cell = currentTarget.closest('.controls-Grid__row-cell');
        if (!cell) {
            return;
        }

        let input;
        let inputClass;
        const inputPrefix = 'js-controls-Grid__editInPlace__input-';

        // Поле ввода с которого уходит фокус
        do {
            input = input ? input.parentNode : currentTarget;
            inputClass = Array.prototype.find.call(
                input.classList,
                (className) => {
                    return className.indexOf(inputPrefix) >= 0;
                }
            );
        } while (cell !== input && !inputClass);

        if (input === cell) {
            return;
        }

        // Получение индекса строки в которой продолжится редактирование. Вычисляем аналогично ячейке - через DOM.
        // https://online.sbis.ru/opendoc.html?guid=02f1dead-d957-4346-b6c1-306606b6fb9c
        const container = currentTarget.closest(
            '.controls-GridViewV__itemsContainer'
        );
        const currentRow = currentTarget.closest('.controls-Grid__row');
        const rows = Array.from(currentRow.parentElement.children);
        let nextRowIndex;

        // Поиск следующей строки с данными в вёрстке
        for (
            let i =
                rows.indexOf(currentRow) +
                (direction === CONSTANTS.GOTONEXT ? 1 : -1);
            direction === CONSTANTS.GOTONEXT ? i < rows.length : i >= 0;
            direction === CONSTANTS.GOTONEXT ? i++ : i--
        ) {
            if (
                rows[i].className.indexOf('js-controls-Grid__data-row') !== -1
            ) {
                nextRowIndex = i;
                break;
            }
        }

        if (typeof nextRowIndex === 'undefined') {
            this._paramsForFastEdit = null;
            return;
        } else {
            nextRowIndex++;
        }

        // Получение индекса колонки в которой продолжится редактирование
        const columnIndex =
            1 + Array.prototype.indexOf.call(currentRow.children, cell);

        this._paramsForFastEdit = {
            container: container as HTMLTableSectionElement | HTMLDivElement,
            selector: `.controls-Grid__row:nth-child(${nextRowIndex}) .controls-Grid__row-cell:nth-child(${columnIndex}) .${inputClass} .${NEW_INPUT_JS_SELECTOR},
                 .controls-Grid__row:nth-child(${nextRowIndex}) .controls-Grid__row-cell:nth-child(${columnIndex}) .${inputClass} input`,
        };
    }

    protected _tryActivateByInputClick(
        beforeFocus?: (target: HTMLElement) => void
    ): boolean {
        type TEditable = HTMLInputElement | HTMLTextAreaElement;
        let target = document.elementFromPoint(
            this._clickItemInfo.clientX,
            this._clickItemInfo.clientY
        ) as TEditable;
        let isInput =
            target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
        let isNewInput = false;

        // В отличае от простых полей ввода, для которых можно сэмулировать ввод фокуса,
        // у более сложных (например комбобокс),
        // это не приведет к должному результату.
        // Не активируем его.
        // return true; означает, что все что можно предпринять для активации контрола было сделано.
        if (target.closest('.controls-ComboBox')) {
            return true;
        } else if (target.closest('.controls-Lookup')) {
            if (beforeFocus) {
                beforeFocus(target);
            }
            target.focus();
            return true;
        } else if (!isInput && target instanceof Element) {
            // Поля ввода с contenteditable не содержат <input>, а у SVG.polygon className это объект SVGAnimatedString
            const newInput =
                typeof target.className === 'string' &&
                target.className.indexOf(NEW_INPUT_JS_SELECTOR) !== -1
                    ? target
                    : target.closest(`.${NEW_INPUT_JS_SELECTOR}`);
            if (newInput) {
                // @ts-ignore
                target = newInput;
                isInput = true;
                isNewInput = true;
            }
        }

        const targetValue = isInput
            ? isNewInput
                ? target.innerText
                : target.value
            : undefined;
        const setSelection = (position: number) => {
            // Для новых полей ввода пока не устанавливаем,
            if (!isNewInput) {
                target.setSelectionRange(position, position);
            }
        };

        // Выполняем корректировку выделения только в случае пустого выделения
        // (учитываем опцию selectOnClick для input-контролов).
        // https://online.sbis.ru/opendoc.html?guid=904a460a-02da-46a7-bb61-5e0ed2dc4375
        const isEmptySelection =
            isInput && target.selectionStart === target.selectionEnd;

        if (isInput && isEmptySelection) {
            const fakeElement = document.createElement('div');
            fakeElement.innerText = '';

            const targetStyle = getComputedStyle(target);
            const hasHorizontalScroll = hasHorizontalScrollUtil(target);

            /*
             Если элемент выравнивается по правому краю, но при этом влезает весь текст, то нужно рассчитывать
             положение курсора от правого края input'а, т.к. перед текстом может быть свободное место.
             Во всех остальных случаях нужно рассчитывать от левого края, т.к. текст гарантированно прижат к нему.
             */
            let offset;
            if (targetStyle.textAlign === 'right' && !hasHorizontalScroll) {
                offset =
                    target.getBoundingClientRect().right -
                    this._clickItemInfo.clientX;
            } else {
                offset =
                    this._clickItemInfo.clientX -
                    target.getBoundingClientRect().left;
            }
            typographyStyles.forEach((prop) => {
                fakeElement.style[prop] = targetStyle[prop];
            });
            let i = 0;
            let currentWidth;
            let previousWidth;
            for (; i < targetValue.length; i++) {
                currentWidth = getWidth(fakeElement);
                if (currentWidth > offset) {
                    break;
                }
                if (targetStyle.textAlign === 'right' && !hasHorizontalScroll) {
                    fakeElement.innerText = targetValue.slice(
                        targetValue.length - 1 - i
                    );
                } else {
                    fakeElement.innerText += targetValue[i];
                }
                previousWidth = currentWidth;
            }

            if (beforeFocus) {
                beforeFocus(target);
            }
            /*
              When editing starts, EditingRow calls this.activate() to focus first focusable element.
              But if a user has clicked on an editable field, we can do better - we can set caret exactly
              where the user has clicked. But before moving the caret we should manually focus the right field.
             */
            target.focus();

            const lastLetterWidth = currentWidth - previousWidth;
            if (targetStyle.textAlign === 'right' && !hasHorizontalScroll) {
                if (currentWidth - offset < lastLetterWidth / 2) {
                    setSelection(targetValue.length - i);
                } else {
                    setSelection(targetValue.length - i + 1);
                }
            } else if (currentWidth - offset < lastLetterWidth / 2) {
                setSelection(i);
            } else {
                setSelection(i - 1);
            }

            target.scrollLeft = 0;
            return true;
        }
        return false;
    }

    protected _tryActivateByEditingTargetClick(): boolean {
        if (this._editingTarget?.selector) {
            // В таблице пытаемся активировать ближайшее поле ввода в ячейке.
            // Если этого сделать не получилось, будет попытка активировать первое поле ввода в строке.
            const cell = this._editingTarget.itemsContainer.querySelector(
                this._editingTarget.selector
            );
            return !!cell && this._activateDomElement(cell as HTMLElement);
        }
        return false;
    }

    protected _activateDomElement(element: HTMLElement): boolean {
        const activationResult = activate(element);
        const activeElement = document.activeElement;
        return (
            activationResult &&
            (activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA')
        );
    }
}
