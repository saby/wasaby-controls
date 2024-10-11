import * as React from 'react';

/**
 * Кастомный хук, сохраняющий пропсы скроллбара между рендерами.
 * @private
 */
export function usePreviousScrollbarProps(value): { contentSize: number } {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
