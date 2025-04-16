import { createContext } from 'react';
import { ObjectMeta } from 'Meta/types';

interface IPropertyGridPath {
    path: string[];
    meta: ObjectMeta;
}

export interface IPropertyGridContext {
    changePath: (path: IPropertyGridPath) => void | null;
}

/**
 * Контекст, через который редакторы могут задать, какой уровень объекта будет редактироваться в проперти гриде.
 */
export const PropertyGridContext = createContext<IPropertyGridContext>({
    changePath: () => undefined,
});
