import * as React from 'react';

export const Context = React.createContext(undefined);

export function ContextProvider(props) {
    return (
        <Context.Provider value="Текст из контекста страницы">{props.children}</Context.Provider>
    );
}
