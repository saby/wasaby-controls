import * as React from 'react';

import { DataContext, Provider } from 'Controls-DataEnv/context';
import { IDataConfig } from 'Controls/dataFactory';

const DataContextCombinedProvider = React.memo(function (props: {
    parentDataContextValue: Record<string | number, unknown>;
    children: React.JSX.Element;
}) {
    const { parentDataContextValue } = props;
    const listDataContext = React.useContext(DataContext);

    const combinedContextValue = React.useMemo(() => {
        return {
            ...parentDataContextValue,
            ...listDataContext,
        };
    }, [listDataContext, parentDataContextValue]);

    return <DataContext.Provider value={combinedContextValue} children={props.children} />;
});

export default React.memo(
    React.forwardRef<unknown>(function TransparentContextProvider(
        props: {
            configs: Record<string | number, IDataConfig>;
            loadResults: Record<string | number, unknown>;
            children: React.JSX.Element;
            attrs: unknown;
        },
        ref
    ): JSX.Element {
        // Родительский дата контекст склеивается с синтетическим для проброса ниже.
        const parentDataContextValue = React.useContext(DataContext);
        return (
            <Provider configs={props.configs} loadResults={props.loadResults}>
                <DataContextCombinedProvider parentDataContextValue={parentDataContextValue}>
                    {React.cloneElement(props.children, {
                        ...props,
                        ref,
                        attrs: props.attrs,
                    })}
                </DataContextCombinedProvider>
            </Provider>
        );
    })
);
