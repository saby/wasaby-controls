import { createContext } from 'react';

export interface IPropertyGridContext {
    changePath: () => void | null;
}

export const PropertyGridContext = createContext<IPropertyGridContext>({
    changePath: () => undefined,
});
