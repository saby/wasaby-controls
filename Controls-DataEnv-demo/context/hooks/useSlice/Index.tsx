import * as React from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import 'Controls-DataEnv-demo/context/hooks/Factory';

function SearchInput(props: { storeId: string }): React.ReactElement {
    const slice = useSlice(props.storeId);

    const onChange = React.useCallback((e) => {
        slice.setState({
            value: e.target.value,
        });
    }, []);

    return <input onChange={onChange} value={slice?.state.value} />;
}

function SearchValue(props: { storeId: string }): React.ReactElement {
    const slice = useSlice(props.storeId);

    return <span>Значение строки поиска: {slice?.state.value}</span>;
}

function useSelectorDemo(_, ref): React.ReactElement {
    return (
        <div className={'tw-contents'} ref={ref}>
            <div className={'tw-flex tw-flex-col'}>
                <div className={'tw-flex tw-flex-col'}>
                    <div>Первая строка поиска:</div>
                    <div className={'tw-flex tw-flex-col'}>
                        <SearchValue storeId={'firstSearch'} />
                        <SearchInput storeId={'firstSearch'} />
                    </div>
                </div>
                <div className={'tw-flex tw-flex-col'}>
                    <div>Вторая строка поиска:</div>
                    <div className={'tw-flex tw-flex-col'}>
                        <SearchValue storeId={'secondSearch'} />
                        <SearchInput storeId={'secondSearch'} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const component = React.forwardRef(useSelectorDemo);
component.getLoadConfig = () => {
    return {
        firstSearch: {
            dataFactoryName: 'Controls-DataEnv-demo/context/hooks/Factory',
            dataFactoryArguments: {},
        },
        secondSearch: {
            dataFactoryName: 'Controls-DataEnv-demo/context/hooks/Factory',
            dataFactoryArguments: {},
        },
    };
};
export default component;
