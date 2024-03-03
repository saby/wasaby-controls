import * as React from 'react';
import { Loader } from 'Controls-DataEnv/dataLoader';
import {
    RootContextProvider,
    Provider as DataContextProvider,
    useContextNode,
    useStrictSlice,
} from 'Controls-DataEnv/context';

const configs = {
    widget: {
        configGetter:
            'Controls-DataEnv-demo/context/RootContext/DynamicContextCreation/configGetters:widgetConfig',
    },
};

function Widget(): JSX.Element {
    const slice = useStrictSlice('widgetData');
    return <div>{`Значение виджета ${slice.state}`}</div>;
}
interface IWrappedWidgetProps {
    dataLayout: string;
}
function WrappedWidget(props: IWrappedWidgetProps): JSX.Element {
    return (
        <DataContextProvider dataLayoutId={props.dataLayout}>
            <Widget />
        </DataContextProvider>
    );
}

interface ICreateWidgetButtonProps {
    onWidgetCreated: Function;
}

function CreateWidgetButton(props: ICreateWidgetButtonProps): JSX.Element {
    const contextNode = useContextNode();
    const onClick = React.useCallback(async () => {
        await contextNode.createNode('dynamicWidget', {
            configGetter:
                'Controls-DataEnv-demo/context/RootContext/DynamicContextCreation/configGetters:widgetConfigDynamic',
        });
        props.onWidgetCreated();
    }, [contextNode]);
    return <div onClick={onClick}>Создать виджет</div>;
}

function DemoComponent(props): JSX.Element {
    const [widgetCreated, setWidgetCreated] = React.useState(false);
    const onWidgetCreated = React.useCallback(() => {
        setWidgetCreated(true);
    }, []);
    return (
        <RootContextProvider dataConfigs={props.loadResults}>
            <div>
                <CreateWidgetButton onWidgetCreated={onWidgetCreated} />
                <WrappedWidget dataLayout={'widget'} />
                {widgetCreated && <WrappedWidget dataLayout={'dynamicWidget'} />}
            </div>
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
