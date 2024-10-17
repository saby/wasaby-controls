import * as React from 'react';

/**
 * Интерфейс контекста
 */
export interface IColumnEditorsPopupContext {
    /**
     * Dom-элемент контейнера
     */
    popupContainer: HTMLElement | null;
}

/**
 * Контекст, содержащий информацию о DOM-элементе контейнера "Редактора колонок"
 * @public
 */
export const ColumnsEditorPopupContext = React.createContext<IColumnEditorsPopupContext>({
    popupContainer: null,
});
