/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import { forwardRef, useCallback, cloneElement, useContext, useMemo } from 'react';
import { constants } from 'Env/Env';
import { SyntheticEvent } from 'UI/Events';
import { focusNextElement, findNextElement } from 'UI/Focus';
import { getWasabyContext } from 'UI/Contexts';
import { IComponentProps } from './interface';

interface IFocusWithEnterProps extends IComponentProps {
    children: JSX.Element;
    content: JSX.Element;
}

/**
 * Контроллер, который обрабатывает нажатие клавиши enter и переводит фокус на след. поле ввода.
 * @extends UI/Base:Control
 * @public
 */

export default forwardRef((props: IFocusWithEnterProps, ref) => {
    const wasabyContext = getWasabyContext();
    const context = useContext(wasabyContext);
    const contextValue = useMemo(() => {
        return { ...context, workByKeyboard: true };
    }, [context]);
    /**
     * Проверяет, может ли элемент быть сфокусирован по ENTER
     * @param {HTMLElement} target Проверяемый html-элемент
     */
    const isFocusable = (target: Element | null): boolean => {
        // Пропускаю все элементы, для которых не нужен переход по enter.
        return !!target && !target.closest('.controls-notFocusOnEnter');
    };
    const keyDownHandler = useCallback((e: SyntheticEvent<KeyboardEvent> | KeyboardEvent): void => {
        const nativeEvent: KeyboardEvent =
            (e as SyntheticEvent<KeyboardEvent>).nativeEvent || (e as KeyboardEvent);
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
            let target: HTMLElement | null = findNextElement();

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

    const content = props.children || props.content;

    return (
        <wasabyContext.Provider value={contextValue}>
            {cloneElement(content, {
                ...(content.props || {}),
                ref,
                onKeyDown: keyDownHandler,
            })}
        </wasabyContext.Provider>
    );
});
