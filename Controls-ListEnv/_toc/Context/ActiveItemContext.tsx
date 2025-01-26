/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import * as React from 'react';
import { CrudEntityKey } from 'Types/source';
import { TInternalProps } from 'UICore/Executor';

export interface IContextValue {
    activeElement: CrudEntityKey | null;
    onActiveElementChanged: (activeElement: CrudEntityKey | null) => void;
}

export const ActiveItemContext = React.createContext<IContextValue>(null);

interface IProps extends TInternalProps {
    storeId: string;
    activeElementChangingMode: 'context' | 'rootChanged' | 'events';
    // позволяет сохранить коллбек для установки активного элемента при смене корня.
    // Не вызывается при activeElementChangingMode == 'events'
    setActiveElementChangeCallback: Function;
}

/**
 * Провайдер контекста с активным элементом для связки списка с оглавлением
 * @param props
 * @constructor
 */
export default function Provider(props: IProps) {
    const [activeElement, setActiveElement] = React.useState<CrudEntityKey | null>(null);
    const value = React.useMemo(() => {
        if (props.activeElementChangingMode === 'events') {
            return null;
        }
        return {
            activeElement,
            onActiveElementChanged: (value: CrudEntityKey) => {
                if (props.activeElementChangingMode === 'context' && activeElement !== value) {
                    setActiveElement(value);
                }
            },
        };
    }, [activeElement, props.activeElementChangingMode]);
    React.useEffect(() => {
        if (props.activeElementChangingMode !== 'events') {
            props.setActiveElementChangeCallback?.((_activeElement: CrudEntityKey) => {
                setActiveElement(_activeElement);
            });
        }
    }, [props.activeElementChangingMode]);
    return (
        <ActiveItemContext.Provider value={value}>
            {React.cloneElement(props.children, { ...props })}
        </ActiveItemContext.Provider>
    );
}
