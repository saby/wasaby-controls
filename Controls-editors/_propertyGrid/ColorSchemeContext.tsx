import { createContext, PropsWithChildren, ReactElement, useMemo } from 'react';

interface IProps {
    colorScheme: string;
}

interface IPropertyGridColorSchemeContext {
    colorScheme: string;
}

export const ColorSchemeContext = createContext<IPropertyGridColorSchemeContext>(
    {} as IPropertyGridColorSchemeContext
);

/**
 * Провайдер контекста с цветовой схемой в PropertyGrid
 * @private
 */
export function ColorSchemeContextProvider({
    colorScheme,
    children,
}: PropsWithChildren<IProps>): ReactElement {
    const scheme = useMemo(() => {
        return { colorScheme };
    }, [colorScheme]);

    return <ColorSchemeContext.Provider value={scheme}>{children}</ColorSchemeContext.Provider>;
}
