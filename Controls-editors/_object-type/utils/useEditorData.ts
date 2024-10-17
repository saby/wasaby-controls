import * as React from 'react';
import { EditorsDataContext } from '../Contexts';

/**
 * Хук для работы с собственными данными виджета
 * FIXME: заменить на useSlice, когда контексты научатся динамически добавлять ноды
 * @param name
 * @param defaultValue
 */
export function useEditorData<T extends object>(editorType: string): T | undefined {
    const context = React.useContext(EditorsDataContext);
    if (!context?.loadResults) {
        return;
    }
    return context.loadResults[editorType] as T;
}
