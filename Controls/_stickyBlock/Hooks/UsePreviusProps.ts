/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import * as React from 'react';

/**
 * Кастомный хук, сохраняющий пропсы между рендерами.
 * @private
 */
export function usePreviousProps<T>(value: T, initialValue: T): T {
    const ref = React.useRef<T>(initialValue);
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
