import * as React from 'react';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { RootContextProvider, Provider as DataContextProvider } from 'Controls-DataEnv/context';
import List from './List';
import Filter from './Filter';

const configs = {
    root: {
        configGetter: 'Controls-DataEnv-demo/context/RootContext/RootConfigGetter',
    },
    widget1: {
        configGetter: 'Controls-DataEnv-demo/context/RootContext/WidgetConfigGetter',
    },
    widget2: {
        configGetter: 'Controls-DataEnv-demo/context/RootContext/WidgetConfigGetter',
    },
};

function DemoComponent(props: any): JSX.Element {
    return (
        <RootContextProvider dataConfigs={props.loadResults}>
            <>
                <DataContextProvider dataLayoutId={'root'}>
                    <Filter storeId={'filter'} />
                </DataContextProvider>
                <DataContextProvider dataLayoutId={'widget1'}>
                    <List storeId={'list'} />
                </DataContextProvider>
                <DataContextProvider dataLayoutId={'widget2'}>
                    <List storeId={'list'} />
                </DataContextProvider>
            </>
        </RootContextProvider>
    );
}

function RootContextDemo() {
    const [loading, setLoading] = React.useState(true);
    const [loadResults, setLoadResults] = React.useState({});

    React.useEffect(() => {
        Loader.loadByConfigs(configs).then((loadResults) => {
            setLoadResults(loadResults);
            setLoading(false);
        });
    }, []);

    return loading ? null : <DemoComponent loadResults={loadResults} />;
}

export default React.forwardRef(RootContextDemo);
