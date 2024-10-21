import * as React from 'react';

export interface IColumnEditorsPopupContext {
    popupContainer: HTMLElement | null;
}

export const ColumnsEditorPopupContext = React.createContext<IColumnEditorsPopupContext>({
    popupContainer: null,
});
