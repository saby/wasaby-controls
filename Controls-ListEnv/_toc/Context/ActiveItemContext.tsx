/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import * as React from 'react';
import { CrudEntityKey } from 'Types/source';
import { TInternalProps } from 'UICore/Executor';

export interface IContextValue {
    activeElement: CrudEntityKey;
    onActiveElementChanged: (activeElement: CrudEntityKey) => void;
}

export const ActiveItemContext = React.createContext<IContextValue>(null);

interface IProps extends TInternalProps {
    activeElementFromContext: boolean;
}

/**
 * Провайдер контекста с активным элементом для связки списка с оглавлением
 * @param props
 * @constructor
 */
export default function Provider(props: IProps) {
    const [activeElement, setActiveElement] = React.useState<CrudEntityKey>(null);
    const value = React.useMemo(() => {
        if (!props.activeElementFromContext) {
            return null;
        }
        return {
            activeElement,
            onActiveElementChanged: (value: CrudEntityKey) => {
                if (activeElement !== value) {
                    setActiveElement(value);
                }
            },
        };
    }, [activeElement, props.activeElementFromContext]);

    return (
        <ActiveItemContext.Provider value={value}>
            {React.cloneElement(props.children, { ...props })}
        </ActiveItemContext.Provider>
    );
}
