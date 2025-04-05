import * as React from 'react';
import { IEditorValidation, IObjectTypeFactoryArguments } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';

export interface IContext {
    /**
     * Валидация для PropertyGrid
     */
    validation: IEditorValidation | undefined;
    value: RecordSet;
    onChange: (value: RecordSet) => void;
    pgFactoryArguments: Partial<IObjectTypeFactoryArguments>;
}

interface IContextProviderProps extends IContext {
    children?: React.ReactNode;
}

export const Context = React.createContext<IContext>(null as unknown as IContext);

export default function ContextProvider(props: IContextProviderProps) {
    const data = React.useMemo(() => {
        return {
            validation: props.validation,
            value: props.value,
            onChange: props.onChange,
            pgFactoryArguments: props.pgFactoryArguments,
        };
    }, [props.validation, props.value, props.onChange, props.pgFactoryArguments]);
    return <Context.Provider value={data} children={props.children} />;
}
