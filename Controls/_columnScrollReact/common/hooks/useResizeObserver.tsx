/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';

/**
 * Событие изменения размеров.
 * @private
 */
export type TResizeEventHandler = (entry: ResizeObserverEntry) => void;

/**
 * Кастомный хук, позволяющий следить за изменением размеров элемента.
 * Возвращает ссылку, которую следует навесить на отслеживаемый элемент.
 * ИСПОЛЬЗУЕТСЯ ТОЛЬКО В ПЛАТФОРМЕННОМ СКРОЛЛБАРЕ.
 * @deprecated НЕ РЕКОМЕНДОВАН к использованию, вместо этого для решения задач должен
 * использоваться ResizeObserverContainer.
 * @param callback Обработчик события изменения размеров.
 * @private
 */
export default function useResizeObserver<TRefTarget extends Element>(
    callback: TResizeEventHandler
) {
    const ref = React.useRef<TRefTarget>(null);

    React.useLayoutEffect(() => {
        const element = ref?.current;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            callback(entries[0]);
        });

        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [callback, ref]);

    return ref;
}
