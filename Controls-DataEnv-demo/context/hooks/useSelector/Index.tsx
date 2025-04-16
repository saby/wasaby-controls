import * as React from 'react';
import { useSelector, useSliceActions } from 'Controls-DataEnv/context';
import { Slice } from 'Controls-DataEnv/slice';
import 'Controls-DataEnv-demo/context/hooks/Factory';
import { useCallback } from 'react';

function SearchInput(props: { storeId: string }): React.ReactElement {
    const valueSelector = useCallback(
        (state) => {
            return state.firstSearch[props.storeId];
        },
        [props.storeId]
    );
    const value = useSelector<any, string>(valueSelector);

    const dispatcher = useSliceActions<Slice>('firstSearch');

    const onChange = React.useCallback((e) => {
        dispatcher.setState({
            [props.storeId]: e.target.value,
        });
    }, []);

    return <input onChange={onChange} value={value} />;
}

function SearchValue(props: { storeId: string }): React.ReactElement {
    const valueSelector = useCallback(
        (state) => {
            return state.firstSearch[props.storeId];
        },
        [props.storeId]
    );
    const value = useSelector<any, string>(valueSelector);

    return <span>Значение строки поиска: {value}</span>;
}

function useSelectorDemo(_, ref): React.ReactElement {
    return (
        <div className={'tw-contents'} ref={ref}>
            <div className={'tw-flex tw-flex-col'}>
                <div className={'tw-flex tw-flex-col'}>
                    <div>Первая строка поиска:</div>
                    <div className={'tw-flex tw-flex-col'}>
                        <SearchValue storeId={'search1'} />
                        <SearchInput storeId={'search1'} />
                    </div>
                </div>
                <div className={'tw-flex tw-flex-col'}>
                    <div>Вторая строка поиска:</div>
                    <div className={'tw-flex tw-flex-col'}>
                        <SearchValue storeId={'search2'} />
                        <SearchInput storeId={'search2'} />
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
    };
};
export default component;
