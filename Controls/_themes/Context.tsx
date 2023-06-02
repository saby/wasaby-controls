/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */

import * as React from 'react';

export interface IWrapperVariablesContext {
    variables?: Record<string, unknown>;
    className?: string;
}

interface IProviderProps {
    value: IWrapperVariablesContext;
    children?: React.ReactElement;
}

/**
 * Класс, устанавливающий контекст, значений для Controls.themes:wrapper
 * @class Controls/_themes/Context
 * @public
 */
const Context = React.createContext<IWrapperVariablesContext>(undefined);
const Provider = React.forwardRef((props: IProviderProps, ref) => {
    return <Context.Provider value={props.value}>
        {React.cloneElement(props.children, {...props.children.props, ...props.attrs, ref})}
    </Context.Provider>;
});
export default Context;
export {
    Provider
};


