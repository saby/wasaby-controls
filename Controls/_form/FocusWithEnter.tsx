/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import { forwardRef, useCallback, cloneElement, useContext, useMemo } from 'react';
import { IControlOptions } from 'UI/Base';
import { constants } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import { focusNextElement, findNextElement } from 'UI/Focus';
import { getWasabyContext } from 'UI/Contexts';

/**
 * Контроллер, который обрабатывает нажатие клавиши enter и переводит фокус на след. поле ввода.
 * @extends UI/Base:Control
 * @public
 */

export default forwardRef((props: IControlOptions, ref) => {
    const wasabyContext = getWasabyContext();
    const context = useContext(wasabyContext);
    const contextValue = useMemo(() => {
        return {...context, workByKeyboard: true};
    }, [context]);
    /**
     * Проверяет, может ли элемент быть сфокусирован по ENTER
     * @param {HTMLElement} target Проверяемый html-элемент
     */
    const isFocusable = (target: HTMLElement): boolean => {
        // Пропускаю все элементы, для которых не нужен переход по enter.
        return target && !target.closest('.controls-notFocusOnEnter');
    };
    const keyDownHandler = useCallback((e: SyntheticEvent<KeyboardEvent> | KeyboardEvent): void => {
        const nativeEvent: KeyboardEvent = (e as SyntheticEvent<KeyboardEvent>).nativeEvent || (e as KeyboardEvent);
        const enterPressed = nativeEvent.keyCode === constants.key.enter;
        const altOrShiftPressed = nativeEvent.altKey || nativeEvent.shiftKey;
        const ctrlPressed = nativeEvent.ctrlKey || nativeEvent.metaKey;

        if (!isFocusable(document?.activeElement)) {
            return;
        }

        if (!altOrShiftPressed && !ctrlPressed && enterPressed) {
            e.stopPropagation();
            e.preventDefault();

            let current;

            // Для исключения зацикливания, ограничиваем количество попыток найти элемент для фокусировки
            const maxFindAttemptNumber = 100;
            let index = 0;

            // Ищем элемент для фокусировки
            let target: HTMLElement = findNextElement();

            while (target && !isFocusable(target) && index < maxFindAttemptNumber) {
                current = target;
                target = findNextElement(false, current);
                index++;
            }

            // Не переводим фокус, если не нашли элемент за приемлемое количество попыток
            if (target && index !== maxFindAttemptNumber) {
                focusNextElement(false, current, {
                    enableScrollToElement: 'vertical',
                });
            }
        }
    }, []);

    return <wasabyContext.Provider value={contextValue}>
        {cloneElement(
            props.children || props.content,
            {
                ...(props.children.props || props.content.props || {}),
                ref,
                onKeyDown: keyDownHandler
            }
        )}
    </wasabyContext.Provider>;
});
