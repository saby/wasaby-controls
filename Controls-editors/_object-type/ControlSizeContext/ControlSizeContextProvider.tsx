import { ReactNode, useMemo } from 'react';
import { IControlSizeContext, ControlSizeContext } from './ControlSizeContext';

export interface IControlSizeContextProviderProps extends IControlSizeContext {
    children: ReactNode;
}

/**
 * Провайдер для создания контекста с доступом к размерам контрола
 * @public
 */
export const ControlSizeContextProvider = function ControlSizeContextProvider(
    props: IControlSizeContextProviderProps
) {
    const { getSize, getParentSize, children } = props;

    const contextValue = useMemo<IControlSizeContext>(() => {
        return {
            getSize,
            getParentSize,
        };
    }, [getSize, getParentSize]);

    return (
        <ControlSizeContext.Provider value={contextValue}>{children}</ControlSizeContext.Provider>
    );
};

ControlSizeContextProvider.displayName = 'Controls-editors/object-type:ControlSizeContextProvider';
