import * as React from 'react';

/**
 * Интерфейс контекста
 */
interface IDragNDropContextValue {
    /**
     * Идентификатор перемещаемого элемента
     */
    id: number;
    /**
     * Ширина перемещаемого элемента
     */
    width: number;
}

/**
 * Контекст, содержащий информацию о перемещаемом элементе
 */
export const DragNDropContext = React.createContext<IDragNDropContextValue | undefined>(undefined);
