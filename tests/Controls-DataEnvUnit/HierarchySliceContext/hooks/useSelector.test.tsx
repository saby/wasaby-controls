/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react';
import { RootContextProvider, Provider, useSelector } from 'Controls-DataEnv/context';
import { simpleHierarchyConfig } from 'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig';
import useSliceActions from 'Controls-DataEnv/_context/hooks/useSliceActions';
import { Slice } from 'Controls-DataEnv/slice';
import { useEffect, useMemo } from 'react';

const dataConfigs = {
    contextConfigs: simpleHierarchyConfig.contextConfigs,
};

export interface ITestWidgetProps {
    storeId: string;
    getDispatcher: Function;
}

export default function TestWidget(props: ITestWidgetProps): JSX.Element {
    const value = useSelector<{ value: string }>((state: {}) => {
        return state[props.storeId].value;
    });

    const dispatcher = useSliceActions<Slice>(props.storeId);

    useEffect(() => {
        if (props.getDispatcher) {
            props.getDispatcher(dispatcher);
        }
    }, [props.getDispatcher]);

    return <div data-qa={props.storeId}>{value}</div>;
}

function PageComponent(props: { getDispatcher?: Function }): JSX.Element {
    return (
        <RootContextProvider dataConfigs={dataConfigs}>
            <Provider dataLayoutId={'root'}>
                <Provider dataLayoutId={'firstGetter'}>
                    <Provider dataLayoutId={'secondGetter'}>
                        <Provider dataLayoutId={'thirdGetter'}>
                            <TestWidget
                                storeId={'simpleElement'}
                                getDispatcher={props.getDispatcher}
                            />
                        </Provider>
                    </Provider>
                </Provider>
            </Provider>
        </RootContextProvider>
    );
}

function NestedProvidersPage(props: { getDispatcher?: Function }): JSX.Element {
    const config1 = useMemo(() => {
        return {
            configs: {
                firstSlice: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                    dataFactoryArguments: {},
                },
            },
            loadResults: {
                firstSlice: {
                    value: 'firstSlice',
                },
            },
        };
    }, []);

    const config2 = useMemo(() => {
        return {
            configs: {
                secondSlice: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                    dataFactoryArguments: {},
                },
            },
            loadResults: {
                secondSlice: {
                    value: 'secondSlice',
                },
            },
        };
    }, []);

    return (
        <Provider configs={config1.configs} loadResults={config1.loadResults}>
            <Provider configs={config2.configs} loadResults={config2.loadResults}>
                <>
                    <TestWidget storeId={'firstSlice'} getDispatcher={props.getDispatcher} />
                    <TestWidget storeId={'secondSlice'} getDispatcher={props.getDispatcher} />
                </>
            </Provider>
        </Provider>
    );
}

describe('Controls-DataEnvUnit/HierarchySliceContext/hooks/useSelector', () => {
    let container = null;
    let currentDispatcher;
    let getDispatcher;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        getDispatcher = (dispatcher): void => {
            currentDispatcher = dispatcher;
        };
    });

    afterEach(() => {
        container.remove();
        container = null;
    });

    test('widget получает доступ к слайсу из корня контекста по иерархии', async () => {
        const { getByTestId } = render(<PageComponent getDispatcher={getDispatcher} />, {
            container,
        });
        expect(getByTestId('simpleElement').innerHTML).toBe('simpleElementValue');
        await waitFor(() => {
            currentDispatcher.setState({
                value: 'newSliceValue',
            });
        });
        expect(getByTestId('simpleElement').innerHTML).toBe('newSliceValue');
    });

    test('widget получает доступ к стейту во вложенных провайдерах, при изменении верхнего уровня зависимый виджет обновляется', async () => {
        const dispatchers = [];
        const saveDispatcher = (disp) => {
            dispatchers.push(disp);
        };
        const { getByTestId } = render(<NestedProvidersPage getDispatcher={saveDispatcher} />, {
            container,
        });

        expect(getByTestId('firstSlice').innerHTML).toBe('firstSlice');
        expect(getByTestId('secondSlice').innerHTML).toBe('secondSlice');

        await waitFor(() => {
            dispatchers.forEach((curDisp) => {
                curDisp.setState({
                    value: 'newSliceValue',
                });
            });
        });
        expect(getByTestId('firstSlice').innerHTML).toBe('newSliceValue');
        expect(getByTestId('secondSlice').innerHTML).toBe('newSliceValue');
    });
});
